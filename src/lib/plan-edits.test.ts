import { describe, it } from "node:test";
import { deepStrictEqual, strictEqual, throws } from "node:assert";
import { preparePlanEdits } from "./plan-edits";

describe("AI plan editing", () => {
  const plan = {
    date: "2026-11-16",
    generatedAt: "2026-11-16T00:00:00Z",
    note: " Keep the morning clear ",
    blocks: [{ start: "10:00", end: "11:30", title: " Updated priority ", why: " New note " }],
  };
  it("saves edited times, titles, block notes and strategy without changing plan metadata", () => {
    deepStrictEqual(preparePlanEdits(plan), {
      ...plan, note: "Keep the morning clear",
      blocks: [{ start: "10:00", end: "11:30", title: "Updated priority", why: "New note" }],
    });
    strictEqual(plan.blocks[0]?.title, " Updated priority ");
  });
  it("rejects a missing title", () => {
    throws(() => preparePlanEdits({ ...plan, blocks: [{ start: "10:00", end: "11:30", title: " ", why: "" }] }), /needs a title/);
  });
  it("rejects an end time before the start", () => {
    throws(() => preparePlanEdits({ ...plan, blocks: [{ start: "10:00", end: "09:00", title: "Work", why: "" }] }), /end time later/);
  });
});