import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { setUserId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startOAuth = async () => {
    try {
      setLoading(true);
      setError("");
      const nextUserId = `user-${Date.now()}`;
      setUserId(nextUserId);
      const payload = await apiRequest(`/auth/google?userId=${encodeURIComponent(nextUserId)}`);
      window.location.href = payload.authUrl;
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const continueInDemoMode = () => {
    const nextUserId = `demo-${Date.now()}`;
    setUserId(nextUserId);
    navigate("/inbox");
  };

  return (
    <div className="center-card">
      <h2>Connect Gmail</h2>
      <p>Authenticate with Google to fetch real inbox emails, or continue in demo mode with mock data.</p>
      <button onClick={startOAuth} disabled={loading}>
        {loading ? "Redirecting..." : "Login with Google"}
      </button>
      <button className="secondary-button" onClick={continueInDemoMode} disabled={loading}>
        Continue in demo mode
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
