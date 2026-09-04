const express = require("express");

const {
  createBooking,
  getBookingById,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/:id", getBookingById);

module.exports = router;