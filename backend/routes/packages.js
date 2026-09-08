const express = require('express');
const router = express.Router();
const packageController = require('../controller/packageController');
const adminController = require('../controller/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes (B-006)
router.get('/', packageController.getPackages);
router.get('/categories', packageController.getCategories);
router.get('/:id', packageController.getPackageById);

// Admin routes (B-013)
router.post('/', authMiddleware, adminMiddleware, adminController.createPackage);
router.put('/:id', authMiddleware, adminMiddleware, adminController.updatePackage);
router.delete('/:id', authMiddleware, adminMiddleware, adminController.deletePackage);

module.exports = router;