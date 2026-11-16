import type { DailyPlan } from "@/lib/store";

export function preparePlanEdits(plan: DailyPlan): DailyPlan {
  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  const blocks = plan.blocks.map((block, index) => {
    if (!block.title.trim()) throw new Error(`Block ${index + 1} needs a title.`);
    if (!time.test(block.start) || !time.test(block.end) || block.end <= block.start) {
      throw new Error(`Block ${index + 1} needs an end time later than its start time.`);
    }
    return { ...block, title: block.title.trim(), why: block.why.trim() };
  });
  return { ...plan, blocks, note: plan.note.trim() };
}