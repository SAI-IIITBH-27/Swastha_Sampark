// src/components/FormWithMap.jsx
import { useState } from "react";
import MapComponent from "./MapComponent";

const FormWithMap = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!start || !end) return;
    setSubmitted(true);
  };

  return (
    <div className="map-form-wrapper">
      <div className="map-wrapper">
        {submitted && <MapComponent start={start} end={end} />}
      </div>
      <div className="form-wrapper">
        <form className="route-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Start location"
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setSubmitted(false); // Reset on change
            }}
            required
          />

          <input
            type="text"
            placeholder="End location"
            value={end}
            onChange={(e) => {
              setEnd(e.target.value);
              setSubmitted(false); // Reset on change
            }}
            required
          />

          <button type="submit">Show Route</button>
        </form>
      </div>
    </div>
  );
};

export default FormWithMap;
