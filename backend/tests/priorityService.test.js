import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scoreEmailsByPriority } from "../src/services/priorityService.js";
import { applyUserPriorityKeywordBoost } from "../src/services/userPriorityKeywordBoostService.js";
import {
  addUserPriorityKeyword,
  clearUserPriorityKeywordsForTests
} from "../src/services/userPriorityKeywordStore.js";

describe("priorityService", () => {
  it("ranks urgent emails from important senders higher", () => {
    const emails = [
      {
        id: "low",
        subject: "Team lunch",
        sender: "teammate@company.com",
        snippet: "Where should we go?",
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "high",
        subject: "Urgent deadline",
        sender: "manager@company.com",
        snippet: "Need this ASAP",
        date: new Date().toISOString()
      }
    ];

    const scored = scoreEmailsByPriority(emails);
    assert.equal(scored[0].id, "high");
    assert.ok(scored[0].priorityScore > scored[1].priorityScore);
    assert.equal(scored[0].scoreSource, "algorithm");
  });

  it("caps algorithm scores at 100", () => {
    const emails = [
      {
        id: "max",
        subject: "Urgent ASAP deadline action important meeting followup",
        sender: "ceo@company.com",
        snippet: "urgent asap deadline",
        date: new Date().toISOString()
      }
    ];

    const scored = scoreEmailsByPriority(emails);
    assert.equal(scored[0].priorityScore, 100);
  });
});

describe("userPriorityKeywordBoostService", () => {
  it("boosts matching emails and clamps at 100", () => {
    clearUserPriorityKeywordsForTests();
    addUserPriorityKeyword("user-a", "escalation");

    const emails = [
      {
        id: "match",
        subject: "Escalation required",
        sender: "ops@company.com",
        snippet: "Please review",
        priorityScore: 80,
        scoreSource: "algorithm"
      },
      {
        id: "other",
        subject: "Weekly update",
        sender: "ops@company.com",
        snippet: "All good",
        priorityScore: 40,
        scoreSource: "algorithm"
      }
    ];

    const boosted = applyUserPriorityKeywordBoost(emails, "user-a");
    assert.equal(boosted[0].id, "match");
    assert.equal(boosted[0].priorityScore, 100);
    assert.equal(boosted[0].userBoosted, true);
    assert.equal(boosted[1].priorityScore, 40);
  });

  it("does not leak keywords across users", () => {
    clearUserPriorityKeywordsForTests();
    addUserPriorityKeyword("user-a", "escalation");

    const emails = [
      {
        id: "match",
        subject: "Escalation required",
        snippet: "",
        priorityScore: 60,
        scoreSource: "algorithm"
      }
    ];

    const boostedForB = applyUserPriorityKeywordBoost(emails, "user-b");
    assert.equal(boostedForB[0].priorityScore, 60);
    assert.equal(boostedForB[0].userBoosted, undefined);
  });
});
