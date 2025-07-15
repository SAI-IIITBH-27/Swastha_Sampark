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
import { getORSRoute } from "./config/ors.js";

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(8000, () => console.log("Server running on port 8000"));
