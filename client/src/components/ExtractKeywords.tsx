import axios from "axios";
import { useState } from "react";

interface Response {
  location?: string | string[];
  date?: string | string[];
}

const ExtractWeather = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle click to call OpenAI API to extract keywords
  const handleExtractWeather = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/extract-weather",
        {
          location,
          date,
        }
      );
      setResponse(response.data);
    } catch (error) {
      setError("Error extracting weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Location</h1>
      <textarea
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="City"
        rows={4}
        cols={10}
      />
      <h1>Date</h1>
      <textarea
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="MM-DD-YYYY"
        rows={4}
        cols={10}
      />
      <br />
      <button onClick={handleExtractWeather} disabled={loading}>
        {loading ? "Extracting..." : "Extract Weather"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <h2>Response Data</h2>
          {/* <pre>{JSON.stringify(keywords, null, 2)}</pre> */}
          <ul>
            {Object.entries(response).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(value) ? value.join(", ") : value || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExtractWeather;
