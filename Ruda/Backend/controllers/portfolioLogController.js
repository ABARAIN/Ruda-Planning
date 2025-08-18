// controllers/portfolioLogController.js
const PortfolioLogModel = require("../models/PortfolioLogModel");

class PortfolioLogController {
  static async initializeLogTable(req, res) {
    try {
      await PortfolioLogModel.createLogTable();
      res.json({ 
        message: "Portfolio logs table initialized successfully",
        success: true 
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to initialize portfolio logs table", 
        details: error.message 
      });
    }
  }

  static async getLogsByPortfolio(req, res) {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      if (isNaN(portfolioId)) {
        return res.status(400).json({ error: "Invalid portfolio ID" });
      }

      const logs = await PortfolioLogModel.getLogsByPortfolioId(portfolioId, limit, offset);
      res.json({
        success: true,
        data: logs,
        pagination: {
          limit,
          offset,
          count: logs.length
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch portfolio logs", 
        details: error.message 
      });
    }
  }

  static async getAllLogs(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      const logs = await PortfolioLogModel.getAllLogs(limit, offset);
      res.json({
        success: true,
        data: logs,
        pagination: {
          limit,
          offset,
          count: logs.length
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch all portfolio logs", 
        details: error.message 
      });
    }
  }

  static async getLogStats(req, res) {
    try {
      const stats = await PortfolioLogModel.getLogStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch portfolio log statistics", 
        details: error.message 
      });
    }
  }

  static async createManualLog(req, res) {
    try {
      const { portfolioId, action, fieldName, oldValue, newValue, changedBy } = req.body;

      if (!portfolioId || !action) {
        return res.status(400).json({ 
          error: "Portfolio ID and action are required" 
        });
      }

      const validActions = ['CREATE', 'UPDATE', 'DELETE'];
      if (!validActions.includes(action.toUpperCase())) {
        return res.status(400).json({ 
          error: "Invalid action. Must be CREATE, UPDATE, or DELETE" 
        });
      }

      const log = await PortfolioLogModel.logChange(
        portfolioId,
        action.toUpperCase(),
        fieldName,
        oldValue,
        newValue,
        changedBy || 'Manual Entry'
      );

      res.status(201).json({
        success: true,
        message: "Log entry created successfully",
        data: log
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to create manual log entry", 
        details: error.message 
      });
    }
  }
}

module.exports = PortfolioLogController;
