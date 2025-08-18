// routes/ganttLogRoutes.js
const express = require("express");
const router = express.Router();
const GanttLogModel = require("../models/GanttLogModel");

// Get all gantt logs
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const logs = await GanttLogModel.getLogs(limit, offset);
    
    res.json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (error) {
    console.error("Error fetching gantt logs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch gantt logs"
    });
  }
});

// Get gantt log statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await GanttLogModel.getLogStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching gantt log stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch gantt log statistics"
    });
  }
});

// Create a new gantt log entry
router.post("/", async (req, res) => {
  try {
    const { gantt_item_id, gantt_item_name, action, field_name, old_value, new_value, changed_by } = req.body;
    
    if (!gantt_item_id || !action) {
      return res.status(400).json({
        success: false,
        error: "gantt_item_id and action are required"
      });
    }
    
    const log = await GanttLogModel.createLog({
      gantt_item_id,
      gantt_item_name,
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
    console.error("Error creating gantt log:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create gantt log"
    });
  }
});

module.exports = router;
