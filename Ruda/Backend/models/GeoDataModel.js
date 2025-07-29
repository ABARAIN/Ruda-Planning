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
      const query = `
        SELECT gid, layer, map_name, name, area_sqkm, area_acres, ruda_phase, rtw_pkg, 
               description, scope_of_work, land_available_pct, land_available_km, 
               land_remaining_pct, land_remaining_km, awarded_cost, duration_months, 
               commencement_date, completion_date, physical_actual_pct, work_done_million, 
               certified_million, elapsed_months, firms, physical_chart, financial_chart, 
               kpi_chart, curve_chart, category 
        FROM "all" ORDER BY gid
      `;
      console.log('Executing query:', query);
      const result = await pool.query(query);
      console.log('Query result:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Database error in getAllRecords:', error.message);
      throw error;
    }
  }

  static async createRecord(data) {
    const fields = [
      'layer', 'map_name', 'name', 'area_sqkm', 'area_acres', 'ruda_phase', 'rtw_pkg',
      'description', 'scope_of_work', 'land_available_pct', 'land_available_km',
      'land_remaining_pct', 'land_remaining_km', 'awarded_cost', 'duration_months',
      'commencement_date', 'completion_date', 'physical_actual_pct', 'work_done_million',
      'certified_million', 'elapsed_months', 'firms', 'physical_chart', 'financial_chart',
      'kpi_chart', 'curve_chart', 'category'
    ];
    
    const values = fields.map(field => data[field] || null);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    const returningFields = fields.map(field => field).join(', ');
    
    const query = `
      INSERT INTO "all" (${fields.join(', ')}) 
      VALUES (${placeholders}) 
      RETURNING gid, ${returningFields}
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateRecord(id, data) {
    const fields = [
      'layer', 'map_name', 'name', 'area_sqkm', 'area_acres', 'ruda_phase', 'rtw_pkg',
      'description', 'scope_of_work', 'land_available_pct', 'land_available_km',
      'land_remaining_pct', 'land_remaining_km', 'awarded_cost', 'duration_months',
      'commencement_date', 'completion_date', 'physical_actual_pct', 'work_done_million',
      'certified_million', 'elapsed_months', 'firms', 'physical_chart', 'financial_chart',
      'kpi_chart', 'curve_chart', 'category'
    ];
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => data[field] || null)];
    const returningFields = fields.map(field => field).join(', ');
    
    const query = `
      UPDATE "all" SET ${setClause} 
      WHERE gid = $1 
      RETURNING gid, ${returningFields}
    `;
    
    const result = await pool.query(query, values);
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