// // backend/index.js
// import express from 'express';
// import cors from 'cors';
// import routeRoutes from './routes/routePath.js';

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/find-route', routeRoutes);

// app.listen(8000, () => {
//   console.log('Server started on port 8000');
// });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import { getORSRoute } from "./config/ors.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

// load .env relative to this file (backend/.env) so the app uses the right MONGO_URI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

// mask credentials in a Mongo URI for safe logging (user:pass@ -> ***@)
const maskMongoUri = (uri) => {
  try {
    return uri.replace(/:\/\/(.*)@/, '://***@');
  } catch (e) {
    return uri;
  }
};

console.log('Attempting MongoDB connect to:', maskMongoUri(MONGO));
mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB (masked):', maskMongoUri(MONGO)))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.post("/api/find-route", async (req, res) => {
  const { start, end } = req.body;

  try {
    const routeData = await getORSRoute(start, end);
    const coordinates = routeData.features[0].geometry.coordinates.map(
      ([lon, lat]) => [lat, lon]
    );

    res.json({ route: coordinates });
  } catch (error) {
    console.error("Error fetching route:", error.message);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

// API routes for hospitals and referrals
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
