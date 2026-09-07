const crypto = require("crypto");
const https = require("https");

const {
  Booking,
  Customer,
  Payment,
} = require("../models");

const PAYFAST_PROCESS_URL =
  process.env.PAYFAST_SANDBOX === "true"
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

const PAYFAST_VALIDATE_URL =
  process.env.PAYFAST_SANDBOX === "true"
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";

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

  if (
    !receivedSignature ||
    typeof receivedSignature !== "string"
  ) {
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

  if (calculatedSignature.length !== receivedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, "utf8"),
    Buffer.from(receivedSignature, "utf8")
  );
}

function requestPayFastValidation(data) {
  return new Promise((resolve, reject) => {
    const parameterString =
      buildValidationParameterString(data);

    const postData = parameterString;

    const url = new URL(PAYFAST_VALIDATE_URL);

    const request = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: "POST",
        port: 443,
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          "Content-Length":
            Buffer.byteLength(postData),
        },
      },
      (response) => {
        let responseBody = "";

        response.on("data", (chunk) => {
          responseBody += chunk.toString();
        });

        response.on("end", () => {
          resolve(responseBody.trim());
        });
      }
    );

    request.on("error", (error) => {
      reject(error);
    });

    request.write(postData);
    request.end();
  });
}

async function isValidPayFastSource(req) {
  const forwardedFor =
    req.headers["x-forwarded-for"];

  const clientIp =
    forwardedFor
      ? String(forwardedFor).split(",")[0].trim()
      : req.socket.remoteAddress;

  if (!clientIp) {
    return false;
  }

  let normalizedIp = clientIp;

  if (normalizedIp.startsWith("::ffff:")) {
    normalizedIp = normalizedIp.substring(7);
  }

  const validHosts = process.env.PAYFAST_SANDBOX === "true"
    ? [
        "sandbox.payfast.co.za",
      ]
    : [
        "www.payfast.co.za",
        "w1w.payfast.co.za",
        "w2w.payfast.co.za",
      ];

  const validIps = new Set();

  for (const hostname of validHosts) {
    try {
      const addresses = await new Promise(
        (resolve, reject) => {
          require("dns").lookup(
            hostname,
            {
              all: true,
            },
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(
                results.map(
                  (result) => result.address
                )
              );
            }
          );
        }
      );

      addresses.forEach((address) =>
        validIps.add(address)
      );
    } catch (error) {
      console.error(
        `Could not resolve PayFast host ${hostname}:`,
        error.message
      );
    }
  }

  return validIps.has(normalizedIp);
}

async function createPayment(req, res) {
  try {
    const bookingId = Number(req.params.bookingId);

    if (
      !Number.isInteger(bookingId) ||
      bookingId <= 0
    ) {
      return res.status(400).json({
        message:
          "Booking ID must be a positive integer",
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
        message:
          "Cancelled bookings cannot be paid",
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
          message:
            "This booking has already been paid",
        });
      }

      if (existingPayment.status === "pending") {
        return res.status(409).json({
          message:
            "A payment is already pending for this booking",
          payment: existingPayment,
        });
      }
    }

    const merchantId =
      process.env.PAYFAST_MERCHANT_ID;

    const merchantKey =
      process.env.PAYFAST_MERCHANT_KEY;

    const passphrase =
      process.env.PAYFAST_PASSPHRASE;

    if (
      !merchantId ||
      !merchantKey ||
      !passphrase
    ) {
      return res.status(500).json({
        message:
          "PayFast configuration is incomplete",
      });
    }

    const returnUrl =
      process.env.PAYFAST_RETURN_URL;

    const cancelUrl =
      process.env.PAYFAST_CANCEL_URL;

    const notifyUrl =
      process.env.PAYFAST_NOTIFY_URL;

    if (
      !returnUrl ||
      !cancelUrl ||
      !notifyUrl
    ) {
      return res.status(500).json({
        message:
          "PayFast callback URLs are not configured",
      });
    }

    const merchantPaymentId =
      `BOOKING_${booking.booking_id}_${Date.now()}`;

    const payment = await Payment.create({
      booking_id: booking.booking_id,
      amount: booking.total_amount,
      method: "payfast",
      merchant_payment_id:
        merchantPaymentId,
      status: "pending",
      itn_verified: false,
    });

    const firstName =
      customer.first_name || "";

    const lastName =
      customer.last_name || "";

    const checkoutData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      name_first: firstName,
      name_last: lastName,
      email_address:
        req.user.email || "",
      m_payment_id:
        merchantPaymentId,
      amount:
        Number(booking.total_amount).toFixed(2),
      item_name:
        `Occasion Catering Booking #${booking.booking_id}`,
      item_description:
        booking.event_type,
    };

    checkoutData.signature =
      generateSignature(
        checkoutData,
        passphrase
      );

    return res.status(201).json({
      message:
        "PayFast payment created",
      payment: {
        payment_id:
          payment.payment_id,
        booking_id:
          booking.booking_id,
        amount:
          payment.amount,
        merchant_payment_id:
          payment.merchant_payment_id,
        status:
          payment.status,
      },
      checkout: {
        action:
          PAYFAST_PROCESS_URL,
        method: "POST",
        fields:
          checkoutData,
      },
    });
  } catch (error) {
    console.error(
      "Error creating PayFast payment:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create PayFast payment",
    });
  }
}

