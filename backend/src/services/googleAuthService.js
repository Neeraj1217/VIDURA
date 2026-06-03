import { google } from "googleapis";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/gmail.readonly"
];

export const createOAuth2Client = () =>
  new google.auth.OAuth2(
    env.googleClientId,
    env.googleClientSecret,
    env.googleRedirectUri
  );

export const getAuthUrl = (state = "default-state") => {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state
  });
};

export const exchangeCodeForTokens = async (code) => {
  const oauth2Client = createOAuth2Client();

  logger.info("[google-oauth] Exchanging authorization code for tokens", {
    client_id_configured: Boolean(env.googleClientId),
    redirect_uri: env.googleRedirectUri
  });

  const { tokens } = await oauth2Client.getToken({
    code,
    redirect_uri: env.googleRedirectUri
  });

  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const createAuthorizedGmail = (tokens) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return google.gmail({ version: "v1", auth: oauth2Client });
};
