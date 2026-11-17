import { sortedTasks, type State, type Task } from "./store";

export function recommendNextAction(tasks: Task[], brainDump: State["brainDump"], date: string) {
  const task = sortedTasks(tasks.filter((item) => !item.done))[0];
  if (!task) return null;

  const priorityIndex = brainDump?.taskIds.indexOf(task.id) ?? -1;
  const priority = priorityIndex >= 0 ? brainDump?.priorities[priorityIndex] : undefined;
  const reasons: string[] = [];
  if (task.due) {
    if (task.due < date) reasons.push(`It is overdue (${task.due}), so acting now reduces the risk of falling further behind.`);
    else if (task.due === date) reasons.push("It is due today, so finishing it protects today's deadline.");
    else reasons.push(`It is due ${task.due}; making progress now keeps that deadline manageable.`);
  }
  if (priority) reasons.push(priority.why);
  else {
    reasons.push(task.impact >= 4
      ? `You rated its impact ${task.impact}/5, making it a meaningful use of your attention.`
      : `Its impact (${task.impact}/5) and urgency (${task.urgency}/5) give it the highest priority among your open tasks.`);
    if (task.effort <= 2) reasons.push(`With effort rated ${task.effort}/5, it is a manageable next step.`);
  }
  return { task, why: reasons.join(" "), firstStep: priority?.firstStep ?? null };
}