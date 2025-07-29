require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { SERVER_CONFIG } = require("./config/constants");
const geoDataRoutes = require("./routes/geoDataRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Routes
app.use("/api", geoDataRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: '🌐 RUDA API running — supports GeoJSON + CRUD on "all" table',
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = SERVER_CONFIG.PORT;
app.listen(PORT, () => {
  logger.info(`🚀 Server ready at http://localhost:${PORT}`);
  logger.info(`Environment: ${SERVER_CONFIG.NODE_ENV}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

module.exports = app;
