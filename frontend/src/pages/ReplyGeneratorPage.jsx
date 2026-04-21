import { useState } from "react";
import { apiRequest } from "../api/client";

const toneOptions = ["professional", "casual", "friendly"];

export const ReplyGeneratorPage = () => {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedReply, setGeneratedReply] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await apiRequest("/email/reply", {
        method: "POST",
        body: JSON.stringify({ emailContent, tone })
      });
      setGeneratedReply(payload.reply);
      setSource(payload.source);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Reply Generator</h2>
      <div className="form-grid">
        <label htmlFor="tone">Tone</label>
        <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)}>
          {toneOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="content">Email Content</label>
        <textarea
          id="content"
          value={emailContent}
          onChange={(event) => setEmailContent(event.target.value)}
          placeholder="Paste the email content here..."
          rows={8}
        />

        <button onClick={generate} disabled={loading || emailContent.trim().length < 10}>
          {loading ? "Generating..." : "Generate AI Reply"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {source && <p className="info-message">Response source: {source}</p>}
      {generatedReply && <pre className="reply-preview">{generatedReply}</pre>}
    </section>
  );
};
