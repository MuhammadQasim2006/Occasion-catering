const express = require('express');
const router = express.Router();
const {
  getCustomerProfile,
  updateCustomerProfile
} = require('../controller/customerController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All customer routes require authentication.
// Access-control (self or admin) is enforced inside the controller.
router.use(authMiddleware);

router.get('/:id', getCustomerProfile);
router.put('/:id', updateCustomerProfile);

module.exports = router;
