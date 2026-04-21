import test from "node:test";
import assert from "node:assert/strict";
import { askOpenAI, getQuestionFromEvent } from "../index.mjs";

test("getQuestionFromEvent validates question input", () => {
  const question = getQuestionFromEvent({
    body: JSON.stringify({ question: "What tools do I use?" })
  });
  assert.equal(question, "What tools do I use?");

  assert.throws(() => getQuestionFromEvent({ body: JSON.stringify({ question: "" }) }));
  assert.throws(() => getQuestionFromEvent({}));
});

test("askOpenAI returns assistant text", async () => {
  const fakeFetch = async () => ({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: "Test answer from model." } }]
    })
  });

  const answer = await askOpenAI({
    apiKey: "test-key",
    model: "gpt-4o-mini",
    question: "Tell me about projects",
    context: "Resume context",
    fetchImpl: fakeFetch
  });

  assert.equal(answer, "Test answer from model.");
});
