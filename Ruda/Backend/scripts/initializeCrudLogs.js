// scripts/initializeCrudLogs.js
require("dotenv").config();
const CrudLogModel = require("../models/CrudLogModel");

async function initializeCrudLogs() {
  try {
    console.log("🚀 Initializing CRUD Logs table...");
    
    await CrudLogModel.createLogTable();
    
    console.log("✅ CRUD Logs table initialized successfully!");
    console.log("📊 You can now track CRUD operations in the log.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize CRUD Logs table:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeCrudLogs();
}

module.exports = { initializeCrudLogs };
