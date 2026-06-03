import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { fetchInboxEmails, requireUserId } from "../services/gmailService.js";
import { scoreEmailsByPriority } from "../services/priorityService.js";
import { priorityOverrideStore, tokenStore } from "../services/tokenStore.js";
import { generateReply, normalizeTone } from "../services/aiReplyService.js";
import { applyUserPriorityKeywordBoost } from "../services/userPriorityKeywordBoostService.js";

export const getInbox = asyncHandler(async (req, res) => {
  const userId = req.header("x-user-id");
  requireUserId(userId);

  const tokens = tokenStore.getUserTokens(userId);
  const { source, emails } = await fetchInboxEmails(tokens);

  res.status(200).json({ success: true, source, emails });
});

export const getPriorityInbox = asyncHandler(async (req, res) => {
  const userId = req.header("x-user-id");
  requireUserId(userId);

  const tokens = tokenStore.getUserTokens(userId);
  const { source, emails } = await fetchInboxEmails(tokens);
  const prioritized = scoreEmailsByPriority(emails);
  const prioritizedWithUserBoost = applyUserPriorityKeywordBoost(prioritized, userId);

  res.status(200).json({ success: true, source, emails: prioritizedWithUserBoost });
});

export const setPriorityOverride = asyncHandler(async (req, res) => {
  const { emailId, priorityScore } = req.body;
  if (!emailId || typeof priorityScore !== "number") {
    throw new ApiError(400, "emailId and numeric priorityScore are required.");
  }

  if (priorityScore < 0 || priorityScore > 100) {
    throw new ApiError(400, "priorityScore must be between 0 and 100.");
  }

  priorityOverrideStore.set(emailId, priorityScore);
  res.status(200).json({ success: true, message: "Override saved." });
});

export const generateAiReply = asyncHandler(async (req, res) => {
  const { emailContent, tone } = req.body;
  if (!emailContent || emailContent.trim().length < 10) {
    throw new ApiError(400, "emailContent must contain at least 10 characters.");
  }

  const result = await generateReply({
    emailContent: emailContent.trim(),
    tone: normalizeTone(tone)
  });

  res.status(200).json({ success: true, ...result });
});
