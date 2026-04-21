export const EmailList = ({ emails, showPriority = false }) => {
  if (!emails.length) {
    return <p className="info-message">No emails found for this view.</p>;
  }

  return (
    <div className="email-list">
      {emails.map((email) => (
        <article className="email-card" key={email.id}>
          <div className="email-header">
            <h3>{email.subject || "(No subject)"}</h3>
            {showPriority && <span className="priority-pill">Score: {email.priorityScore}</span>}
          </div>
          <p className="email-meta">{email.sender || "Unknown sender"}</p>
          <p>{email.snippet}</p>
          <p className="email-date">{email.date ? new Date(email.date).toLocaleString() : "Unknown date"}</p>
        </article>
      ))}
    </div>
  );
};
