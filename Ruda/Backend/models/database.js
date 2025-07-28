require("dotenv").config();
const { Pool } = require("pg");

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

// ✅ Whitelisted tables for GeoJSON API
const allowedTables = {
  all: "all",
  lahore: "lahore",
  sheikhpura: "sheikhpura",
  purposed_ruda_road_network: "purposed_ruda_road_network gcs",
};

module.exports = {
  pool,
  allowedTables
};
