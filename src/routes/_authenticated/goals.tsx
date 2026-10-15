import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { setState, useVirgo } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/goals")({
  component: GoalsPage,
  head: () => ({
    meta: [
      { title: "Goal Dashboard — Virgo OS" },
      {
        name: "description",
        content: "Track progress, pace and deadlines across every goal you're committed to.",
      },
      { property: "og:title", content: "Goal Dashboard — Virgo OS" },
      {
        property: "og:description",
        content: "Progress, pace and deadlines for every goal in one view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function GoalsPage() {
  const state = useVirgo();

  const nudge = (id: string, delta: number) =>
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) =>
        g.id === id
          ? { ...g, current: Math.max(0, Math.min(g.target, g.current + delta * step(g.target))) }
          : g,
      ),
    }));

  return (
    <AppShell title="Goals" subtitle="What this quarter is actually for.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);
          return (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-base leading-snug">
                    {goal.title}
                  </CardTitle>
                  <Badge variant="secondary">{goal.area}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <span className="font-heading text-3xl font-semibold tabular-nums">{pct}%</span>
                  <span className="text-xs text-muted-foreground">
                    {daysLeft > 0 ? `${daysLeft} days left` : "past deadline"}
                  </span>
                </div>
                <Progress value={pct} className="mt-3 h-2" />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Decrease ${goal.title}`}
                      onClick={() => nudge(goal.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Increase ${goal.title}`}
                      onClick={() => nudge(goal.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

function step(target: number) {
  if (target >= 1000) return 100;
  if (target >= 100) return 10;
  return 1;
}