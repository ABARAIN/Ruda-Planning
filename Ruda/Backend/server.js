require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { SERVER_CONFIG } = require("./config/constants");
const geoDataRoutes = require("./routes/geoDataRoutes");
const portfolioCrudRoutes = require("./routes/portfolioCrudRoutes");
const portfolioLogRoutes = require("./routes/portfolioLogRoutes");
const ganttLogRoutes = require("./routes/ganttLogRoutes");
const crudLogRoutes = require("./routes/crudLogRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const ganntCrudRoutes = require("./routes/ganntCrudRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const PortfolioLogModel = require("./models/PortfolioLogModel");
const GanttLogModel = require("./models/GanttLogModel");
const CrudLogModel = require("./models/CrudLogModel");
const UserModel = require("./models/UserModel");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use("/api/portfoliocrud", portfolioCrudRoutes);
app.use("/api/portfoliolog", portfolioLogRoutes);
app.use("/api/ganttlog", ganttLogRoutes);
app.use("/api/crudlog", crudLogRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/ganntcrud", ganntCrudRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message:
      '🌐 RUDA API running — supports GeoJSON + CRUD on "all" table and portfolio CRUD',
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

// Initialize all log tables on startup
async function initializeDatabase() {
  try {
    await UserModel.createUserTable();
    logger.info("✅ Users table initialized");

    await PortfolioLogModel.createLogTable();
    logger.info("✅ Portfolio logs table initialized");

    await GanttLogModel.createLogTable();
    logger.info("✅ Gantt logs table initialized");

    await CrudLogModel.createLogTable();
    logger.info("✅ CRUD logs table initialized");
  } catch (error) {
    logger.error("❌ Failed to initialize database tables:", error);
  }
}

// Start server
const PORT = SERVER_CONFIG.PORT;
app.listen(PORT, async () => {
  logger.info(`🚀 Server ready at http://localhost:${PORT}`);
  logger.info(`Environment: ${SERVER_CONFIG.NODE_ENV}`);

  // Initialize database tables
  await initializeDatabase();
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
