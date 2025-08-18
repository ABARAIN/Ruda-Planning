// routes/crudLogRoutes.js
const express = require("express");
const router = express.Router();
const CrudLogModel = require("../models/CrudLogModel");

// Get all crud logs
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const logs = await CrudLogModel.getLogs(limit, offset);
    
    res.json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (error) {
    console.error("Error fetching crud logs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch crud logs"
    });
  }
});

// Get crud log statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await CrudLogModel.getLogStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching crud log stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch crud log statistics"
    });
  }
});

// Create a new crud log entry
router.post("/", async (req, res) => {
  try {
    const { record_id, record_name, action, field_name, old_value, new_value, changed_by } = req.body;
    
    if (!record_id || !action) {
      return res.status(400).json({
        success: false,
        error: "record_id and action are required"
      });
    }
    
    const log = await CrudLogModel.createLog({
      record_id,
      record_name,
      action,
      field_name,
      old_value,
      new_value,
      changed_by
    });
    
    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error("Error creating crud log:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create crud log"
    });
  }
});

module.exports = router;
