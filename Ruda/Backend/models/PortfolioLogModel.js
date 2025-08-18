// models/PortfolioLogModel.js
const pool = require("../config/database");

class PortfolioLogModel {
  static async createLogTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS public.portfolio_logs (
        id SERIAL PRIMARY KEY,
        portfolio_id INTEGER NOT NULL,
        action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
        field_name VARCHAR(255),
        old_value TEXT,
        new_value TEXT,
        changed_by VARCHAR(255) DEFAULT 'System',
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (portfolio_id) REFERENCES public.crud(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_portfolio_logs_portfolio_id ON public.portfolio_logs(portfolio_id);
      CREATE INDEX IF NOT EXISTS idx_portfolio_logs_created_at ON public.portfolio_logs(created_at DESC);
    `;
    
    try {
      await pool.query(sql);
      console.log("✅ Portfolio logs table created/verified successfully");
    } catch (error) {
      console.error("❌ Error creating portfolio logs table:", error);
      throw error;
    }
  }

  static async logChange(portfolioId, action, fieldName = null, oldValue = null, newValue = null, changedBy = 'System') {
    const sql = `
      INSERT INTO public.portfolio_logs (portfolio_id, action, field_name, old_value, new_value, changed_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    try {
      const { rows } = await pool.query(sql, [
        portfolioId,
        action,
        fieldName,
        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null,
        changedBy
      ]);
      return rows[0];
    } catch (error) {
      console.error("Error logging portfolio change:", error);
      throw error;
    }
  }

  static async logMultipleChanges(portfolioId, changes, changedBy = 'System') {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const logPromises = changes.map(change => {
        const sql = `
          INSERT INTO public.portfolio_logs (portfolio_id, action, field_name, old_value, new_value, changed_by)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        
        return client.query(sql, [
          portfolioId,
          change.action,
          change.fieldName,
          change.oldValue ? JSON.stringify(change.oldValue) : null,
          change.newValue ? JSON.stringify(change.newValue) : null,
          changedBy
        ]);
      });
      
      await Promise.all(logPromises);
      await client.query('COMMIT');
      
      return { success: true, count: changes.length };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error logging multiple portfolio changes:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getLogsByPortfolioId(portfolioId, limit = 100, offset = 0) {
    const sql = `
      SELECT 
        pl.*,
        c.title as portfolio_title
      FROM public.portfolio_logs pl
      LEFT JOIN public.crud c ON pl.portfolio_id = c.id
      WHERE pl.portfolio_id = $1
      ORDER BY pl.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    
    try {
      const { rows } = await pool.query(sql, [portfolioId, limit, offset]);
      
      // Parse JSON values back to objects for display
      return rows.map(row => ({
        ...row,
        old_value: row.old_value ? this.safeJsonParse(row.old_value) : null,
        new_value: row.new_value ? this.safeJsonParse(row.new_value) : null
      }));
    } catch (error) {
      console.error("Error fetching portfolio logs:", error);
      throw error;
    }
  }

  static async getAllLogs(limit = 100, offset = 0) {
    const sql = `
      SELECT 
        pl.*,
        c.title as portfolio_title
      FROM public.portfolio_logs pl
      LEFT JOIN public.crud c ON pl.portfolio_id = c.id
      ORDER BY pl.created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    
    try {
      const { rows } = await pool.query(sql, [limit, offset]);
      
      // Parse JSON values back to objects for display
      return rows.map(row => ({
        ...row,
        old_value: row.old_value ? this.safeJsonParse(row.old_value) : null,
        new_value: row.new_value ? this.safeJsonParse(row.new_value) : null
      }));
    } catch (error) {
      console.error("Error fetching all portfolio logs:", error);
      throw error;
    }
  }

  static async getLogStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_logs,
        COUNT(DISTINCT portfolio_id) as portfolios_with_logs,
        COUNT(CASE WHEN action = 'CREATE' THEN 1 END) as creates,
        COUNT(CASE WHEN action = 'UPDATE' THEN 1 END) as updates,
        COUNT(CASE WHEN action = 'DELETE' THEN 1 END) as deletes,
        DATE(created_at) as log_date,
        COUNT(*) as daily_count
      FROM public.portfolio_logs
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY log_date DESC;
    `;
    
    try {
      const { rows } = await pool.query(sql);
      return rows;
    } catch (error) {
      console.error("Error fetching portfolio log stats:", error);
      throw error;
    }
  }

  static safeJsonParse(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return jsonString; // Return as string if not valid JSON
    }
  }

  static compareObjects(oldObj, newObj) {
    const changes = [];
    const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
    
    for (const key of allKeys) {
      const oldValue = oldObj?.[key];
      const newValue = newObj?.[key];
      
      // Skip if values are the same
      if (oldValue === newValue) continue;
      
      // Handle null/undefined comparisons
      if ((oldValue == null && newValue == null)) continue;
      
      changes.push({
        action: 'UPDATE',
        fieldName: key,
        oldValue: oldValue,
        newValue: newValue
      });
    }
    
    return changes;
  }
}

module.exports = PortfolioLogModel;
