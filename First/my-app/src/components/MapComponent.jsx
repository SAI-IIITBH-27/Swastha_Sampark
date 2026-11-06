
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const API_BASE = (
  // import.meta.env.VITE_API_BASE_URL ||
  // "http://localhost:8000"
  
// ).replace(/\/+$/, "");
const API_BASE = "http://localhost:8000";

const hospitalIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = hospitalIcon;

const MapController = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();

      if (points.length > 1) {
        map.fitBounds(
          L.latLngBounds(points),
          {
            padding: [45, 45],
            maxZoom: 15,
          }
        );
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [map, points]);

  return null;
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return hours > 0
    ? `${hours} hr ${mins} min`
    : `${mins} min`;
};

const MapComponent = ({ start, end }) => {
  const [routeData, setRouteData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trafficRefresh, setTrafficRefresh] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrafficRefresh((value) => value + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!start?.trim() || !end?.trim()) return;

    const controller = new AbortController();

    const fetchRoute = async () => {
      setLoading(true);
      setError("");
      setRouteData(null);
      setSelectedRoute(0);

      try {
        const response = await axios.post(
          `${API_BASE}/api/find-route`,
          {
            start: start.trim(),
            end: end.trim(),
          },
          {
            signal: controller.signal,
            timeout: 30000,
          }
        );

        if (!response.data?.routes?.length) {
          throw new Error("No route was found.");
        }

        setRouteData(response.data);

      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        setError(
          err.response?.data?.error ||
          err.message ||
          "Unable to calculate the route."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRoute();

    return () => controller.abort();
  }, [start, end]);

  const routes = routeData?.routes || [];
  const activeRoute = routes[selectedRoute];

  const points = activeRoute?.coordinates || [];

  return (
    <div className="map-container">

      <MapContainer
        center={[23.6102, 85.2799]}
        zoom={6}
        scrollWheelZoom={true}
        className="leaflet-map"
      >

        <LayersControl position="topright">

          <LayersControl.BaseLayer
            checked
            name="OpenStreetMap"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay
            checked
            name="Live Traffic Flow"
          >
            <TileLayer
              key={`flow-${trafficRefresh}`}
              url={`${API_BASE}/api/traffic/flow/{z}/{x}/{y}`}
              opacity={0.75}
              maxZoom={22}
              attribution="Traffic data &copy; TomTom"
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay
            name="Traffic Incidents"
          >
            <TileLayer
              key={`incidents-${trafficRefresh}`}
              url={`${API_BASE}/api/traffic/incidents/{z}/{x}/{y}`}
              opacity={0.9}
              maxZoom={22}
            />
          </LayersControl.Overlay>

        </LayersControl>

        {points.length > 1 && (
          <>
            <Polyline
              positions={points}
              pathOptions={{
                color: "#2563eb",
                weight: 6,
                opacity: 0.95,
              }}
            />

            <Marker position={points[0]}>
              <Popup>Referring Hospital</Popup>
            </Marker>

            <Marker position={points[points.length - 1]}>
              <Popup>Receiving Hospital</Popup>
            </Marker>
          </>
        )}

        <MapController points={points} />

      </MapContainer>

      {loading && (
        <div className="map-status">
          <div className="map-spinner" />
          <strong>Calculating traffic-aware route...</strong>
          <small>Checking available routes and traffic conditions</small>
        </div>
      )}

      {error && (
        <div className="map-error">
          {error}
        </div>
      )}

      {activeRoute && (
        <div className="route-results">

          <div className="route-summary">
            <div>
              <strong>
                {formatDuration(activeRoute.durationMinutes)}
              </strong>
              <small>Estimated travel time</small>
            </div>

            <div>
              <strong>
                {activeRoute.distanceKm} km
              </strong>
              <small>Route distance</small>
            </div>

            <div>
              <strong>
                {activeRoute.trafficDelayMinutes} min
              </strong>
              <small>Traffic delay</small>
            </div>
          </div>

          <div className="route-options">
            {routes.map((route, index) => (
              <button
                key={route.id}
                type="button"
                className={
                  selectedRoute === index
                    ? "route-option active"
                    : "route-option"
                }
                onClick={() => setSelectedRoute(index)}
              >
                <strong>
                  {index === 0
                    ? "Fastest Route"
                    : `Alternative ${index}`}
                </strong>

                <span>
                  {formatDuration(route.durationMinutes)}
                  {" · "}
                  {route.distanceKm} km
                </span>
              </button>
            ))}
          </div>

          <small className="route-updated">
            Traffic-aware estimate · Calculated at{" "}
            {new Date(routeData.calculatedAt).toLocaleTimeString()}
          </small>

        </div>
      )}

      {!loading && !error && !activeRoute && (
        <div className="map-placeholder">
          <strong>Hospital Route Map</strong>
          <small>Enter hospital locations to calculate a route.</small>
        </div>
      )}

    </div>
  );
};

export default MapComponent;
