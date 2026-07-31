import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/virgo/app-shell";
import { FocusTimer } from "@/components/virgo/widgets/focus-timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import {
  avg,
  habitStreak,
  monthSpend,
  priorityBand,
  priorityScore,
  setState,
  sortedTasks,
  today,
  useVirgo,
  weekDates,
} from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Virgo OS — Clarity & Execution" },
      {
        name: "description",
        content: "Your all-in-one personal operating system for clarity and execution.",
      },
      { property: "og:title", content: "Virgo OS — Clarity & Execution" },
      {
        property: "og:description",
        content: "Your all-in-one personal operating system for clarity and execution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const state = useVirgo();
  const week = weekDates();
  const open = sortedTasks(state.tasks.filter((t) => !t.done));
  const events = state.events
    .filter((e) => e.date === today())
    .sort((a, b) => a.start.localeCompare(b.start));
  const habitDone = state.habits.reduce(
    (n, h) => n + (h.log.includes(today()) ? 1 : 0),
    0,
  );
  const recent = state.health.slice(-7);
  const plan = state.plan && state.plan.date === today() ? state.plan : null;

  const toggle = (id: string) =>
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));

  const stats = [
    { label: "Open tasks", value: String(open.length) },
    { label: "Habits today", value: `${habitDone}/${state.habits.length}` },
    { label: "Avg sleep", value: `${avg(recent.map((h) => h.sleep)).toFixed(1)}h` },
    { label: "Spent this month", value: `$${monthSpend(state.txns).toFixed(0)}` },
  ];

  return (
    <AppShell
      title="Today"
      subtitle={new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
      actions={
        <Button asChild>
          <Link to="/planner">
            <Sparkles className="mr-2 h-4 w-4" />
            AI plan
          </Link>
        </Button>
      }
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-heading text-2xl font-semibold tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Top priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {open.slice(0, 5).map((task) => {
                const score = priorityScore(task);
                return (
                  <li key={task.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Checkbox
                      id={`home-${task.id}`}
                      checked={task.done}
                      onCheckedChange={() => toggle(task.id)}
                      aria-label={task.title}
                    />
                    <label htmlFor={`home-${task.id}`} className="min-w-0 flex-1 text-sm font-medium">
                      {task.title}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {task.project}
                      </span>
                    </label>
                    <Badge className={cn("tabular-nums", priorityBand(score).tone)}>{score}</Badge>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(plan ? plan.blocks.slice(0, 6) : events).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing scheduled yet.</p>
            ) : plan ? (
              plan.blocks.slice(0, 6).map((b, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="w-24 shrink-0 tabular-nums text-muted-foreground">
                    {b.start}–{b.end}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{b.title}</span>
                </div>
              ))
            ) : (
              events.map((e) => (
                <div key={e.id} className="flex gap-3 text-sm">
                  <span className="w-24 shrink-0 tabular-nums text-muted-foreground">
                    {e.start}–{e.end}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{e.title}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Habits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.habits.map((h) => {
              const done = h.log.filter((d) => week.includes(d)).length;
              return (
                <div key={h.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{h.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {done}/{h.target} · {habitStreak(h)}d
                    </span>
                  </div>
                  <Progress value={Math.min(100, (done / h.target) * 100)} className="mt-1 h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.goals.map((g) => (
              <div key={g.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{g.title}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {Math.round((g.current / g.target) * 100)}%
                  </span>
                </div>
                <Progress value={(g.current / g.target) * 100} className="mt-1 h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <FocusTimer />
      </div>
    </AppShell>
  );
}
