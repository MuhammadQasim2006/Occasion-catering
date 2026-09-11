const express = require('express');
const router = express.Router();
const { initiatePayment, getPaymentStatus, handleITNWebhook } = require('../controller/paymentController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Public — PayFast calls this server-to-server, there's no user session.
router.post('/notify', handleITNWebhook);

// Guest checkout needs to reach these without a token too — optionalAuth
// attaches req.user when logged in, and the controller relaxes its
// ownership check when there's no req.user (see comments there).
router.post('/initiate', optionalAuth, initiatePayment);
router.get('/:bookingId', optionalAuth, getPaymentStatus);

module.exports = router;
