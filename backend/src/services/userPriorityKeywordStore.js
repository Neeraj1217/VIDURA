export const userPriorityKeywords = [];

export const addUserPriorityKeyword = (keyword) => {
  userPriorityKeywords.push(keyword);
};

export const removeUserPriorityKeyword = (keyword) => {
  const normalizedKeyword = keyword.toLowerCase();
  const nextKeywords = userPriorityKeywords.filter(
    (item) => item.toLowerCase() !== normalizedKeyword
  );
  userPriorityKeywords.length = 0;
  userPriorityKeywords.push(...nextKeywords);
};

export const listUserPriorityKeywords = () => [...userPriorityKeywords];
