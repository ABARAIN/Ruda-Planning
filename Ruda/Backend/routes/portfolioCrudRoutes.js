// routes/portfolioCrudRoutes.js
const express = require("express");
const router = express.Router();
const PortfolioCrudController = require("../controllers/portfolioCrudController");

// List all
router.get("/", PortfolioCrudController.list);

// Get one
router.get("/:id", PortfolioCrudController.getOne);

// Create
router.post("/", PortfolioCrudController.create);

// Update
router.put("/:id", PortfolioCrudController.update);

// Delete
router.delete("/:id", PortfolioCrudController.remove);

module.exports = router;
