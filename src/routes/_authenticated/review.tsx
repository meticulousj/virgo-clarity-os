import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateWeeklyReview } from "@/lib/ai.functions";
import { contextSnapshot, setState, today, uid, useVirgo } from "@/lib/store";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
  head: () => ({
    meta: [
      { title: "Weekly Life Review — Virgo OS" },
      {
        name: "description",
        content: "An honest weekly review of wins, friction and next week's commitments.",
      },
      { property: "og:title", content: "Weekly Life Review — Virgo OS" },
      {
        property: "og:description",
        content: "Wins, friction and next week's commitments, drafted from your own data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ReviewPage() {
  const state = useVirgo();
  const run = useServerFn(generateWeeklyReview);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const draft = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { snapshot: JSON.stringify(contextSnapshot(state)) } });
      setState((s) => ({
        ...s,
        reviews: [{ id: uid(), weekOf: today(), ...result }, ...s.reviews],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not draft the review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Weekly Review"
      subtitle="Close the loop before starting a new week."
      actions={
        <Button onClick={draft} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Draft this week
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {state.reviews.map((r) => (
          <Card key={r.id}>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg">Week of {r.weekOf}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Section title="Wins" body={r.wins} />
              <Section title="Friction" body={r.friction} />
              <Section title="Next week" body={r.next} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed">{body || "—"}</p>
    </div>
  );
}