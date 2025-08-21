// routes/GanttCrudRoutes.js
const express = require("express");
const router = express.Router();
const GanttCrudController = require("../controllers/GanttCrudController");

// Get all Gantt data
router.get("/", GanttCrudController.getAllData);

// Initialize database tables
router.post("/initialize", GanttCrudController.initializeTables);

// Update an item (for logging)
router.put("/item", GanttCrudController.updateItem);

// Create an item (for logging)
router.post("/item", GanttCrudController.createItem);

// Delete an item (for logging)
router.delete("/item", GanttCrudController.deleteItem);

// Log item view/selection
router.post("/log-view", GanttCrudController.logItemView);

module.exports = router;
