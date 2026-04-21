import { priorityOverrideStore } from "./tokenStore.js";

const KEYWORD_WEIGHTS = {
  urgent: 25,
  asap: 20,
  deadline: 18,
  meeting: 12,
  followup: 10,
  action: 14,
  important: 15
};

const IMPORTANT_SENDERS = {
  "manager@company.com": 20,
  "ceo@company.com": 25,
  "hr@company.com": 10
};

const RECENCY_HALF_LIFE_HOURS = 24;

const getKeywordScore = (email) => {
  const content = `${email.subject} ${email.snippet}`.toLowerCase();
  return Object.entries(KEYWORD_WEIGHTS).reduce((score, [keyword, weight]) => {
    return content.includes(keyword) ? score + weight : score;
  }, 0);
};

const getSenderScore = (sender) => {
  const normalizedSender = sender.toLowerCase();
  const senderEmailMatch = Object.keys(IMPORTANT_SENDERS).find((knownSender) =>
    normalizedSender.includes(knownSender)
  );
  return senderEmailMatch ? IMPORTANT_SENDERS[senderEmailMatch] : 0;
};

const getRecencyScore = (emailDate) => {
  const dateValue = new Date(emailDate).getTime();
  if (Number.isNaN(dateValue)) return 0;

  const ageHours = (Date.now() - dateValue) / (1000 * 60 * 60);
  return Math.max(0, 35 * Math.exp((-Math.log(2) * ageHours) / RECENCY_HALF_LIFE_HOURS));
};

export const scoreEmailsByPriority = (emails) => {
  return emails
    .map((email) => {
      const override = priorityOverrideStore.get(email.id);
      if (override) {
        return { ...email, priorityScore: override.score, scoreSource: "manual_override" };
      }

      const keywordScore = getKeywordScore(email);
      const senderScore = getSenderScore(email.sender);
      const recencyScore = getRecencyScore(email.date);
      const rawScore = keywordScore + senderScore + recencyScore;
      const priorityScore = Math.min(100, Math.round(rawScore));

      return {
        ...email,
        priorityScore,
        scoreSource: "algorithm",
        scoreBreakdown: { keywordScore, senderScore, recencyScore: Math.round(recencyScore) }
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
};
