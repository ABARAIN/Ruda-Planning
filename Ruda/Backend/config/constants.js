// Whitelisted tables for GeoJSON API
const ALLOWED_TABLES = {
  all: "all",
  lahore: "lahore",
  sheikhpura: "sheikhpura",
  purposed_ruda_road_network: "purposed_ruda_road_network gcs",
};

// Server configuration
const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

module.exports = {
  ALLOWED_TABLES,
  SERVER_CONFIG,
};
