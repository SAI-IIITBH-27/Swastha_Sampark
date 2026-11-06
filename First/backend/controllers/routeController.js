
import {
  calculateTomTomRoutes,
  getTrafficTile,
} from "../utils/tomtomService.js";

// ============================================
// POST /api/find-route
// ============================================

export const getRoute = async (req, res) => {
  try {
    const { start, end } = req.body || {};

    if (
      typeof start !== "string" ||
      typeof end !== "string" ||
      !start.trim() ||
      !end.trim()
    ) {
      return res.status(400).json({
        error: "Start and destination hospitals are required.",
      });
    }

    const result = await calculateTomTomRoutes(
      start.trim(),
      end.trim()
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Hospital routing failure:", error);

    return res.status(502).json({
      error: "Unable to calculate the hospital route.",
      details: error.message,
    });
  }
};

// ============================================
// GET /api/traffic/:type/:z/:x/:y
// ============================================

export const getTrafficMapTile = async (req, res) => {
  try {
    const { type, z, x, y } = req.params;

    const tile = await getTrafficTile(type, z, x, y);

    res.set({
      "Content-Type": tile.contentType,
      "Cache-Control": "public, max-age=30",
    });

    return res.send(tile.buffer);

  } catch (error) {
    console.error("Traffic tile failure:", error);

    return res.status(502).json({
      error: "Traffic information is temporarily unavailable.",
      details: error.message,
    });
  }
};
