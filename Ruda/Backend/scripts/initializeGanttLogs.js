// scripts/initializeGanttLogs.js
require("dotenv").config();
const GanttLogModel = require("../models/GanttLogModel");

async function initializeGanttLogs() {
  try {
    console.log("🚀 Initializing Gantt Logs table...");
    
    await GanttLogModel.createLogTable();
    
    console.log("✅ Gantt Logs table initialized successfully!");
    console.log("📊 You can now track gantt chart changes in the log.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize Gantt Logs table:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeGanttLogs();
}

module.exports = { initializeGanttLogs };
