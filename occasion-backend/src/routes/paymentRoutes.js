const express = require("express");

const {
  createPayment,
} = require("../controllers/paymentController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:bookingId",
  authenticateToken,
  createPayment
);

module.exports = router;