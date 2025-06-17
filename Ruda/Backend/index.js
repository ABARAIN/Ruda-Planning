require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

// ✅ PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ Whitelist: Only 3 tables allowed
const allowedTables = {
  all: 'all',
  lahore: 'lahore',
  sheikhpura: 'sheikhpura'
};

// ✅ Route: Serve GeoJSON from specific table
app.get('/api/:tableName', async (req, res) => {
  const { tableName } = req.params;

  if (!allowedTables[tableName]) {
    return res.status(400).json({ error: 'Invalid table name. Allowed: all, lahore, sheikhpura' });
  }

  try {
    const query = `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
            'properties', to_jsonb(row) - 'geom'
          )
        )
      ) AS geojson
      FROM (
        SELECT * FROM "${allowedTables[tableName]}"
        WHERE geom IS NOT NULL
      ) AS row;
    `;

    const result = await pool.query(query);
    const geojson = result.rows[0]?.geojson;

    if (!geojson || !geojson.features) {
      return res.status(404).json({ error: 'No valid geometries found in table' });
    }

    res.json(geojson);
  } catch (err) {
    console.error(`❌ Error fetching data from ${tableName}:`, err.message);
    res.status(500).json({ error: `Server error fetching data from ${tableName}` });
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🌍 RUDA GeoAPI is running... [Tables: all, lahore, sheikhpura]');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
