const express = require("express");

const {
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/adminController");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/bookings",
  authenticateToken,
  requireAdmin,
  getAllBookings
);

router.patch(
  "/bookings/:id/status",
  authenticateToken,
  requireAdmin,
  updateBookingStatus
);

module.exports = router;