// controllers/ganntCrudController.js
const GanntCrudModel = require("../models/GanntCrudModel");

const list = async (req, res) => {
  try {
    const rows = await GanntCrudModel.list();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch rows", details: e.message });
  }
};

const getOne = async (req, res) => {
  try {
    const row = await GanntCrudModel.getById(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch row", details: e.message });
  }
};

const create = async (req, res) => {
  try {
    const created = await GanntCrudModel.create(req.body);
    res.status(201).json({ message: "Created", row: created });
  } catch (e) {
    res.status(500).json({ error: "Failed to create", details: e.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await GanntCrudModel.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Updated", row: updated });
  } catch (e) {
    res.status(500).json({ error: "Failed to update", details: e.message });
  }
};

const remove = async (req, res) => {
  try {
    const removed = await GanntCrudModel.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", row: removed });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete", details: e.message });
  }
};

module.exports = { list, getOne, create, update, remove };
