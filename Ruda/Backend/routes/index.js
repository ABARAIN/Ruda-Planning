const express = require("express");
const geoRoutes = require("./geoRoutes");
const allRoutes = require("./allRoutes");
const HealthController = require("../controller.js/healthController");

const router = express.Router();

// ✅ Health check
router.get("/", HealthController.healthCheck);

// Mount routes
router.use("/api", geoRoutes);
router.use("/manage/all", allRoutes);

module.exports = router;
