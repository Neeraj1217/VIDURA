import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { exchangeCodeForTokens, getAuthUrl } from "../services/googleAuthService.js";
import { tokenStore } from "../services/tokenStore.js";
import { env } from "../config/env.js";

export const beginGoogleAuth = asyncHandler(async (req, res) => {
  const userId = req.query.userId || `user-${Date.now()}`;
  const url = getAuthUrl(userId);
  res.status(200).json({ success: true, authUrl: url, userId });
});

export const handleGoogleCallback = asyncHandler(async (req, res) => {
  const { code, state: userId } = req.query;
  if (!code || !userId) {
    throw new ApiError(400, "Missing OAuth callback code or state.");
  }

  const tokens = await exchangeCodeForTokens(code);
  tokenStore.setUserTokens(userId, tokens);

  const redirectUrl = `${env.clientUrl}/inbox?userId=${encodeURIComponent(userId)}`;
  res.redirect(302, redirectUrl);
});
