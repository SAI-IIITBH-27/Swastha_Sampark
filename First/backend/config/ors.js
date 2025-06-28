// backend/ors.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const ORS_API_KEY = process.env.ORS_API_KEY;

if (!ORS_API_KEY) {
  throw new Error("ORS_API_KEY not found in environment variables.");
}
export const getORSRoute = async (start, end) => {
  const geocode = async (place) => {
    const resp = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: { api_key: ORS_API_KEY, text: place },
    });
    return resp.data.features[0].geometry.coordinates;
  };

  const startCoords = await geocode(start);
  const endCoords = await geocode(end);

  const route = await axios.post(
    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
    {
      coordinates: [startCoords, endCoords],
    },
    {
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  return route.data;
};
