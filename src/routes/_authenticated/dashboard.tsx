import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { FocusTimer } from "@/components/virgo/widgets/focus-timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ArrowRight, CalendarDays, Check, Moon, Sparkles, TrendingUp } from "lucide-react";
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
  const [dateLabel, setDateLabel] = React.useState("");
  React.useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);
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
    { label: "Open tasks", value: String(open.length), detail: "3 high priority", icon: Check },
    { label: "Daily rhythm", value: `${habitDone}/${state.habits.length}`, detail: "habits complete", icon: TrendingUp },
    { label: "Sleep", value: `${avg(recent.map((h) => h.sleep)).toFixed(1)}h`, detail: "7 day average", icon: Moon },
    { label: "Monthly spend", value: `$${monthSpend(state.txns).toFixed(0)}`, detail: "across all categories", icon: CalendarDays },
  ];

  return (
    <AppShell
      title="Today"
      subtitle={dateLabel}
      actions={
        <Button asChild>
          <Link to="/planner">
            <Sparkles className="mr-2 h-4 w-4" />
            AI plan
          </Link>
        </Button>
      }
    >
      <div className="virgo-rise grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <div className="space-y-4">
          <section className="relative overflow-hidden rounded-lg bg-primary px-6 py-7 text-primary-foreground shadow-xl sm:px-8 sm:py-9">
            <div className="absolute inset-y-0 right-0 w-2/5 bg-gold/5" />
            <div className="relative max-w-2xl">
              <div className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/45"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Daily brief</div>
              <h2 className="font-heading text-2xl font-medium leading-tight sm:text-3xl">Protect the first half of your day for the roadmap.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/58">You have {open.length} open tasks and {events.length} fixed events. Your clearest path is one meaningful block before reactive work begins.</p>
              <Button asChild variant="secondary" className="mt-6"><Link to="/planner"><Sparkles />Build today’s plan<ArrowRight /></Link></Button>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return <Card key={s.label} className="group"><CardContent className="p-4"><div className="mb-5 flex items-center justify-between"><Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-gold"/><span className="h-1.5 w-1.5 rounded-full bg-border" /></div><p className="font-heading text-2xl font-semibold tabular-nums">{s.value}</p><p className="mt-1 text-[11px] font-medium text-muted-foreground">{s.label} · {s.detail}</p></CardContent></Card>
            })}
          </div>

          <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-heading text-lg"><span>Top priorities</span><Link to="/tasks" className="font-sans text-xs font-semibold text-muted-foreground hover:text-foreground">View all</Link></CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {open.slice(0, 5).map((task) => {
                const score = priorityScore(task);
                return (
                  <li key={task.id} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b py-3.5 last:border-0">
                    <Checkbox
                      id={`home-${task.id}`}
                      checked={task.done}
                      onCheckedChange={() => toggle(task.id)}
                      aria-label={task.title}
                    />
                    <label htmlFor={`home-${task.id}`} className="min-w-0 text-sm font-semibold">
                      <span className="block truncate">{task.title}</span>
                      <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">{task.project}</span>
                    </label>
                    <Badge className={cn("tabular-nums", priorityBand(score).tone)}>{score}</Badge>
                  </li>
                );
              })}
            </ul>
          </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-heading text-lg"><span>Today’s flow</span><span className="text-xs font-medium text-muted-foreground">{events.length} events</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(plan ? plan.blocks.slice(0, 6) : events).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing scheduled yet.</p>
            ) : plan ? (
              plan.blocks.slice(0, 6).map((b, i) => (
                 <div key={i} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-l border-gold/35 py-2 pl-4 text-sm">
                   <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                    {b.start}–{b.end}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{b.title}</span>
                </div>
              ))
            ) : (
              events.map((e) => (
                 <div key={e.id} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-l border-gold/35 py-2 pl-4 text-sm">
                   <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                    {e.start}–{e.end}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{e.title}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <FocusTimer />

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

        </aside>
      </div>
    </AppShell>
  );
}
