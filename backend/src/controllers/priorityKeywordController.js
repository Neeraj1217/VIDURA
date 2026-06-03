import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { requireUserId } from "../services/gmailService.js";
import {
  addUserPriorityKeyword,
  listUserPriorityKeywords,
  removeUserPriorityKeyword
} from "../services/userPriorityKeywordStore.js";

export const getPriorityKeywords = asyncHandler(async (req, res) => {
  const userId = req.header("x-user-id");
  requireUserId(userId);

  res.status(200).json({
    success: true,
    keywords: listUserPriorityKeywords(userId)
  });
});

export const createPriorityKeyword = asyncHandler(async (req, res) => {
  const userId = req.header("x-user-id");
  requireUserId(userId);

  const keyword = (req.body.keyword || "").trim();
  if (!keyword) {
    throw new ApiError(400, "keyword is required.");
  }

  addUserPriorityKeyword(userId, keyword);
  res.status(201).json({
    success: true,
    keywords: listUserPriorityKeywords(userId)
  });
});

export const deletePriorityKeyword = asyncHandler(async (req, res) => {
  const userId = req.header("x-user-id");
  requireUserId(userId);

  const keyword = (req.body.keyword || "").trim();
  if (!keyword) {
    throw new ApiError(400, "keyword is required.");
  }

  removeUserPriorityKeyword(userId, keyword);
  res.status(200).json({
    success: true,
    keywords: listUserPriorityKeywords(userId)
  });
});
