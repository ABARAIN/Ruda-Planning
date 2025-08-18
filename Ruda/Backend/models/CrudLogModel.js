// models/CrudLogModel.js
const pool = require("../config/database");

class CrudLogModel {
  static async createLogTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS public.crud_logs (
        id SERIAL PRIMARY KEY,
        record_id INTEGER NOT NULL,
        record_name VARCHAR(500),
        action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
        field_name VARCHAR(255),
        old_value TEXT,
        new_value TEXT,
        changed_by VARCHAR(255) DEFAULT 'System',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_crud_logs_record_id ON public.crud_logs(record_id);
      CREATE INDEX IF NOT EXISTS idx_crud_logs_created_at ON public.crud_logs(created_at DESC);
    `;

    await pool.query(sql);
  }

  static async createLog(logData) {
    const {
      record_id,
      record_name,
      action,
      field_name,
      old_value,
      new_value,
      changed_by,
    } = logData;

    const sql = `
      INSERT INTO public.crud_logs 
      (record_id, record_name, action, field_name, old_value, new_value, changed_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      record_id,
      record_name || "Unknown Record",
      action,
      field_name,
      old_value ? JSON.stringify(old_value) : null,
      new_value ? JSON.stringify(new_value) : null,
      changed_by || "System",
    ];

    const result = await pool.query(sql, values);
    return result.rows[0];
  }

  static async getLogs(limit = 100, offset = 0) {
    const sql = `
      SELECT * FROM public.crud_logs
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(sql, [limit, offset]);
    return result.rows;
  }

  static async getLogStats() {
    const sql = `
      SELECT 
        DATE(created_at) as log_date,
        COUNT(*) as daily_count,
        COUNT(CASE WHEN action = 'CREATE' THEN 1 END) as creates,
        COUNT(CASE WHEN action = 'UPDATE' THEN 1 END) as updates,
        COUNT(CASE WHEN action = 'DELETE' THEN 1 END) as deletes
      FROM public.crud_logs
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY log_date DESC
    `;

    const result = await pool.query(sql);
    return result.rows;
  }

  static async logCrudChange(
    record_id,
    record_name,
    action,
    field_name = null,
    old_value = null,
    new_value = null,
    changed_by = "System"
  ) {
    return this.createLog({
      record_id,
      record_name,
      action,
      field_name,
      old_value,
      new_value,
      changed_by,
    });
  }
}

module.exports = CrudLogModel;
