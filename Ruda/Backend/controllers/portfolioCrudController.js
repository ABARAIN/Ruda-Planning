// controllers/portfolioCrudController.js
const PortfolioCrudModel = require("../models/PortfolioCrudModel");

class PortfolioCrudController {
  static async list(req, res) {
    try {
      const rows = await PortfolioCrudModel.list();
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch portfolio rows", details: e.message });
    }
  }

  static async getOne(req, res) {
    try {
      const row = await PortfolioCrudModel.getById(req.params.id);
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch portfolio row", details: e.message });
    }
  }

  static async create(req, res) {
    try {
      const created = await PortfolioCrudModel.create(req.body);
      res.status(201).json({ message: "Created", row: created });
    } catch (e) {
      res.status(500).json({ error: "Failed to create", details: e.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await PortfolioCrudModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json({ message: "Updated", row: updated });
    } catch (e) {
      res.status(500).json({ error: "Failed to update", details: e.message });
    }
  }

  static async remove(req, res) {
    try {
      const removed = await PortfolioCrudModel.remove(req.params.id);
      if (!removed) return res.status(404).json({ error: "Not found" });
      res.json({ message: "Deleted", row: removed });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete", details: e.message });
    }
  }
}

module.exports = PortfolioCrudController;
