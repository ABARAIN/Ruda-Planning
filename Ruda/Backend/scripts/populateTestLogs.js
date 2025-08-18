// scripts/populateTestLogs.js
require("dotenv").config();
const GanttLogModel = require("../models/GanttLogModel");
const CrudLogModel = require("../models/CrudLogModel");

async function populateTestLogs() {
  try {
    console.log("🚀 Populating test logs...");
    
    // Create sample Gantt logs
    const ganttLogs = [
      {
        gantt_item_id: "phase-01",
        gantt_item_name: "PHASE 01",
        action: "CREATE",
        field_name: null,
        old_value: null,
        new_value: { phase: "PHASE 01", amount: "155,649" },
        changed_by: "System"
      },
      {
        gantt_item_id: "river-channelization",
        gantt_item_name: "River Channelization (14.5 Km)",
        action: "UPDATE",
        field_name: "amount",
        old_value: "45,000",
        new_value: "45,420",
        changed_by: "Project Manager"
      },
      {
        gantt_item_id: "check-dams",
        gantt_item_name: "Check Dams (02 Nos)",
        action: "UPDATE",
        field_name: "timeline",
        old_value: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        new_value: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        changed_by: "Site Engineer"
      },
      {
        gantt_item_id: "road-network",
        gantt_item_name: "Road Network (115 Km)",
        action: "CREATE",
        field_name: null,
        old_value: null,
        new_value: { name: "Road Network (115 Km)", amount: "55,513" },
        changed_by: "System"
      },
      {
        gantt_item_id: "package-2.1",
        gantt_item_name: "RUDA:Package-2.1 Contract Startup",
        action: "UPDATE",
        field_name: "scheduleComplete",
        old_value: "0%",
        new_value: "100%",
        changed_by: "Contract Manager"
      }
    ];

    for (const log of ganttLogs) {
      await GanttLogModel.createLog(log);
      console.log(`✅ Created Gantt log: ${log.gantt_item_name} - ${log.action}`);
    }

    // Create sample CRUD logs (these will be created automatically when you perform CRUD operations)
    console.log("📊 Gantt test logs created successfully!");
    console.log("💡 CRUD logs will be created automatically when you perform operations in GeoDataManager");
    console.log("🔍 You can now view the logs in the application!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to populate test logs:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  populateTestLogs();
}

module.exports = { populateTestLogs };
