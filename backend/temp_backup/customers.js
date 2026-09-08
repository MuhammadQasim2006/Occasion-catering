const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/:id', customerController.getCustomerProfile);
router.put('/:id', customerController.updateCustomerProfile);

module.exports = router;