const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus
} = require('../controller/bookingController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

// Creating a booking and looking up a specific booking by id both support
// guest checkout — no account required to select a package and pay.
// "My bookings" and cancelling still need a real account, since there's no
// other way to prove who's asking.
router.post('/', optionalAuth, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.get('/:id', optionalAuth, getBookingById);
router.put('/:id/status', authMiddleware, updateBookingStatus);

module.exports = router;