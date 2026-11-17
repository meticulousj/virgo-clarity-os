import { z } from "zod";
import type { Task } from "./store";

export const PriorityShape = z.object({
  title: z.string(),
  why: z.string(),
  firstStep: z.string(),
});
export const BrainDumpShape = z.object({ priorities: z.array(PriorityShape) });
export type BrainPriority = z.infer<typeof PriorityShape>;

export function validatePriorities(raw: unknown): BrainPriority[] {
  const { priorities } = BrainDumpShape.parse(raw);
  if (priorities.length !== 3) throw new Error("Please try again — we need exactly three priorities.");
  const clean = priorities.map((p) => ({ title: p.title.trim(), why: p.why.trim(), firstStep: p.firstStep.trim() }));
  if (clean.some((p) => !p.title || !p.why || !p.firstStep)) throw new Error("A priority was incomplete. Please try again.");
  if (new Set(clean.map((p) => p.title.toLowerCase())).size !== 3) throw new Error("The priorities overlapped. Please try again.");
  return clean;
}

export function prioritiesToTasks(priorities: BrainPriority[], tasks: Task[], date: string, makeId: () => string) {
  const next = [...tasks];
  const taskIds = priorities.map((p) => {
    const existing = next.find((t) => !t.done && t.title.trim().toLowerCase() === p.title.trim().toLowerCase());
    if (existing) return existing.id;
    const id = makeId();
    next.push({ id, title: p.title.trim(), project: "Brain dump", impact: 5, urgency: 4, effort: 2, done: false, createdAt: date });
    return id;
  });
  return { tasks: next, taskIds };
}