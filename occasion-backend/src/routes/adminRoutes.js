const express = require("express");

const {
  getAllBookings,
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

module.exports = router;