const express = require("express");
const GeoController = require("../controller.js/geoController");

const router = express.Router();

// ✅ GeoJSON API endpoint
router.get("/:tableName", GeoController.getGeoJSON);

module.exports = router;
