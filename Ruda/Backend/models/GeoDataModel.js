const pool = require('../config/database');
const { ALLOWED_TABLES } = require('../config/constants');

class GeoDataModel {
  static async getGeoJSON(tableName) {
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
        SELECT * FROM "${ALLOWED_TABLES[tableName]}"
        WHERE geom IS NOT NULL
      ) AS row;
    `;

    const result = await pool.query(query);
    return result.rows[0]?.geojson;
  }

  static async getAllRecords() {
    try {
      const query = 'SELECT gid, name, category FROM "all" ORDER BY gid';
      console.log('Executing query:', query);
      const result = await pool.query(query);
      console.log('Query result:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Database error in getAllRecords:', error.message);
      throw error;
    }
  }

  static async createRecord(name, category) {
    const query = `INSERT INTO "all" (name, category) VALUES ($1, $2) RETURNING gid, name, category`;
    const result = await pool.query(query, [name, category]);
    return result.rows[0];
  }

  static async updateRecord(id, name, category) {
    const query = `UPDATE "all" SET name = $1, category = $2 WHERE gid = $3 RETURNING gid, name, category`;
    const result = await pool.query(query, [name, category, id]);
    return result.rows[0];
  }

  static async deleteRecord(id) {
    const query = `DELETE FROM "all" WHERE gid = $1 RETURNING gid, name, category`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static isValidTable(tableName) {
    return ALLOWED_TABLES.hasOwnProperty(tableName);
  }
}

module.exports = GeoDataModel; 