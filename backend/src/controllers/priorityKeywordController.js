import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  addUserPriorityKeyword,
  listUserPriorityKeywords,
  removeUserPriorityKeyword
} from "../services/userPriorityKeywordStore.js";

export const getPriorityKeywords = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    keywords: listUserPriorityKeywords()
  });
});

export const createPriorityKeyword = asyncHandler(async (req, res) => {
  const keyword = (req.body.keyword || "").trim();
  if (!keyword) {
    throw new ApiError(400, "keyword is required.");
  }

  addUserPriorityKeyword(keyword);
  res.status(201).json({
    success: true,
    keywords: listUserPriorityKeywords()
  });
});

export const deletePriorityKeyword = asyncHandler(async (req, res) => {
  const keyword = (req.body.keyword || "").trim();
  if (!keyword) {
    throw new ApiError(400, "keyword is required.");
  }

  removeUserPriorityKeyword(keyword);
  res.status(200).json({
    success: true,
    keywords: listUserPriorityKeywords()
  });
});
