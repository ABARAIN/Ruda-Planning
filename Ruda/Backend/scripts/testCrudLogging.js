// scripts/testCrudLogging.js
require("dotenv").config();
const CrudLogModel = require("../models/CrudLogModel");

async function testCrudLogging() {
  try {
    console.log("🧪 Testing CRUD logging functionality...");
    
    // Test 1: Create the table
    console.log("1. Creating CRUD logs table...");
    await CrudLogModel.createLogTable();
    console.log("✅ Table created successfully");
    
    // Test 2: Create a test log entry
    console.log("2. Creating test log entry...");
    const testLog = await CrudLogModel.createLog({
      record_id: 999,
      record_name: "Test Record",
      action: "CREATE",
      field_name: null,
      old_value: null,
      new_value: { name: "Test Record", layer: "test" },
      changed_by: "Test Script"
    });
    console.log("✅ Test log created:", testLog);
    
    // Test 3: Get logs
    console.log("3. Retrieving logs...");
    const logs = await CrudLogModel.getLogs(10, 0);
    console.log("✅ Retrieved logs:", logs.length, "entries");
    
    if (logs.length > 0) {
      console.log("📋 Latest log entry:", logs[0]);
    }
    
    // Test 4: Get stats
    console.log("4. Getting log statistics...");
    const stats = await CrudLogModel.getLogStats();
    console.log("✅ Log statistics:", stats);
    
    console.log("🎉 All tests passed! CRUD logging is working correctly.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testCrudLogging();
}

module.exports = { testCrudLogging };
