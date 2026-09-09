const express = require('express');
const router = express.Router();

const {
  getAllBookings,
  updateBookingStatus
} = require('../controller/adminController');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/bookings', authMiddleware, adminMiddleware, getAllBookings);
router.patch('/bookings/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);

module.exports = router;
