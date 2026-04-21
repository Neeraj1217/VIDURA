import { ApiError } from "../utils/ApiError.js";
import { createAuthorizedGmail } from "./googleAuthService.js";
import { logger } from "../utils/logger.js";

const fallbackEmails = [
  {
    id: "mock-1",
    subject: "Urgent: Deadline pushed to tomorrow",
    sender: "manager@company.com",
    snippet: "Need the final analytics summary by 10 AM tomorrow.",
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: "mock-2",
    subject: "Team meeting notes",
    sender: "teammate@company.com",
    snippet: "Sharing the action items from today and blockers.",
    date: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
  }
];

const parseHeader = (headers = [], name) =>
  headers.find((header) => header.name.toLowerCase() === name.toLowerCase())?.value || "";

export const fetchInboxEmails = async (tokens) => {
  if (!tokens) {
    return {
      source: "fallback",
      emails: fallbackEmails
    };
  }

  try {
    const gmail = createAuthorizedGmail(tokens);
    const inboxResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 15,
      q: "in:inbox"
    });

    const messageIds = inboxResponse.data.messages || [];

    if (messageIds.length === 0) {
      return { source: "gmail", emails: [] };
    }

    const messages = await Promise.all(
      messageIds.map(({ id }) =>
        gmail.users.messages.get({
          userId: "me",
          id,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"]
        })
      )
    );

    const emails = messages.map((message) => {
      const headers = message.data.payload?.headers || [];
      return {
        id: message.data.id,
        subject: parseHeader(headers, "Subject"),
        sender: parseHeader(headers, "From"),
        snippet: message.data.snippet || "",
        date: parseHeader(headers, "Date")
      };
    });

    return { source: "gmail", emails };
  } catch (error) {
    logger.error("Gmail fetch failed, serving fallback data.", error.message);
    return { source: "fallback", emails: fallbackEmails };
  }
};

export const requireUserId = (userId) => {
  if (!userId) {
    throw new ApiError(401, "Missing x-user-id header. Please authenticate first.");
  }
};
