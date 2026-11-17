import { describe, it } from "node:test";
import { strictEqual } from "node:assert";
import { recommendNextAction } from "./next-action";
import type { Task } from "./store";

const task: Task = { id: "proposal", title: "Send proposal", project: "Work", impact: 5, urgency: 5, effort: 1, done: false, createdAt: "2026-11-17" };

describe("One-click next action", () => {
  it("recommends one highest-priority open task", () => {
    const result = recommendNextAction([{ ...task, id: "later", impact: 1, urgency: 1 }, task, { ...task, id: "done", done: true }], null, "2026-11-17");
    strictEqual(result?.task.id, "proposal");
  });
  it("explains why the recommended task matters using its actual ratings", () => {
    const result = recommendNextAction([task], null, "2026-11-17");
    strictEqual(result?.why.includes("impact 5/5"), true);
  });
  it("returns no recommendation when all tasks are complete", () => {
    strictEqual(recommendNextAction([{ ...task, done: true }], null, "2026-11-17"), null);
  });
  it("uses the saved brain-dump reason and first step for a linked task", () => {
    const result = recommendNextAction([task], { text: "Proposal", taskIds: [task.id], priorities: [{ title: task.title, why: "It unlocks the client decision.", firstStep: "Open the proposal draft." }] }, "2026-11-17");
    strictEqual(result?.why, "It unlocks the client decision.");
    strictEqual(result?.firstStep, "Open the proposal draft.");
  });
});