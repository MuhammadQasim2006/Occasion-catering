const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Webhook - No auth
router.post('/notify', paymentController.handleITNWebhook);

// Status - Auth required
router.get('/:bookingId', authMiddleware, paymentController.getPaymentStatus);

module.exports = router;