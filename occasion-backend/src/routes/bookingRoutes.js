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
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3ODg2OTc1MjgsImV4cCI6MTc4ODcwNDcyOH0.eyUAQFILaWRYJsTP1jcEJ-XH99-FP67_pztqYrhhIQM