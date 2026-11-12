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

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Today — Virgo OS" },
      {
        name: "description",
        content: "Your daily priorities, schedule, habits, and focus in one clear view.",
      },
      { property: "og:title", content: "Today — Virgo OS" },
      {
        property: "og:description",
        content: "Your daily priorities, schedule, habits, and focus in one clear view.",
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
    { label: "Open tasks", value: String(open.length), detail: `${open.filter((t) => priorityScore(t) >= 50).length} high priority`, icon: Check },
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
      <div className="virgo-rise grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
        <div className="space-y-6">
          <section className="border-b border-gold/35 py-2 sm:py-4">
            <div className="max-w-2xl">
              <p className="eyebrow flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                Daily brief
              </p>
              <h2 className="mt-4 font-heading text-2xl font-semibold leading-tight sm:text-[2rem]">
                Protect the first half of your day for{" "}
                <span>what matters most.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                You have {open.length} open tasks and {events.length} fixed events. Your clearest
                path is one meaningful block before reactive work begins.
              </p>
              <Button asChild size="sm" className="mt-5 bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/planner">
                  Build today’s plan <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="min-w-0 border-t border-gold/50 py-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">{s.label}</span>
                      <Icon className="h-3.5 w-3.5 shrink-0 text-gold" />
                    </div>
                    <p className="mt-3 font-heading text-2xl font-semibold tabular-nums">{s.value}</p>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{s.detail}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-heading text-lg"><span>Top priorities</span><Link to="/tasks" className="font-sans text-xs font-semibold text-muted-foreground hover:text-foreground">View all</Link></CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {open.slice(0, 5).map((task) => {
                const score = priorityScore(task);
                return (
                  <li key={task.id} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b py-3 last:border-0">
                    <Checkbox
                      id={`home-${task.id}`}
                      checked={task.done}
                      onCheckedChange={() => toggle(task.id)}
                      aria-label={task.title}
                    />
                    <label htmlFor={`home-${task.id}`} className="min-w-0 text-sm font-semibold">
                      <span className="block break-words">{task.title}</span>
                      <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">{task.project}</span>
                    </label>
                    <span className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn("hidden sm:inline-flex", priorityBand(score).tone)}>
                        {priorityBand(score).label}
                      </Badge>
                      <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary font-heading text-sm font-semibold tabular-nums">
                        {score}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
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
                  <span className="min-w-0 break-words">{b.title}</span>
                </div>
              ))
            ) : (
              events.map((e) => (
                 <div key={e.id} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-l border-gold/35 py-2 pl-4 text-sm">
                   <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                    {e.start}–{e.end}
                  </span>
                  <span className="min-w-0 break-words">{e.title}</span>
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
                    <span className="min-w-0 break-words pr-3">{g.title}</span>
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
