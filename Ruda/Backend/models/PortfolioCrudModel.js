// models/PortfolioCrudModel.js
const pool = require("../config/database");

class PortfolioCrudModel {
  static async list() {
    const sql = `SELECT * FROM public.crud ORDER BY id`;
    const { rows } = await pool.query(sql);
    return rows;
  }

  static async getById(id) {
    const sql = `SELECT * FROM public.crud WHERE id = $1`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  static async create(payload) {
    const fields = [
      "title","master_plan_image_url",
      "dev_residential_pct","dev_residential_color",
      "dev_commercial_pct","dev_commercial_color",
      "dev_industrial_pct","dev_industrial_color",
      "dev_mixed_use_pct","dev_mixed_use_color",
      "dev_institutional_pct","dev_institutional_color",
      "exp_fy22_23_b","exp_fy23_24_b","exp_fy24_25_b","exp_fy25_26_b","exp_fy26_27_b",
      "financial_total_budget","financial_total_budget_color",
      "financial_utilized_budget","financial_utilized_budget_color",
      "financial_remaining_budget","financial_remaining_budget_color",
      "metric_total_development_budget_pkr","metric_overall_duration_years","metric_total_area_acres","metric_total_projects",
      "progress_planned_pct","progress_actual_pct",
      "timeline_start_label","timeline_mid_label","timeline_end_label","timeline_elapsed_years","timeline_remaining_years",
      "budget_planned_till_date_b","budget_certified_till_date_b","budget_expenditure_till_date_b",
      "sustainability_river_channelization_km","sustainability_barrages_count","sustainability_swm_text",
      "sustainability_afforestation_acres","sustainability_trunk_infrastructure_text","sustainability_dry_utilities_text"
    ];

    const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");
    const values = fields.map(f => payload[f] ?? null);

    const sql = `
      INSERT INTO public.crud (${fields.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, values);
    return rows[0];
  }

  static async update(id, payload) {
    const fields = [
      "title","master_plan_image_url",
      "dev_residential_pct","dev_residential_color",
      "dev_commercial_pct","dev_commercial_color",
      "dev_industrial_pct","dev_industrial_color",
      "dev_mixed_use_pct","dev_mixed_use_color",
      "dev_institutional_pct","dev_institutional_color",
      "exp_fy22_23_b","exp_fy23_24_b","exp_fy24_25_b","exp_fy25_26_b","exp_fy26_27_b",
      "financial_total_budget","financial_total_budget_color",
      "financial_utilized_budget","financial_utilized_budget_color",
      "financial_remaining_budget","financial_remaining_budget_color",
      "metric_total_development_budget_pkr","metric_overall_duration_years","metric_total_area_acres","metric_total_projects",
      "progress_planned_pct","progress_actual_pct",
      "timeline_start_label","timeline_mid_label","timeline_end_label","timeline_elapsed_years","timeline_remaining_years",
      "budget_planned_till_date_b","budget_certified_till_date_b","budget_expenditure_till_date_b",
      "sustainability_river_channelization_km","sustainability_barrages_count","sustainability_swm_text",
      "sustainability_afforestation_acres","sustainability_trunk_infrastructure_text","sustainability_dry_utilities_text"
    ];

    const set = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const values = fields.map(f => payload[f] ?? null);

    const sql = `
      UPDATE public.crud
      SET ${set}, updated_at = NOW()
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [...values, id]);
    return rows[0] || null;
  }

  static async remove(id) {
    const sql = `DELETE FROM public.crud WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = PortfolioCrudModel;
