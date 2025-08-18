// routes/portfolioLogRoutes.js
const express = require("express");
const router = express.Router();
const PortfolioLogController = require("../controllers/portfolioLogController");

// Initialize log table (for setup)
router.post("/initialize", PortfolioLogController.initializeLogTable);

// Get all logs with pagination
router.get("/", PortfolioLogController.getAllLogs);

// Get logs for a specific portfolio
router.get("/portfolio/:portfolioId", PortfolioLogController.getLogsByPortfolio);

// Get log statistics
router.get("/stats", PortfolioLogController.getLogStats);

// Create manual log entry (for testing or manual entries)
router.post("/", PortfolioLogController.createManualLog);

module.exports = router;
