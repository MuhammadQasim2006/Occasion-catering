const { Payment, Booking, Customer } = require('../models');

// GET /api/payments/:bookingId
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const customer = await Customer.findOne({
      where: { user_id: req.user.id }
    });

    const payment = await Payment.findOne({
      where: { booking_id: bookingId },
      include: [
        {
          model: Booking,
          attributes: ['booking_id', 'status', 'total_amount']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this booking'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && payment.Booking.customer_id !== customer.customer_id) {
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

// POST /api/payments/notify - ITN Webhook
exports.handleITNWebhook = async (req, res) => {
  try {
    const rawPayload = req.body;
    
    console.log('ITN Webhook received:', rawPayload);

    // Find payment by merchant_payment_id
    const payment = await Payment.findOne({
      where: { merchant_payment_id: rawPayload.merchant_payment_id },
      include: [{ model: Booking }]
    });

    if (!payment) {
      console.error('Payment not found for webhook:', rawPayload.merchant_payment_id);
      return res.status(200).send('OK');
    }

    // Update payment record
    payment.gateway_payment_id = rawPayload.pf_payment_id || null;
    payment.raw_itn_payload = JSON.stringify(rawPayload);
    payment.itn_verified = true;

    if (rawPayload.payment_status === 'COMPLETE') {
      payment.status = 'complete';
      payment.paid_at = new Date();
      
      if (payment.Booking) {
        payment.Booking.status = 'confirmed';
        await payment.Booking.save();
      }
    } else if (rawPayload.payment_status === 'FAILED') {
      payment.status = 'failed';
    } else if (rawPayload.payment_status === 'CANCELLED') {
      payment.status = 'cancelled';
    }

    await payment.save();

    res.status(200).send('OK');
    
  } catch (error) {
    console.error('ITN Webhook error:', error);
    res.status(200).send('OK');
  }
};