import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { EmailList } from "../components/EmailList";

export const InboxPage = () => {
  const { userId } = useAuth();
  const [emails, setEmails] = useState([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = await apiRequest("/email/inbox", {
          headers: { "x-user-id": userId }
        });
        setEmails(payload.emails);
        setSource(payload.source);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      load();
    } else {
      setLoading(false);
      setError("Missing user session. Please login first.");
    }
  }, [userId]);

  return (
    <section>
      <h2>Inbox</h2>
      {source && <p className="info-message">Source: {source}</p>}
      {loading && <p className="info-message">Loading inbox...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && <EmailList emails={emails} />}
    </section>
  );
};
