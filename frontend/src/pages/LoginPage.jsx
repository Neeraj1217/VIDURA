import { useState } from "react";
import { apiRequest } from "../api/client";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startOAuth = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = `user-${Date.now()}`;
      const payload = await apiRequest(`/auth/google?userId=${encodeURIComponent(userId)}`);
      window.location.href = payload.authUrl;
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-card">
      <h2>Connect Gmail</h2>
      <p>Authenticate with Google to fetch inbox emails and power VIDURA workflows.</p>
      <button onClick={startOAuth} disabled={loading}>
        {loading ? "Redirecting..." : "Login with Google"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
