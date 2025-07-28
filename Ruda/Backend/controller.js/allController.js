const AllModel = require("../models/allModel");

const AllController = {
  async getAll(req, res) {
    try {
      const records = await AllModel.getAll();
      res.json(records);
    } catch (err) {
      console.error("GET error:", err);
      res.status(500).json({ error: "Failed to fetch records" });
    }
  },

  async create(req, res) {
    const { name, category } = req.body;
    try {
      const newRecord = await AllModel.create(name, category);
      res.status(201).json({ message: "Record added", row: newRecord });
    } catch (err) {
      console.error("POST error:", err);
      res.status(500).json({ error: "Failed to insert record" });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, category } = req.body;
    try {
      const result = await AllModel.update(id, name, category);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Record not found" });
      }
      res.json({ message: "Record updated", row: result.rows[0] });
    } catch (err) {
      console.error("PUT error:", err);
      res.status(500).json({ error: "Failed to update record" });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await AllModel.delete(id);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Record not found" });
      }
      res.json({ message: "Record deleted" });
    } catch (err) {
      console.error("DELETE error:", err);
      res.status(500).json({ error: "Failed to delete record" });
    }
  }
};

module.exports = AllController;
