import { listUserPriorityKeywords } from "./userPriorityKeywordStore.js";

export const applyUserPriorityKeywordBoost = (emails) => {
  const keywords = listUserPriorityKeywords();

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
        priorityScore: email.priorityScore + 50,
        userBoosted: true
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
};
