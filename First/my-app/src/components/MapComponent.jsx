// // src/components/MapComponent.jsx
// import { useEffect, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";

// const MapComponent = () => {
//   const mapRef = useRef(null);
//   const [start, setStart] = useState("");
//   const [end, setEnd] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!start || !end) return;

//     const response = await axios.post("http://localhost:8000/api/route", {
//       start,
//       end,
//     });

//     const coords = response.data.coordinates;

//     if (mapRef.current) {
//       mapRef.current.eachLayer((layer) => {
//         if (layer instanceof L.Polyline || layer instanceof L.Marker) {
//           mapRef.current.removeLayer(layer);
//         }
//       });

//       const latlngs = coords.map(([lng, lat]) => [lat, lng]);
//       L.polyline(latlngs, { color: "blue" }).addTo(mapRef.current);
//       L.marker(latlngs[0]).addTo(mapRef.current).bindPopup("Start").openPopup();
//       L.marker(latlngs[latlngs.length - 1])
//         .addTo(mapRef.current)
//         .bindPopup("End");

//       mapRef.current.fitBounds(L.polyline(latlngs).getBounds());
//     }
//   };

//   useEffect(() => {
//   if (!mapRef.current) {
//     const map = L.map("map").setView([20.5937, 78.9629], 5);
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);
//     mapRef.current = map;
//   }
// }, []);


//   return (
//     <div>
//       <form onSubmit={handleSubmit} style={{ margin: "10px" }}>
//         <input
//           type="text"
//           placeholder="Start location"
//           value={start}
//           onChange={(e) => setStart(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="End location"
//           value={end}
//           onChange={(e) => setEnd(e.target.value)}
//           required
//         />
//         <button type="submit">Find Route</button>
//       </form>
//       <div id="map" style={{ height: "500px" }}></div>
//     </div>
//   );
// };

// export default MapComponent;


// src/components/MapComponent.jsx
// src/components/MapComponent.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ start, end }) => {
  const [routePoints, setRoutePoints] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/find-route", {
          start,
          end,
        });

        if (res.data.route.length > 1) {
          setRoutePoints(res.data.route);
        } else {
          alert("No route found");
        }
      } catch (error) {
        console.error("Error fetching route:", error.message);
        alert("Failed to get route from server.");
      }
    };

    if (start && end) fetchRoute();
  }, [start, end]);

  return (
    <MapContainer
      center={[23.6102, 85.2799]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {routePoints.length > 1 && (
        <Polyline positions={routePoints} color="blue" />
      )}
    </MapContainer>
  );
};

export default MapComponent;
