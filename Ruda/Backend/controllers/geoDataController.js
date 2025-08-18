const GeoDataModel = require("../models/GeoDataModel");
const CrudLogModel = require("../models/CrudLogModel");

class GeoDataController {
  // Get GeoJSON data for a specific table
  static async getGeoJSON(req, res) {
    const tableName = req.path.substring(1); // Remove leading slash

    if (!GeoDataModel.isValidTable(tableName)) {
      return res.status(400).json({
        error: "Invalid table. Use one of the whitelisted names.",
      });
    }

    try {
      const geojson = await GeoDataModel.getGeoJSON(tableName);

      if (!geojson || !geojson.features) {
        return res.status(404).json({
          error: "No valid geometries found",
        });
      }

      res.json(geojson);
    } catch (err) {
      console.error(`GeoJSON Error: ${err.message}`);
      res.status(500).json({ error: "Server error" });
    }
  }

  // Get all records from 'all' table
  static async getAllRecords(req, res) {
    try {
      const records = await GeoDataModel.getAllRecords();
      res.json(records);
    } catch (err) {
      console.error("GET error:", err.message);
      console.error("Full error:", err);
      res.status(500).json({
        error: "Failed to fetch records",
        details: err.message,
      });
    }
  }

  // Create a new record in 'all' table
  static async createRecord(req, res) {
    const data = req.body;

    // Validate required fields
    if (!data.name || !data.layer || !data.map_name) {
      return res.status(400).json({
        error: "Name, layer, and map_name are required",
      });
    }

    try {
      const newRecord = await GeoDataModel.createRecord(data);

      // Log the creation
      try {
        console.log(
          "🔄 Attempting to log CREATE operation for record:",
          newRecord.gid
        );
        await CrudLogModel.logCrudChange(
          newRecord.gid,
          newRecord.name || "Unknown Record",
          "CREATE",
          null,
          null,
          newRecord,
          "System"
        );
        console.log("✅ CREATE operation logged successfully");
      } catch (logError) {
        console.error("❌ Failed to log CREATE operation:", logError);
      }

      res.status(201).json({
        message: "Record added",
        row: newRecord,
      });
    } catch (err) {
      console.error("POST error:", err);
      res.status(500).json({ error: "Failed to insert record" });
    }
  }

  // Update a record in 'all' table
  static async updateRecord(req, res) {
    const { id } = req.params;
    const data = req.body;

    // Validate required fields
    if (!data.name || !data.layer || !data.map_name) {
      return res.status(400).json({
        error: "Name, layer, and map_name are required",
      });
    }

    try {
      // Get the old record first for logging
      const oldRecord = await GeoDataModel.getRecordById(id);
      const updatedRecord = await GeoDataModel.updateRecord(id, data);

      if (!updatedRecord) {
        return res.status(404).json({ error: "Record not found" });
      }

      // Log the update with field-level changes
      try {
        if (oldRecord) {
          console.log(
            "🔄 Attempting to log UPDATE operation for record:",
            updatedRecord.gid
          );
          // Compare fields and log changes
          const fieldsToCheck = [
            "name",
            "layer",
            "map_name",
            "area_sqkm",
            "area_acres",
            "ruda_phase",
            "rtw_pkg",
            "description",
            "category",
          ];

          let changesLogged = 0;
          for (const field of fieldsToCheck) {
            if (oldRecord[field] !== updatedRecord[field]) {
              console.log(
                `📝 Field changed: ${field} from "${oldRecord[field]}" to "${updatedRecord[field]}"`
              );
              await CrudLogModel.logCrudChange(
                updatedRecord.gid,
                updatedRecord.name || "Unknown Record",
                "UPDATE",
                field,
                oldRecord[field],
                updatedRecord[field],
                "System"
              );
              changesLogged++;
            }
          }
          console.log(
            `✅ UPDATE operation logged successfully (${changesLogged} changes)`
          );
        }
      } catch (logError) {
        console.error("❌ Failed to log UPDATE operation:", logError);
      }

      res.json({
        message: "Record updated",
        row: updatedRecord,
      });
    } catch (err) {
      console.error("PUT error:", err);
      res.status(500).json({ error: "Failed to update record" });
    }
  }

  // Delete a record from 'all' table
  static async deleteRecord(req, res) {
    const { id } = req.params;

    try {
      // Get the record before deletion for logging
      const recordToDelete = await GeoDataModel.getRecordById(id);
      const deletedRecord = await GeoDataModel.deleteRecord(id);

      if (!deletedRecord) {
        return res.status(404).json({ error: "Record not found" });
      }

      // Log the deletion
      try {
        if (recordToDelete) {
          console.log(
            "🔄 Attempting to log DELETE operation for record:",
            recordToDelete.gid
          );
          await CrudLogModel.logCrudChange(
            recordToDelete.gid,
            recordToDelete.name || "Unknown Record",
            "DELETE",
            null,
            recordToDelete,
            null,
            "System"
          );
          console.log("✅ DELETE operation logged successfully");
        }
      } catch (logError) {
        console.error("❌ Failed to log DELETE operation:", logError);
      }

      res.json({
        message: "Record deleted",
        deletedRecord: deletedRecord,
      });
    } catch (err) {
      console.error("DELETE error:", err);
      res.status(500).json({ error: "Failed to delete record" });
    }
  }
}

module.exports = GeoDataController;
