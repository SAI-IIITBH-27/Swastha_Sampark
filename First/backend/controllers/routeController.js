// backend/controllers/routeController.js
import { getORSRoute } from '../../backend/config/ors.js';

export const getRoute = async (req, res) => {
  const { start, end } = req.body;
  try {
    const route = await getORSRoute(start, end);
    res.json({ coordinates: route.features[0].geometry.coordinates });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch route' });
  }
};
