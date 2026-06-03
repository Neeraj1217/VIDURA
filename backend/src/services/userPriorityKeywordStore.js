const keywordsByUserId = new Map();

const getUserKeywords = (userId) => {
  if (!keywordsByUserId.has(userId)) {
    keywordsByUserId.set(userId, []);
  }
  return keywordsByUserId.get(userId);
};

export const addUserPriorityKeyword = (userId, keyword) => {
  const keywords = getUserKeywords(userId);
  const normalized = keyword.toLowerCase();
  if (!keywords.some((item) => item.toLowerCase() === normalized)) {
    keywords.push(keyword);
  }
};

export const removeUserPriorityKeyword = (userId, keyword) => {
  const normalizedKeyword = keyword.toLowerCase();
  const keywords = getUserKeywords(userId);
  const nextKeywords = keywords.filter((item) => item.toLowerCase() !== normalizedKeyword);
  keywordsByUserId.set(userId, nextKeywords);
};

export const listUserPriorityKeywords = (userId) => [...getUserKeywords(userId)];

export const clearUserPriorityKeywordsForTests = () => {
  keywordsByUserId.clear();
};
