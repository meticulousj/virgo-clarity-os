import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recommendNextAction } from "@/lib/next-action";
import { setState, today, useVirgo } from "@/lib/store";

export function NextAction() {
  const state = useVirgo();
  const [requested, setRequested] = React.useState(false);
  const [date, setDate] = React.useState("");
  const [completed, setCompleted] = React.useState("");
  const recommendation = requested ? recommendNextAction(state.tasks, state.brainDump, date) : null;

  function recommend() {
    setDate(today());
    setRequested(true);
    setCompleted("");
  }

  function complete() {
    if (!recommendation) return;
    const { task } = recommendation;
    setState((s) => ({ ...s, tasks: s.tasks.map((item) => item.id === task.id ? { ...item, done: true } : item) }));
    setCompleted(task.title);
    setDate(today());
  }

  return (
    <section aria-labelledby="next-action-heading" className="border-b border-gold/35 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="next-action-heading" className="flex items-center gap-2 font-heading text-xl font-semibold"><Compass className="h-5 w-5 shrink-0 text-gold" />Next action</h2>
        {!requested && <Button onClick={recommend}>What should I do next? <ArrowRight className="h-4 w-4" /></Button>}
      </div>
      <div aria-live="polite" className="min-w-0">
        {completed && <p role="status" className="mt-3 break-words text-sm text-muted-foreground">Completed: {completed}</p>}
        {recommendation && <div className="mt-4">
          <p className="eyebrow text-muted-foreground">{recommendation.task.project}</p>
          <h3 className="mt-2 break-words font-heading text-2xl font-semibold">{recommendation.task.title}</h3>
          <p className="mt-3 break-words text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Why it matters: </span>{recommendation.why}</p>
          {recommendation.firstStep && <p className="mt-2 break-words text-sm leading-6"><span className="font-semibold">First step: </span>{recommendation.firstStep}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={complete}><Check className="h-4 w-4" />Mark done</Button>
            <Button asChild variant="link" size="sm"><Link to="/tasks">View tasks <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>}
        {requested && !recommendation && <div className="mt-4">
          <p className="font-heading text-lg font-semibold">You're all caught up.</p>
          <Button asChild variant="link" className="mt-2 px-0"><Link to="/tasks">Add a task <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>}
      </div>
    </section>
  );
}