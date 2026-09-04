const express = require("express");

const {
  createBooking,
  getCustomerBookings,
  getBookingById,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);

// Must come before /:id so "customer" is not treated as a booking ID.
router.get("/customer/:customerId", getCustomerBookings);

router.get("/:id", getBookingById);

module.exports = router;