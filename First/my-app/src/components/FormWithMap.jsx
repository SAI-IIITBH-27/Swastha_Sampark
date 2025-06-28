import { useState } from "react";
import MapComponent from "./MapComponent";

const FormWithMap = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Start location (lat,lng)"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="End location (lat,lng)"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
        <button type="submit">Show Route</button>
      </form>
      {submitted && <MapComponent start={start} end={end} />}
    </div>
  );
};

export default FormWithMap;
