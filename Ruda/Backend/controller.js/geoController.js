const GeoModel = require("../models/geoModel");
const { allowedTables } = require("../models/database");

const GeoController = {
  async getGeoJSON(req, res) {
    const { tableName } = req.params;

    if (!allowedTables[tableName]) {
      return res
        .status(400)
        .json({ error: "Invalid table. Use one of the whitelisted names." });
    }

    try {
      const geojson = await GeoModel.getGeoJSON(allowedTables[tableName]);

      if (!geojson || !geojson.features) {
        return res.status(404).json({ error: "No valid geometries found" });
      }

      res.json(geojson);
    } catch (err) {
      console.error(`GeoJSON Error: ${err.message}`);
      res.status(500).json({ error: "Server error" });
    }
  }
};

module.exports = GeoController;
