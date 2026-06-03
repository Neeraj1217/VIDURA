import OpenAI from "openai";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const VALID_TONES = ["professional", "casual", "friendly"];

const fallbackReply = (emailContent, tone) => {
  const greeting = tone === "casual" ? "Hi" : "Hello";
  return `${greeting},\n\nThank you for your email. I reviewed your message: "${emailContent.slice(
    0,
    120
  )}". I will follow up shortly with the requested details.\n\nBest regards,\nYour Name`;
};

export const normalizeTone = (tone) => (VALID_TONES.includes(tone) ? tone : "professional");

const defaultClient = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

export const generateReply = async ({ emailContent, tone }, { client = defaultClient } = {}) => {
  const safeTone = normalizeTone(tone);

  if (!client) {
    return {
      tone: safeTone,
      reply: fallbackReply(emailContent, safeTone),
      source: "fallback"
    };
  }

  const prompt = [
    "You are an executive email assistant.",
    `Write a ${safeTone} reply that is concise, clear, and actionable.`,
    "Use 2-3 short paragraphs and include a clear next step.",
    "Avoid hallucinations. If information is missing, acknowledge and request it politely.",
    `Email content: ${emailContent}`
  ].join("\n");

  try {
    const completion = await client.chat.completions.create({
      model: env.openaiModel,
      temperature: 0.4,
      messages: [
        { role: "system", content: "You generate high-quality business emails." },
        { role: "user", content: prompt }
      ]
    });

    const replyText = completion.choices[0]?.message?.content?.trim();
    if (!replyText) {
      logger.warn("[ai-reply] OpenAI returned an empty response; using fallback.");
      return {
        tone: safeTone,
        reply: fallbackReply(emailContent, safeTone),
        source: "fallback"
      };
    }

    return {
      tone: safeTone,
      reply: replyText,
      source: "openai"
    };
  } catch (error) {
    const reason = error?.status || error?.code || error?.message || "unknown error";
    logger.warn(`[ai-reply] OpenAI request failed (${reason}); using fallback.`);
    return {
      tone: safeTone,
      reply: fallbackReply(emailContent, safeTone),
      source: "fallback"
    };
  }
};
