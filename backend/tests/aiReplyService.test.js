import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateReply, normalizeTone } from "../src/services/aiReplyService.js";

describe("aiReplyService", () => {
  it("normalizes invalid tone to professional", () => {
    assert.equal(normalizeTone("formal"), "professional");
    assert.equal(normalizeTone("casual"), "casual");
  });

  it("returns fallback when no OpenAI client is configured", async () => {
    const result = await generateReply(
      {
        emailContent: "Please send the quarterly report by Friday.",
        tone: "professional"
      },
      { client: null }
    );

    assert.equal(result.source, "fallback");
    assert.equal(result.tone, "professional");
    assert.match(result.reply, /Thank you for your email/);
  });

  it("falls back when OpenAI throws an error", async () => {
    const failingClient = {
      chat: {
        completions: {
          create: async () => {
            const error = new Error("429 You exceeded your current quota");
            error.status = 429;
            throw error;
          }
        }
      }
    };

    const result = await generateReply(
      {
        emailContent: "Can we reschedule our meeting to next week?",
        tone: "friendly"
      },
      { client: failingClient }
    );

    assert.equal(result.source, "fallback");
    assert.equal(result.tone, "friendly");
    assert.match(result.reply, /Thank you for your email/);
  });

  it("falls back when OpenAI returns an empty response", async () => {
    const emptyClient = {
      chat: {
        completions: {
          create: async () => ({ choices: [{ message: { content: "   " } }] })
        }
      }
    };

    const result = await generateReply(
      {
        emailContent: "Following up on the invoice from last month.",
        tone: "professional"
      },
      { client: emptyClient }
    );

    assert.equal(result.source, "fallback");
    assert.match(result.reply, /Thank you for your email/);
  });

  it("returns openai source on successful completion", async () => {
    const mockClient = {
      chat: {
        completions: {
          create: async () => ({
            choices: [{ message: { content: "Thanks for reaching out. I will review this today." } }]
          })
        }
      }
    };

    const result = await generateReply(
      {
        emailContent: "Could you share the latest project timeline?",
        tone: "professional"
      },
      { client: mockClient }
    );

    assert.equal(result.source, "openai");
    assert.match(result.reply, /Thanks for reaching out/);
  });
});
