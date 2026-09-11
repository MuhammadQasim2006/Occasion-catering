const { Payment, Booking, Customer } = require('../models');
const { buildPaymentFields, PROCESS_URL, verifyItnSignature, validateWithPayFast } = require('../utils/payfast');

// POST /api/payments/initiate
// Body: { booking_id }
// Creates/refreshes the pending Payment row for a booking and returns the
// PayFast fields the frontend should auto-submit to PROCESS_URL.
exports.initiatePayment = async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ success: false, message: 'booking_id is required' });
    }

    const booking = await Booking.findByPk(booking_id, { include: [{ model: Payment }] });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Logged-in: must own the booking (or be admin). Guest (no req.user —
    // this route uses optionalAuth): no account to check against, so we
    // let it through on the booking_id itself, same as the booking lookup.
    if (req.user) {
      const customer = await Customer.findOne({ where: { user_id: req.user.user_id } });
      if (!customer) {
        return res.status(403).json({ success: false, message: 'No customer profile for this account' });
      }
      if (booking.customer_id !== customer.customer_id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    let payment = booking.Payment;
    if (payment && payment.status === 'complete') {
      return res.status(400).json({ success: false, message: 'This booking has already been paid for' });
    }

    // A merchant_payment_id has to be unique per attempt, so a retried
    // payment (e.g. after a cancel/fail) gets a fresh one rather than
    // reusing a stale reference PayFast has already seen.
    const merchantPaymentId = `OCC-${booking.booking_id}-${Date.now()}`;

    if (payment) {
      payment.merchant_payment_id = merchantPaymentId;
      payment.status = 'pending';
      payment.itn_verified = false;
      await payment.save();
    } else {
      payment = await Payment.create({
        booking_id: booking.booking_id,
        amount: booking.total_amount,
        method: 'payfast',
        merchant_payment_id: merchantPaymentId,
        status: 'pending',
      });
    }

    const [nameFirst, ...rest] = (booking.contact_name || '').trim().split(' ');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    const fields = buildPaymentFields({
      merchantId: process.env.PAYFAST_MERCHANT_ID,
      merchantKey: process.env.PAYFAST_MERCHANT_KEY,
      returnUrl: `${frontendUrl}/confirmation/${booking.booking_id}?payment=success`,
      cancelUrl: `${frontendUrl}/confirmation/${booking.booking_id}?payment=cancelled`,
      notifyUrl: `${backendUrl}/api/payments/notify`,
      nameFirst: nameFirst || undefined,
      nameLast: rest.join(' ') || undefined,
      emailAddress: booking.contact_email || undefined,
      mPaymentId: merchantPaymentId,
      amount: payment.amount,
      itemName: `Occasion Booking #${booking.booking_id}`,
      // booking.event_date comes back from Sequelize as a JS Date object —
      // interpolating it directly stringifies to the verbose
      // "Tue Dec 01 2026 00:00:00 GMT+0000 (Coordinated Universal Time)"
      // form, which is neither what a customer should see in their
      // PayFast summary nor what we intend to sign. Format it plainly.
      itemDescription: `Catering booking for ${booking.guest_count} guests on ${new Date(booking.event_date).toISOString().split('T')[0]}`,
      customStr1: String(booking.booking_id),
    });

    res.json({
      success: true,
      data: {
        action: PROCESS_URL,
        fields,
      },
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
};

// GET /api/payments/:bookingId
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const customer = req.user ? await Customer.findOne({ where: { user_id: req.user.user_id } }) : null;

    const payment = await Payment.findOne({
      where: { booking_id: bookingId },
      include: [
        {
          model: Booking,
          attributes: ['booking_id', 'status', 'total_amount', 'customer_id']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this booking'
      });
    }

    // Check ownership — only meaningful when someone's logged in. Guests
    // (no req.user) have no account to check against, so this is allowed
    // through on the booking_id itself, same as the other guest-checkout
    // lookups above.
    if (req.user && req.user.role !== 'admin' && (!customer || payment.Booking.customer_id !== customer.customer_id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        payment_id: payment.payment_id,
        payment_status: payment.status,
        amount: payment.amount,
        gateway_payment_id: payment.gateway_payment_id,
        merchant_payment_id: payment.merchant_payment_id,
        itn_verified: payment.itn_verified,
        paid_at: payment.paid_at,
        booking_status: payment.Booking.status
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status'
    });
  }
};

// POST /api/payments/notify - PayFast ITN webhook
//
// PayFast's own guidance is to always return HTTP 200 so it stops retrying
// the notify call, even when we reject the payload — so validation
// failures are logged, not surfaced as HTTP errors. We apply the three
// checks PayFast recommends before trusting the payload:
//   1. Signature matches what we'd compute from the same fields
//   2. A server-to-server call back to PayFast confirms the data is genuine
//   3. The paid amount matches what we expected for this booking
exports.handleITNWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log('ITN webhook received:', payload);

    const signatureOk = verifyItnSignature(payload);
    if (!signatureOk) {
      console.error('ITN signature mismatch — ignoring payload for', payload.m_payment_id);
      return res.status(200).send('OK');
    }

    const serverOk = await validateWithPayFast(req.rawBody || '');
    if (!serverOk) {
      console.error('ITN failed PayFast server validation — ignoring payload for', payload.m_payment_id);
      return res.status(200).send('OK');
    }

    const payment = await Payment.findOne({
      where: { merchant_payment_id: payload.m_payment_id },
      include: [{ model: Booking }]
    });

    if (!payment) {
      console.error('Payment not found for webhook:', payload.m_payment_id);
      return res.status(200).send('OK');
    }

    const expectedAmount = Number(payment.amount).toFixed(2);
    const paidAmount = Number(payload.amount_gross).toFixed(2);
    if (expectedAmount !== paidAmount) {
      console.error(`ITN amount mismatch for ${payload.m_payment_id}: expected ${expectedAmount}, got ${paidAmount}`);
      return res.status(200).send('OK');
    }

    payment.gateway_payment_id = payload.pf_payment_id || null;
    payment.raw_itn_payload = JSON.stringify(payload);
    payment.itn_verified = true;

    if (payload.payment_status === 'COMPLETE') {
      payment.status = 'complete';
      payment.paid_at = new Date();

      if (payment.Booking) {
        payment.Booking.status = 'confirmed';
        await payment.Booking.save();
      }
    } else if (payload.payment_status === 'FAILED') {
      payment.status = 'failed';
    } else if (payload.payment_status === 'CANCELLED') {
      payment.status = 'cancelled';
    }

    await payment.save();

    res.status(200).send('OK');
  } catch (error) {
    console.error('ITN Webhook error:', error);
    res.status(200).send('OK');
  }
};
