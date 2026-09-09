const express = require("express");

const {
  createPayment,
  handlePaymentNotification,
} = require("../controllers/paymentController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PayFast ITN callback must come before /:bookingId.
router.post(
  "/notify",
  express.urlencoded({ extended: false }),
  handlePaymentNotification
);

// Customer starts a PayFast payment for their own booking.
router.post(
  "/:bookingId",
  authenticateToken,
  createPayment
);

module.exports = router;