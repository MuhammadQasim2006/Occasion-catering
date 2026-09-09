const express = require("express");

const {
  createBooking,
  getCustomerBookings,
  getBookingById,
} = require("../controllers/bookingController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  createBooking
);

router.get(
  "/customer",
  authenticateToken,
  getCustomerBookings
);

router.get(
  "/:id",
  authenticateToken,
  getBookingById
);

module.exports = router;