require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// ✅ Whitelisted tables for GeoJSON API
const allowedTables = {
  all: 'all',
  lahore: 'lahore',
  sheikhpura: 'sheikhpura',
  purposed_ruda_road_network: 'purposed_ruda_road_network gcs'
};

// ✅ GeoJSON API endpoint
app.get('/api/:tableName', async (req, res) => {
  const { tableName } = req.params;

  if (!allowedTables[tableName]) {
    return res.status(400).json({ error: 'Invalid table. Use one of the whitelisted names.' });
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
      return res.status(404).json({ error: 'No valid geometries found' });
    }

    res.json(geojson);
  } catch (err) {
    console.error(`GeoJSON Error: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ CRUD for 'all' table (manage name/category fields)
app.get('/manage/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, category FROM "all" ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

app.post('/manage/all', async (req, res) => {
  const { name, category } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO "all" (name, category) VALUES ($1, $2) RETURNING *`,
      [name, category]
    );
    res.status(201).json({ message: 'Record added', row: result.rows[0] });
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Failed to insert record' });
  }
});

app.put('/manage/all/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  try {
    const result = await pool.query(
      `UPDATE "all" SET name = $1, category = $2 WHERE id = $3 RETURNING *`,
      [name, category, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record updated', row: result.rows[0] });
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

app.delete('/manage/all/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM "all" WHERE id = $1 RETURNING *`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('🌐 RUDA API running — supports GeoJSON + CRUD on "all" table');
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
