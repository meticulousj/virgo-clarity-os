import { describe, it } from "node:test";
import { strictEqual, throws, deepStrictEqual } from "node:assert";
import { validatePriorities, prioritiesToTasks } from "./brain-dump";

const priorities = ["Send proposal", "Pay rent", "Book appointment"].map((title) => ({ title, why: "Time sensitive", firstStep: "Open the details" }));
describe("Brain dump priorities", () => {
  it("returns exactly three priorities", () => {
    strictEqual(validatePriorities({ priorities }).length, 3);
    throws(() => validatePriorities({ priorities: priorities.slice(0, 2) }), /exactly three/);
    throws(() => validatePriorities({ priorities: [...priorities, priorities[0]] }), /exactly three/);
  });
  it("rejects duplicate priorities", () => {
    throws(() => validatePriorities({ priorities: [priorities[0], priorities[0], priorities[2]] }), /overlapped/);
  });
  it("saves three actionable tasks without duplicating existing open tasks", () => {
    let count = 0;
    const first = prioritiesToTasks(priorities, [], "2026-11-17", () => `task-${++count}`);
    strictEqual(first.tasks.length, 3);
    strictEqual(first.tasks.every((t) => !t.done), true);
    const second = prioritiesToTasks(priorities, first.tasks, "2026-11-17", () => `task-${++count}`);
    strictEqual(second.tasks.length, 3);
    deepStrictEqual(second.taskIds, first.taskIds);
  });
});