const crypto = require("crypto");

const {
  Booking,
  Customer,
  Payment,
} = require("../models");

const PAYFAST_PROCESS_URL =
  process.env.PAYFAST_SANDBOX === "true"
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

function generateSignature(data, passphrase = null) {
  let parameterString = "";

  for (const [key, value] of Object.entries(data)) {
    if (value !== "") {
      parameterString +=
        `${key}=${encodeURIComponent(String(value).trim())}&`;
    }
  }

  parameterString = parameterString.slice(0, -1);

  if (passphrase !== null && passphrase !== undefined) {
    parameterString +=
      `&passphrase=${encodeURIComponent(String(passphrase).trim())}`;
  }

  return crypto
    .createHash("md5")
    .update(parameterString)
    .digest("hex");
}

async function createPayment(req, res) {
  try {
    const bookingId = Number(req.params.bookingId);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        message: "Booking ID must be a positive integer",
      });
    }

    const customer = await Customer.findOne({
      where: {
        user_id: req.user.user_id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer profile not found",
      });
    }

    const booking = await Booking.findOne({
      where: {
        booking_id: bookingId,
        customer_id: customer.customer_id,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled bookings cannot be paid",
      });
    }

    const existingPayment = await Payment.findOne({
      where: {
        booking_id: booking.booking_id,
      },
    });

    if (existingPayment) {
      if (existingPayment.status === "complete") {
        return res.status(409).json({
          message: "This booking has already been paid",
        });
      }

      if (existingPayment.status === "pending") {
        return res.status(409).json({
          message: "A payment is already pending for this booking",
          payment: existingPayment,
        });
      }
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE;

    if (!merchantId || !merchantKey || !passphrase) {
      return res.status(500).json({
        message: "PayFast configuration is incomplete",
      });
    }

    const returnUrl = process.env.PAYFAST_RETURN_URL;
    const cancelUrl = process.env.PAYFAST_CANCEL_URL;
    const notifyUrl = process.env.PAYFAST_NOTIFY_URL;

    if (!returnUrl || !cancelUrl || !notifyUrl) {
      return res.status(500).json({
        message: "PayFast callback URLs are not configured",
      });
    }

    const merchantPaymentId =
      `BOOKING_${booking.booking_id}_${Date.now()}`;

    const payment = await Payment.create({
      booking_id: booking.booking_id,
      amount: booking.total_amount,
      method: "payfast",
      merchant_payment_id: merchantPaymentId,
      status: "pending",
      itn_verified: false,
    });

    const firstName = customer.first_name || "";
    const lastName = customer.last_name || "";

    const checkoutData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      name_first: firstName,
      name_last: lastName,
      email_address: req.user.email || "",
      m_payment_id: merchantPaymentId,
      amount: Number(booking.total_amount).toFixed(2),
      item_name:
        `Occasion Catering Booking #${booking.booking_id}`,
      item_description: booking.event_type,
    };

    checkoutData.signature = generateSignature(
      checkoutData,
      passphrase
    );

    return res.status(201).json({
      message: "PayFast payment created",
      payment: {
        payment_id: payment.payment_id,
        booking_id: booking.booking_id,
        amount: payment.amount,
        merchant_payment_id:
          payment.merchant_payment_id,
        status: payment.status,
      },
      checkout: {
        action: PAYFAST_PROCESS_URL,
        method: "POST",
        fields: checkoutData,
      },
    });
  } catch (error) {
    console.error(
      "Error creating PayFast payment:",
      error
    );

    return res.status(500).json({
      message: "Failed to create PayFast payment",
    });
  }
}

function buildValidationParameterString(data) {
  let parameterString = "";

  for (const [key, value] of Object.entries(data)) {
    if (
      key === "signature" ||
      value === "" ||
      value === null ||
      value === undefined
    ) {
      continue;
    }

    parameterString +=
      `${key}=${encodeURIComponent(String(value).trim())}&`;
  }

  return parameterString.slice(0, -1);
}

function verifySignature(data) {
  const receivedSignature = data.signature;

  if (!receivedSignature) {
    return false;
  }

  const passphrase = process.env.PAYFAST_PASSPHRASE;

  if (!passphrase) {
    return false;
  }

  const parameterString =
    buildValidationParameterString(data);

  const stringToHash =
    `${parameterString}&passphrase=${encodeURIComponent(
      passphrase.trim()
    )}`;

  const calculatedSignature = crypto
    .createHash("md5")
    .update(stringToHash)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, "utf8"),
    Buffer.from(receivedSignature, "utf8")
  );
}

async function handlePaymentNotification(req, res) {
  try {
    const notification = req.body;

    if (!notification || typeof notification !== "object") {
      return res.status(400).send("Invalid notification");
    }

    if (!verifySignature(notification)) {
      return res.status(400).send("Invalid signature");
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID;

    if (
      !merchantId ||
      notification.merchant_id !== merchantId
    ) {
      return res.status(400).send("Invalid merchant");
    }

    const merchantPaymentId = notification.m_payment_id;

    if (!merchantPaymentId) {
      return res.status(400).send("Missing payment ID");
    }

    const payment = await Payment.findOne({
      where: {
        merchant_payment_id: merchantPaymentId,
      },
      include: [
        {
          model: Booking,
        },
      ],
    });

    if (!payment) {
      return res.status(404).send("Payment not found");
    }

    const receivedAmount = Number(notification.amount);
    const expectedAmount = Number(payment.amount);

    if (
      !Number.isFinite(receivedAmount) ||
      receivedAmount.toFixed(2) !==
        expectedAmount.toFixed(2)
    ) {
      return res.status(400).send("Invalid amount");
    }

    const paymentStatus =
      notification.payment_status;

    const rawPayload =
      JSON.stringify(notification);

    if (paymentStatus === "COMPLETE") {
      await payment.update({
        status: "complete",
        gateway_payment_id:
          notification.pf_payment_id || null,
        itn_verified: true,
        raw_itn_payload: rawPayload,
        paid_at: new Date(),
      });

      await Booking.update(
        {
          status: "confirmed",
        },
        {
          where: {
            booking_id: payment.booking_id,
          },
        }
      );

      return res.status(200).send("OK");
    }

    if (paymentStatus === "CANCELLED") {
      await payment.update({
        status: "cancelled",
        gateway_payment_id:
          notification.pf_payment_id || null,
        itn_verified: true,
        raw_itn_payload: rawPayload,
      });

      await Booking.update(
        {
          status: "cancelled",
        },
        {
          where: {
            booking_id: payment.booking_id,
          },
        }
      );

      return res.status(200).send("OK");
    }

    await payment.update({
      status: "pending",
      gateway_payment_id:
        notification.pf_payment_id || null,
      itn_verified: true,
      raw_itn_payload: rawPayload,
    });

    return res.status(200).send("OK");
  } catch (error) {
    console.error(
      "Error processing PayFast notification:",
      error
    );

    return res.status(500).send("Notification processing failed");
  }
}

module.exports = {
  createPayment,
  handlePaymentNotification,
};