const { pool } = require("./database");

const GeoModel = {
  async getGeoJSON(tableName) {
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
        SELECT * FROM "${tableName}"
        WHERE geom IS NOT NULL
      ) AS row;
    `;

    const result = await pool.query(query);
    return result.rows[0]?.geojson;
  }
};

module.exports = GeoModel;
