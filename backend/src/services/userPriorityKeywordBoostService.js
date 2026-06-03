import { listUserPriorityKeywords } from "./userPriorityKeywordStore.js";

const clampScore = (score) => Math.min(100, Math.max(0, Math.round(score)));

export const applyUserPriorityKeywordBoost = (emails, userId) => {
  const keywords = listUserPriorityKeywords(userId);

  if (!keywords.length) {
    return emails;
  }

  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());

  return emails
    .map((email) => {
      const subject = (email.subject || "").toLowerCase();
      const snippet = (email.snippet || "").toLowerCase();
      const matchesUserKeyword = normalizedKeywords.some(
        (keyword) => subject.includes(keyword) || snippet.includes(keyword)
      );

      if (!matchesUserKeyword) {
        return email;
      }

      return {
        ...email,
        priorityScore: clampScore(email.priorityScore + 50),
        userBoosted: true
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
};