async function handlePaymentNotification(
  req,
  res
) {
  try {
    const notification = req.body;

    if (
      !notification ||
      typeof notification !== "object"
    ) {
      return res
        .status(400)
        .send("Invalid notification");
    }

    if (!verifySignature(notification)) {
      return res
        .status(400)
        .send("Invalid signature");
    }

    const merchantId =
      process.env.PAYFAST_MERCHANT_ID;

    if (
      !merchantId ||
      notification.merchant_id !== merchantId
    ) {
      return res
        .status(400)
        .send("Invalid merchant");
    }

    const merchantPaymentId =
      notification.m_payment_id;

    if (!merchantPaymentId) {
      return res
        .status(400)
        .send("Missing payment ID");
    }

    const payment =
      await Payment.findOne({
        where: {
          merchant_payment_id:
            merchantPaymentId,
        },
        include: [
          {
            model: Booking,
          },
        ],
      });

    if (!payment) {
      return res
        .status(404)
        .send("Payment not found");
    }

    const receivedAmount =
      Number(notification.amount_gross);

    const expectedAmount =
      Number(payment.amount);

    if (
      !Number.isFinite(receivedAmount) ||
      receivedAmount.toFixed(2) !==
        expectedAmount.toFixed(2)
    ) {
      return res
        .status(400)
        .send("Invalid amount");
    }

    const sourceIsValid =
      await isValidPayFastSource(req);

    if (!sourceIsValid) {
      return res
        .status(400)
        .send("Invalid source");
    }

    const validationResponse =
      await requestPayFastValidation(
        notification
      );

    if (validationResponse !== "VALID") {
      return res
        .status(400)
        .send("PayFast validation failed");
    }

    const rawPayload =
      JSON.stringify(notification);

    const paymentStatus =
      notification.payment_status;

    if (
      paymentStatus === "COMPLETE"
    ) {
      await payment.update({
        status: "complete",
        gateway_payment_id:
          notification.pf_payment_id ||
          null,
        itn_verified: true,
        raw_itn_payload:
          rawPayload,
        paid_at: new Date(),
      });

      await Booking.update(
        {
          status: "confirmed",
        },
        {
          where: {
            booking_id:
              payment.booking_id,
          },
        }
      );

      return res
        .status(200)
        .send("OK");
    }

    if (
      paymentStatus === "CANCELLED"
    ) {
      await payment.update({
        status: "cancelled",
        gateway_payment_id:
          notification.pf_payment_id ||
          null,
        itn_verified: true,
        raw_itn_payload:
          rawPayload,
      });

      await Booking.update(
        {
          status: "cancelled",
        },
        {
          where: {
            booking_id:
              payment.booking_id,
          },
        }
      );

      return res
        .status(200)
        .send("OK");
    }

    await payment.update({
      status: "pending",
      gateway_payment_id:
        notification.pf_payment_id ||
        null,
      itn_verified: true,
      raw_itn_payload:
        rawPayload,
    });

    return res
      .status(200)
      .send("OK");
  } catch (error) {
    console.error(
      "Error processing PayFast notification:",
      error
    );

    return res
      .status(500)
      .send(
        "Notification processing failed"
      );
  }
}

module.exports = {
  createPayment,
  handlePaymentNotification,
};