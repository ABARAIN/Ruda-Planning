const express = require("express");
const router = express.Router();
const GeoDataController = require("../controllers/geoDataController");
const { validateRecordData, validateId } = require("../middleware/validation");

// Test endpoint to check table structure
router.get("/test/table-info", async (req, res) => {
  try {
    const pool = require("../config/database");
    const result = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'all'
      ORDER BY ordinal_position;
    `);
    res.json({
      message: 'Table structure for "all" table',
      columns: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get table info",
      details: error.message,
    });
  }
});

// CRUD routes for 'all' table
router.get("/manage/all", GeoDataController.getAllRecords);
router.post("/manage/all", validateRecordData, GeoDataController.createRecord);
router.put(
  "/manage/all/:id",
  validateId,
  validateRecordData,
  GeoDataController.updateRecord
);
router.delete("/manage/all/:id", validateId, GeoDataController.deleteRecord);

// GeoJSON API endpoint for specific tables
router.get("/all", GeoDataController.getGeoJSON);
router.get("/allcrud", GeoDataController.getGeoJSON);
router.get("/lahore", GeoDataController.getGeoJSON);
router.get("/sheikhpura", GeoDataController.getGeoJSON);
router.get("/purposed_ruda_road_network", GeoDataController.getGeoJSON);

module.exports = router;
