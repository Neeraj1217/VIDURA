import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { EmailList } from "../components/EmailList";

export const PriorityPage = () => {
  const { userId } = useAuth();
  const [emails, setEmails] = useState([]);
  const [overrideValues, setOverrideValues] = useState({});
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPriority = async () => {
    const payload = await apiRequest("/email/priority", {
      headers: { "x-user-id": userId }
    });
    setEmails(payload.emails);
    setOverrideValues(
      payload.emails.reduce((acc, email) => {
        acc[email.id] = email.priorityScore;
        return acc;
      }, {})
    );
  };

  const loadKeywords = async () => {
    const payload = await apiRequest("/emails/priority/keywords");
    setKeywords(payload.keywords);
  };

  useEffect(() => {
    const execute = async () => {
      try {
        setLoading(true);
        setError("");
        await loadPriority();
        await loadKeywords();
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      execute();
    } else {
      setLoading(false);
      setError("Missing user session. Please login first.");
    }
  }, [userId]);

  const updateOverride = async (emailId, scoreValue) => {
    try {
      await apiRequest("/email/priority/override", {
        method: "POST",
        body: JSON.stringify({ emailId, priorityScore: Number(scoreValue) })
      });
      await loadPriority();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const addKeyword = async () => {
    try {
      setError("");
      const payload = await apiRequest("/emails/priority/keywords", {
        method: "POST",
        body: JSON.stringify({ keyword: newKeyword })
      });
      setKeywords(payload.keywords);
      setNewKeyword("");
      await loadPriority();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteKeyword = async (keyword) => {
    try {
      setError("");
      const payload = await apiRequest("/emails/priority/keywords", {
        method: "DELETE",
        body: JSON.stringify({ keyword })
      });
      setKeywords(payload.keywords);
      await loadPriority();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <h2>Priority View</h2>
      <p className="info-message">Use manual override to adjust scoring instantly.</p>
      {loading && <p className="info-message">Calculating priorities...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="keyword-manager">
          <h3>User Priority Keywords</h3>
          <div className="keyword-input-row">
            <input
              type="text"
              value={newKeyword}
              onChange={(event) => setNewKeyword(event.target.value)}
              placeholder="Add keyword (e.g. escalation)"
            />
            <button onClick={addKeyword} disabled={!newKeyword.trim()}>
              Add keyword
            </button>
          </div>
          <div className="keyword-list">
            {keywords.length === 0 && <p className="info-message">No user keywords added.</p>}
            {keywords.map((keyword, index) => (
              <div key={`${keyword}-${index}`} className="keyword-item">
                <span>{keyword}</span>
                <button onClick={() => deleteKeyword(keyword)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        emails.map((email) => (
          <div key={email.id} className="override-card">
            <EmailList emails={[email]} showPriority />
            <div className="override-row">
              <input
                type="number"
                min="0"
                max="100"
                value={overrideValues[email.id] ?? email.priorityScore}
                onChange={(event) =>
                  setOverrideValues((current) => ({
                    ...current,
                    [email.id]: event.target.value
                  }))
                }
              />
              <button onClick={() => updateOverride(email.id, overrideValues[email.id] ?? email.priorityScore)}>
                Save override
              </button>
            </div>
          </div>
        ))}
    </section>
  );
};
