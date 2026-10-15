import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Flame, Plus, Trash2 } from "lucide-react";
import { habitStreak, setState, uid, useVirgo, weekDates } from "@/lib/store";

export const Route = createFileRoute("/habits")({
  component: HabitsPage,
  head: () => ({
    meta: [
      { title: "Habit Tracker — Virgo OS" },
      {
        name: "description",
        content: "Track daily habits, streaks and weekly consistency against your own targets.",
      },
      { property: "og:title", content: "Habit Tracker — Virgo OS" },
      {
        property: "og:description",
        content: "Streaks and weekly consistency for the routines that actually move you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function HabitsPage() {
  const state = useVirgo();
  const [name, setName] = React.useState("");
  const week = weekDates();

  const toggle = (habitId: string, date: string) =>
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              log: h.log.includes(date) ? h.log.filter((d) => d !== date) : [...h.log, date],
            }
          : h,
      ),
    }));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setState((s) => ({
      ...s,
      habits: [...s.habits, { id: uid(), name: name.trim(), target: 5, log: [] }],
    }));
    setName("");
  };

  const remove = (id: string) =>
    setState((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }));

  return (
    <AppShell title="Habits" subtitle="Consistency beats intensity — one square at a time.">
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-lg">This week</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.habits.map((habit) => {
            const done = habit.log.filter((d) => week.includes(d)).length;
            const pct = Math.min(100, (done / habit.target) * 100);
            return (
              <div key={habit.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{habit.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {done}/{habit.target} this week
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Flame className="h-3 w-3" />
                      {habitStreak(habit)}d
                    </Badge>
                    <div className="flex gap-1">
                      {week.map((date, i) => {
                        const active = habit.log.includes(date);
                        return (
                          <button
                            key={date}
                            type="button"
                            onClick={() => toggle(habit.id, date)}
                            aria-label={`${habit.name} on ${date}`}
                            aria-pressed={active}
                            className={cn(
                              "h-7 w-7 rounded-md border text-[11px] font-medium transition-colors",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground hover:bg-accent",
                            )}
                          >
                            {DAY_LABELS[new Date(date).getDay()]}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${habit.name}`}
                      onClick={() => remove(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={pct} className="mt-3 h-1.5" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-lg">New habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2" onSubmit={add}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Walk 30 minutes"
              aria-label="Habit name"
            />
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}