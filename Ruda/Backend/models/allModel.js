const { pool } = require("./database");

const AllModel = {
  async getAll() {
    const result = await pool.query(
      'SELECT id, name, category FROM "all" ORDER BY id'
    );
    return result.rows;
  },

  async create(name, category) {
    const result = await pool.query(
      `INSERT INTO "all" (name, category) VALUES ($1, $2) RETURNING *`,
      [name, category]
    );
    return result.rows[0];
  },

  async update(id, name, category) {
    const result = await pool.query(
      `UPDATE "all" SET name = $1, category = $2 WHERE id = $3 RETURNING *`,
      [name, category, id]
    );
    return result;
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM "all" WHERE id = $1 RETURNING *`,
      [id]
    );
    return result;
  }
};

module.exports = AllModel;
