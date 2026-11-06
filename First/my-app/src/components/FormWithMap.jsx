
import { useState } from "react";
import MapComponent from "./MapComponent";

const FormWithMap = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [submitted, setSubmitted] = useState({
    start: "",
    end: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!start.trim() || !end.trim()) return;

    console.log("Submitting route:", start, end);

    setSubmitted({
      start: start.trim(),
      end: end.trim(),
    });
  };

  return (
    <div className="map-form-wrapper">

      <div className="map-wrapper">
        <MapComponent
          start={submitted.start}
          end={submitted.end}
        />
      </div>

      <div className="form-wrapper">
        <form className="route-form" onSubmit={handleSubmit}>

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

          <button type="submit">
            Show Route
          </button>

        </form>

        <p className="route-helper">
          Enter the referring hospital and destination
          hospital to calculate the route.
        </p>
      </div>

    </div>
  );
};

export default FormWithMap;
