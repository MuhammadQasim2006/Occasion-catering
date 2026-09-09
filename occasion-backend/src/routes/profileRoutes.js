const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  getProfile
);

router.put(
  "/",
  authenticateToken,
  updateProfile
);

module.exports = router;