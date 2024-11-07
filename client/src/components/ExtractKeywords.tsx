import axios from "axios";
import { useState } from "react";

const ExtractKeywords = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle click to call OpenAI API to extract keywords
  const handleExtractKeywords = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/extract-keywords",
        {
          userPrompt,
        }
      );
      setKeywords(response.data.keywords);
    } catch (error) {
      setError("Error extracting keywords. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Travel Keyword Extractor</h1>
      <textarea
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Enter your travel-related prompt here..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleExtractKeywords} disabled={loading}>
        {loading ? "Extracting..." : "Extract Keywords"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {keywords && (
        <div>
          <h2>Extracted Keywords:</h2>
          <pre>{JSON.stringify(keywords, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ExtractKeywords;
