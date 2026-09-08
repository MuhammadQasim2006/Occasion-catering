const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus
} = require('../controller/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All booking routes require authentication
router.use(authMiddleware);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);

module.exports = router;