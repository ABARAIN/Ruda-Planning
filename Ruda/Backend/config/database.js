const { Pool } = require("pg");
require("dotenv").config();

const ssl =
  process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false } // for cloud DBs that require SSL (Neon/Render/ElephantSQL/etc.)
    : false;                        // for local Postgres (no SSL)

console.log("Database Config:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl
});

pool.on("connect", () => {
  console.log("✅ Database connected successfully");
});
pool.on("error", (err) => {
  console.error("❌ Database connection error:", err.message);
});

module.exports = pool;
