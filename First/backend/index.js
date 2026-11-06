
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Routes
import routePath from "./routes/routePath.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const MONGO =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/sai3";

const maskMongoUri = (uri) => {
  try {
    return uri.replace(/:\/\/(.*)@/, "://***@");
  } catch {
    return uri;
  }
};

console.log(
  "Attempting MongoDB connection:",
  maskMongoUri(MONGO)
);

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(
      "MongoDB connection error:",
      err.message
    );
  });

// =====================================================
// TOMTOM ROUTING
// =====================================================

// POST /api/find-route
app.use("/api/find-route", routePath);

// =====================================================
// TOMTOM TRAFFIC
// =====================================================

// GET /api/traffic/flow/:z/:x/:y
// GET /api/traffic/incidents/:z/:x/:y

import {
  getTrafficMapTile,
} from "./controllers/routeController.js";

app.get(
  "/api/traffic/flow/:z/:x/:y",
  (req, res) => {
    req.params.type = "flow";
    return getTrafficMapTile(req, res);
  }
);

app.get(
  "/api/traffic/incidents/:z/:x/:y",
  (req, res) => {
    req.params.type = "incidents";
    return getTrafficMapTile(req, res);
  }
);

// =====================================================
// EXISTING APPLICATION ROUTES
// =====================================================

app.use("/api/hospitals", hospitalRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    application: "Swastha Sampark API",
    routing: "TomTom",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
