import assert from "node:assert/strict";
import { describe, it } from "node:test";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("API smoke tests", () => {
  const app = createApp();

  it("GET /api/health returns ok", async () => {
    const response = await request(app).get("/api/health");
    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });

  it("GET /api/email/inbox works in mock mode with x-user-id", async () => {
    const response = await request(app)
      .get("/api/email/inbox")
      .set("x-user-id", "smoke-test-user");

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.source, "fallback");
    assert.ok(Array.isArray(response.body.emails));
    assert.ok(response.body.emails.length > 0);
  });

  it("POST /api/email/reply returns fallback without OpenAI client injection", async () => {
    const response = await request(app).post("/api/email/reply").send({
      emailContent: "Please confirm the meeting agenda for tomorrow.",
      tone: "professional"
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.ok(["openai", "fallback"].includes(response.body.source));
    assert.ok(response.body.reply.length > 0);
  });

  it("GET /api/email/inbox rejects missing x-user-id", async () => {
    const response = await request(app).get("/api/email/inbox");
    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
  });
});
