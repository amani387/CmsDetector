import { useState } from "react";
import '../app/globals.css'; // Assuming you are using this CSS file
export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const checkWebsite = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    setError(null); // Reset error before making a request

    try {
      const response = await fetch("/api/checkWordPress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      setResult(data);
    } catch (error) {
      setError(error.message);
      setResult({ message: "Failed to check website." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   
    <div className="container">
    <div class="title-container">
  <h1 class="title">
    <span>Do you want to find out</span>
    <br />
    <span>if it is a WordPress site or not?</span>
  </h1>
  <p class="subtitle">Enter the URL and check it out now!</p>
</div>
    
      <div className="card">
        <h1 className="title2">WordPress Checker</h1>
        <input
        id="website-url"
          type="text"
          className="input"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={checkWebsite}
          className="button"
          disabled={loading}
        >
         {loading ? <div className="spinner"></div> : "Check Website"}

        </button>

        {result && !result.error && (
  <div className="result" id="result">
    <h3 className="result-title">
      {result.isWordPress ? "✅ Yes, WordPress Detected" : "❌ Not a WordPress Site"}
    </h3>
    <p className="result-text">{result.reason}</p>
  </div>
)}

{error && (
  <div className="error-message">
    <h3 className="error-title">⚠️ Error</h3>
    <p className="error-text">{error}</p>
  </div>
)}
      </div>
    </div>
    </>
  );
}