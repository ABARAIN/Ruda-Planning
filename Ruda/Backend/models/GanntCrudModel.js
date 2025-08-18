const pool = require("../config/database");

const TABLE = "public.ganntcrud";

const FIELDS = [
  "phase_name","phase_amount",
  "item_name","item_amount",
  "package_name","budgeted_cost","planned_value","earned_value","actual_start","actual_finish","schedule_complete","performance_complete",
  "subpackage_name","subpackage_duration",
  "subsub_name","subsub_duration",
  "activity_name","activity_duration",
  "reach_name","reach_duration",
  "material_name","material_duration",
  "timeline"
];

async function ensureTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      id BIGSERIAL PRIMARY KEY,
      phase_name TEXT,
      phase_amount NUMERIC(18,2),
      item_name TEXT,
      item_amount NUMERIC(18,2),
      package_name TEXT,
      budgeted_cost NUMERIC(18,2),
      planned_value NUMERIC(18,2),
      earned_value NUMERIC(18,2),
      actual_start DATE,
      actual_finish DATE,
      schedule_complete NUMERIC(6,2),
      performance_complete NUMERIC(6,2),
      subpackage_name TEXT,
      subpackage_duration INT,
      subsub_name TEXT,
      subsub_duration INT,
      activity_name TEXT,
      activity_duration INT,
      reach_name TEXT,
      reach_duration INT,
      material_name TEXT,
      material_duration INT,
      timeline JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await pool.query(sql);
}

class GanntCrudModel {
  static async init() {
    await ensureTable();
  }

  static async list() {
    const { rows } = await pool.query(`SELECT * FROM ${TABLE} ORDER BY id`);
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(`SELECT * FROM ${TABLE} WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  static async create(payload) {
    const placeholders = FIELDS.map((_, i) => `$${i + 1}`).join(", ");
    const values = FIELDS.map((f) => {
      if (f === "timeline") {
        if (payload.timeline == null) return null;
        if (typeof payload.timeline === "string") return payload.timeline;
        return JSON.stringify(payload.timeline);
      }
      return payload[f] ?? null;
    });
    const sql = `
      INSERT INTO ${TABLE} (${FIELDS.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, values);
    return rows[0];
  }

  static async update(id, payload) {
    const set = FIELDS.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const values = FIELDS.map((f) => {
      if (f === "timeline") {
        if (payload.timeline == null) return null;
        if (typeof payload.timeline === "string") return payload.timeline;
        return JSON.stringify(payload.timeline);
      }
      return payload[f] ?? null;
    });
    const sql = `
      UPDATE ${TABLE}
      SET ${set}, updated_at = NOW()
      WHERE id = $${FIELDS.length + 1}
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [...values, id]);
    return rows[0] || null;
  }

  static async remove(id) {
    const { rows } = await pool.query(`DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`, [id]);
    return rows[0] || null;
  }
}

GanntCrudModel.init().catch(() => {});
module.exports = GanntCrudModel;
