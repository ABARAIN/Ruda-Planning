// scripts/initializePortfolioLogs.js
require("dotenv").config();
const PortfolioLogModel = require("../models/PortfolioLogModel");

async function initializePortfolioLogs() {
  try {
    console.log("🚀 Initializing Portfolio Logs table...");
    
    await PortfolioLogModel.createLogTable();
    
    console.log("✅ Portfolio Logs table initialized successfully!");
    console.log("📊 You can now track portfolio changes in the log.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize Portfolio Logs table:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializePortfolioLogs();
}

module.exports = { initializePortfolioLogs };
