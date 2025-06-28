// src/components/MapComponent.jsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!start || !end) return;

    const response = await axios.post("http://localhost:8000/api/route", {
      start,
      end,
    });

    const coords = response.data.coordinates;

    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      const latlngs = coords.map(([lng, lat]) => [lat, lng]);
      L.polyline(latlngs, { color: "blue" }).addTo(mapRef.current);
      L.marker(latlngs[0]).addTo(mapRef.current).bindPopup("Start").openPopup();
      L.marker(latlngs[latlngs.length - 1])
        .addTo(mapRef.current)
        .bindPopup("End");

      mapRef.current.fitBounds(L.polyline(latlngs).getBounds());
    }
  };

  useEffect(() => {
  if (!mapRef.current) {
    const map = L.map("map").setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    mapRef.current = map;
  }
}, []);


  return (
    <div>
      <form onSubmit={handleSubmit} style={{ margin: "10px" }}>
        <input
          type="text"
          placeholder="Start location"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="End location"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <button type="submit">Find Route</button>
      </form>
      <div id="map" style={{ height: "500px" }}></div>
    </div>
  );
};

export default MapComponent;
