import OpenAI from "openai";
import { env } from "../config/env.js";

const VALID_TONES = ["professional", "casual", "friendly"];

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const fallbackReply = (emailContent, tone) => {
  const greeting = tone === "casual" ? "Hi" : "Hello";
  return `${greeting},\n\nThank you for your email. I reviewed your message: "${emailContent.slice(
    0,
    120
  )}". I will follow up shortly with the requested details.\n\nBest regards,\nYour Name`;
};

export const normalizeTone = (tone) => (VALID_TONES.includes(tone) ? tone : "professional");

export const generateReply = async ({ emailContent, tone }) => {
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

  const completion = await client.chat.completions.create({
    model: env.openaiModel,
    temperature: 0.4,
    messages: [
      { role: "system", content: "You generate high-quality business emails." },
      { role: "user", content: prompt }
    ]
  });

  return {
    tone: safeTone,
    reply: completion.choices[0]?.message?.content?.trim() || fallbackReply(emailContent, safeTone),
    source: "openai"
  };
};
