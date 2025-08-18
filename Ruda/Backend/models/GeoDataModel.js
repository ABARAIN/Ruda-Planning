const pool = require("../config/database");
const { ALLOWED_TABLES } = require("../config/constants");

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
    const geojson = result.rows[0]?.geojson;

    // Parse JSON fields in the properties of each feature
    if (geojson && geojson.features) {
      const jsonFields = [
        "firms",
        "scope_of_work",
        "physical_chart",
        "financial_chart",
        "kpi_chart",
        "curve_chart",
      ];

      geojson.features.forEach((feature) => {
        if (feature.properties) {
          jsonFields.forEach((field) => {
            if (
              feature.properties[field] &&
              typeof feature.properties[field] === "string"
            ) {
              try {
                feature.properties[field] = JSON.parse(
                  feature.properties[field]
                );
              } catch (e) {
                console.warn(
                  `Failed to parse JSON field ${field} in GeoJSON:`,
                  e
                );
                feature.properties[field] = [];
              }
            } else if (!feature.properties[field]) {
              feature.properties[field] = [];
            }
          });
        }
      });
    }

    return geojson;
  }

  static async getRecordById(id) {
    try {
      const query = `
        SELECT gid, layer, map_name, name, area_sqkm, area_acres, ruda_phase, rtw_pkg,
               description, scope_of_work, land_available_pct, land_available_km,
               land_remaining_pct, land_remaining_km, awarded_cost, duration_months,
               commencement_date, completion_date, physical_actual_pct, work_done_million,
               certified_million, elapsed_months, firms, physical_chart, financial_chart,
               kpi_chart, curve_chart, category
        FROM "all" WHERE gid = $1
      `;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const record = result.rows[0];

      // JSON fields that need to be parsed
      const jsonFields = [
        "firms",
        "scope_of_work",
        "physical_chart",
        "financial_chart",
        "kpi_chart",
        "curve_chart",
      ];

      // Parse JSON fields
      jsonFields.forEach((field) => {
        if (record[field]) {
          try {
            record[field] = JSON.parse(record[field]);
          } catch (e) {
            console.warn(`Failed to parse JSON field ${field}:`, e);
            record[field] = [];
          }
        } else {
          record[field] = [];
        }
      });

      return record;
    } catch (error) {
      console.error("Error fetching record by ID:", error);
      throw error;
    }
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
      console.log("Executing query:", query);
      const result = await pool.query(query);

      // JSON fields that need to be parsed
      const jsonFields = [
        "firms",
        "scope_of_work",
        "physical_chart",
        "financial_chart",
        "kpi_chart",
        "curve_chart",
      ];

      // Parse JSON fields in the result
      const processedRows = result.rows.map((row) => {
        const processedRow = { ...row };

        jsonFields.forEach((field) => {
          if (processedRow[field]) {
            try {
              // If it's a string, try to parse it
              if (typeof processedRow[field] === "string") {
                processedRow[field] = JSON.parse(processedRow[field]);
              }
              // If it's already an object/array, keep it as is
            } catch (e) {
              console.warn(`Failed to parse JSON field ${field}:`, e);
              processedRow[field] = [];
            }
          } else {
            // If field is null/undefined, set to empty array
            processedRow[field] = [];
          }
        });

        return processedRow;
      });

      console.log("Processed query result:", processedRows);
      return processedRows;
    } catch (error) {
      console.error("Database error in getAllRecords:", error.message);
      throw error;
    }
  }

  static async createRecord(data) {
    const fields = [
      "layer",
      "map_name",
      "name",
      "area_sqkm",
      "area_acres",
      "ruda_phase",
      "rtw_pkg",
      "description",
      "scope_of_work",
      "land_available_pct",
      "land_available_km",
      "land_remaining_pct",
      "land_remaining_km",
      "awarded_cost",
      "duration_months",
      "commencement_date",
      "completion_date",
      "physical_actual_pct",
      "work_done_million",
      "certified_million",
      "elapsed_months",
      "firms",
      "physical_chart",
      "financial_chart",
      "kpi_chart",
      "curve_chart",
      "category",
    ];

    // JSON fields that need to be stringified
    const jsonFields = [
      "firms",
      "scope_of_work",
      "physical_chart",
      "financial_chart",
      "kpi_chart",
      "curve_chart",
    ];

    const values = fields.map((field) => {
      const value = data[field];

      // Handle JSON fields
      if (jsonFields.includes(field)) {
        if (Array.isArray(value)) {
          return JSON.stringify(value);
        } else if (value && typeof value === "object") {
          return JSON.stringify(value);
        } else if (typeof value === "string") {
          // If it's already a string, assume it's valid JSON
          return value;
        } else {
          return JSON.stringify([]);
        }
      }

      return value || null;
    });

    const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
    const returningFields = fields.map((field) => field).join(", ");

    const query = `
      INSERT INTO "all" (${fields.join(", ")})
      VALUES (${placeholders})
      RETURNING gid, ${returningFields}
    `;

    console.log("Creating record with values:", values);
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateRecord(id, data) {
    const fields = [
      "layer",
      "map_name",
      "name",
      "area_sqkm",
      "area_acres",
      "ruda_phase",
      "rtw_pkg",
      "description",
      "scope_of_work",
      "land_available_pct",
      "land_available_km",
      "land_remaining_pct",
      "land_remaining_km",
      "awarded_cost",
      "duration_months",
      "commencement_date",
      "completion_date",
      "physical_actual_pct",
      "work_done_million",
      "certified_million",
      "elapsed_months",
      "firms",
      "physical_chart",
      "financial_chart",
      "kpi_chart",
      "curve_chart",
      "category",
    ];

    // JSON fields that need to be stringified
    const jsonFields = [
      "firms",
      "scope_of_work",
      "physical_chart",
      "financial_chart",
      "kpi_chart",
      "curve_chart",
    ];

    const processedValues = fields.map((field) => {
      const value = data[field];

      // Handle JSON fields
      if (jsonFields.includes(field)) {
        if (Array.isArray(value)) {
          return JSON.stringify(value);
        } else if (value && typeof value === "object") {
          return JSON.stringify(value);
        } else if (typeof value === "string") {
          // If it's already a string, assume it's valid JSON
          return value;
        } else {
          return JSON.stringify([]);
        }
      }

      return value || null;
    });

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");
    const values = [id, ...processedValues];
    const returningFields = fields.map((field) => field).join(", ");

    const query = `
      UPDATE "all" SET ${setClause}
      WHERE gid = $1
      RETURNING gid, ${returningFields}
    `;

    console.log("Updating record with values:", values);
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
