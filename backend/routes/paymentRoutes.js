const express = require('express');
const router = express.Router();
const { initiatePayment, getPaymentStatus, handleITNWebhook } = require('../controller/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public — PayFast calls this server-to-server, there's no user session.
router.post('/notify', handleITNWebhook);

// Authenticated — the logged-in customer starting/checking their own payment.
router.post('/initiate', authMiddleware, initiatePayment);
router.get('/:bookingId', authMiddleware, getPaymentStatus);

module.exports = router;
