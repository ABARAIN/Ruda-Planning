const GeoDataModel = require("../models/GeoDataModel");

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
      const updatedRecord = await GeoDataModel.updateRecord(id, data);

      if (!updatedRecord) {
        return res.status(404).json({ error: "Record not found" });
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
      const deletedRecord = await GeoDataModel.deleteRecord(id);

      if (!deletedRecord) {
        return res.status(404).json({ error: "Record not found" });
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
