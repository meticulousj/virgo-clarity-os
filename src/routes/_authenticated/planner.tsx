import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Clock } from "lucide-react";
import { generateDailyPlan } from "@/lib/ai.functions";
import { contextSnapshot, setState, today, useVirgo } from "@/lib/store";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "AI Daily Planner — Virgo OS" },
      {
        name: "description",
        content:
          "Turn your tasks, calendar and energy into a realistic time-blocked plan for today.",
      },
      { property: "og:title", content: "AI Daily Planner — Virgo OS" },
      {
        property: "og:description",
        content: "A time-blocked plan built from your priorities, calendar and energy levels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function PlannerPage() {
  const state = useVirgo();
  const run = useServerFn(generateDailyPlan);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const plan = state.plan && state.plan.date === today() ? state.plan : null;

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await run({
        data: { snapshot: JSON.stringify(contextSnapshot(state)) },
      });
      setState((s) => ({
        ...s,
        plan: {
          date: today(),
          blocks: result.blocks,
          note: result.note,
          generatedAt: new Date().toISOString(),
        },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build a plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Daily Planner"
      subtitle="A time-blocked day built from your priorities, calendar and recent energy."
      actions={
        <Button onClick={generate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {plan ? "Rebuild plan" : "Build today's plan"}
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Today's blocks</CardTitle>
          </CardHeader>
          <CardContent>
            {!plan ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No plan yet for today. Generate one and Virgo will sequence your highest-scoring
                  work around your fixed events.
                </p>
              </div>
            ) : (
              <ol className="space-y-2">
                {plan.blocks.map((b, i) => (
                  <li
                    key={`${b.start}-${i}`}
                    className="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/40"
                  >
                    <div className="w-24 shrink-0 font-heading text-sm font-semibold tabular-nums">
                      {b.start}–{b.end}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{b.title}</p>
                      {b.why ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">{b.why}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg">Strategy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {plan?.note ?? "Virgo explains the logic behind the plan here once it's generated."}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg">Fixed today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {state.events.filter((e) => e.date === today()).length === 0 ? (
                <p className="text-sm text-muted-foreground">No events scheduled.</p>
              ) : (
                state.events
                  .filter((e) => e.date === today())
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map((e) => (
                    <div key={e.id} className="flex items-center gap-2 text-sm">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="tabular-nums text-muted-foreground">{e.start}</span>
                      <span className="flex-1 truncate">{e.title}</span>
                      <Badge variant="secondary" className="capitalize">
                        {e.kind}
                      </Badge>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}