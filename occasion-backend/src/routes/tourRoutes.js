const express = require("express");

const {
  getAllTours,
  getTourById,
} = require("../controllers/tourController");

const router = express.Router();

router.get("/", getAllTours);

router.get("/:id", getTourById);

module.exports = router;