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
c2VyX2lkIjo0LCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3ODg2OTY4MDQsImV4cCI6MTc4ODcwNDAwNH0.tN3YkTcfmNfNi4Ut083T_nFr4pEAo1RXtYEwJce96Xg