// In-memory token store. Swap with Redis/DB repository later.
const tokensByUserId = new Map();
const manualPriorityOverrides = new Map();

export const tokenStore = {
  setUserTokens(userId, tokens) {
    tokensByUserId.set(userId, {
      ...tokens,
      updatedAt: new Date().toISOString()
    });
  },
  getUserTokens(userId) {
    return tokensByUserId.get(userId) || null;
  }
};

export const priorityOverrideStore = {
  set(emailId, priorityScore) {
    manualPriorityOverrides.set(emailId, {
      score: priorityScore,
      updatedAt: new Date().toISOString()
    });
  },
  get(emailId) {
    return manualPriorityOverrides.get(emailId) || null;
  }
};
