// controllers/GanttCrudController.js
const GanttCrudModel = require("../models/GanttCrudModel");
const GanttLogModel = require("../models/GanttLogModel");

class GanttCrudController {
  // Get all Gantt data
  static async getAllData(req, res) {
    try {
      console.log("🔄 Fetching all Gantt data...");
      const data = await GanttCrudModel.getAllData();
      
      res.json({
        success: true,
        data: data,
        count: data.length
      });
    } catch (error) {
      console.error("❌ Error fetching Gantt data:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch Gantt data"
      });
    }
  }

  // Initialize database tables
  static async initializeTables(req, res) {
    try {
      console.log("🔄 Initializing Gantt tables...");
      await GanttCrudModel.createTables();
      
      res.json({
        success: true,
        message: "Gantt tables initialized successfully"
      });
    } catch (error) {
      console.error("❌ Error initializing Gantt tables:", error);
      res.status(500).json({
        success: false,
        error: "Failed to initialize Gantt tables"
      });
    }
  }

  // Update a specific item (for logging purposes)
  static async updateItem(req, res) {
    try {
      const { itemId, itemName, itemType, field, oldValue, newValue } = req.body;
      
      console.log("🔄 Updating Gantt item:", itemName);
      
      // Log the update
      try {
        await GanttLogModel.logGanttChange(
          itemId || itemName?.replace(/\s+/g, "-").toLowerCase() || "unknown",
          itemName || "Unknown Item",
          "UPDATE",
          field,
          oldValue,
          newValue,
          "System"
        );
        console.log("✅ Gantt update logged successfully");
      } catch (logError) {
        console.error("❌ Failed to log Gantt update:", logError);
      }

      res.json({
        success: true,
        message: "Item updated and logged successfully"
      });
    } catch (error) {
      console.error("❌ Error updating Gantt item:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update Gantt item"
      });
    }
  }

  // Create a new item (for logging purposes)
  static async createItem(req, res) {
    try {
      const { itemId, itemName, itemType, itemData } = req.body;
      
      console.log("🔄 Creating Gantt item:", itemName);
      
      // Log the creation
      try {
        await GanttLogModel.logGanttChange(
          itemId || itemName?.replace(/\s+/g, "-").toLowerCase() || "unknown",
          itemName || "Unknown Item",
          "CREATE",
          null,
          null,
          itemData,
          "System"
        );
        console.log("✅ Gantt creation logged successfully");
      } catch (logError) {
        console.error("❌ Failed to log Gantt creation:", logError);
      }

      res.json({
        success: true,
        message: "Item created and logged successfully"
      });
    } catch (error) {
      console.error("❌ Error creating Gantt item:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create Gantt item"
      });
    }
  }

  // Delete an item (for logging purposes)
  static async deleteItem(req, res) {
    try {
      const { itemId, itemName, itemType, itemData } = req.body;
      
      console.log("🔄 Deleting Gantt item:", itemName);
      
      // Log the deletion
      try {
        await GanttLogModel.logGanttChange(
          itemId || itemName?.replace(/\s+/g, "-").toLowerCase() || "unknown",
          itemName || "Unknown Item",
          "DELETE",
          null,
          itemData,
          null,
          "System"
        );
        console.log("✅ Gantt deletion logged successfully");
      } catch (logError) {
        console.error("❌ Failed to log Gantt deletion:", logError);
      }

      res.json({
        success: true,
        message: "Item deleted and logged successfully"
      });
    } catch (error) {
      console.error("❌ Error deleting Gantt item:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete Gantt item"
      });
    }
  }

  // Log item view/selection (for demonstration)
  static async logItemView(req, res) {
    try {
      const { itemId, itemName, action = "VIEW" } = req.body;
      
      console.log("🔄 Logging Gantt item view:", itemName);
      
      // Log the view action
      try {
        await GanttLogModel.logGanttChange(
          itemId || itemName?.replace(/\s+/g, "-").toLowerCase() || "unknown",
          itemName || "Unknown Item",
          "UPDATE",
          "selected_for_view",
          null,
          "Item selected for timeline view",
          "User"
        );
        console.log("✅ Gantt view logged successfully");
      } catch (logError) {
        console.error("❌ Failed to log Gantt view:", logError);
      }

      res.json({
        success: true,
        message: "Item view logged successfully"
      });
    } catch (error) {
      console.error("❌ Error logging Gantt item view:", error);
      res.status(500).json({
        success: false,
        error: "Failed to log Gantt item view"
      });
    }
  }
}

module.exports = GanttCrudController;
