import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Trash2 } from "lucide-react";
import { generateRoutineTips } from "@/lib/ai.functions";
import {
  avg,
  contextSnapshot,
  removeHealth,
  setState,
  today,
  upsertHealth,
  useVirgo,
  type HealthLog,
} from "@/lib/store";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
  head: () => ({
    meta: [
      { title: "Health & Productivity Insights — Virgo OS" },
      {
        name: "description",
        content: "Sleep, energy, focus and step trends plus AI recommendations for your routines.",
      },
      { property: "og:title", content: "Health & Productivity Insights — Virgo OS" },
      {
        property: "og:description",
        content: "Sleep, energy and focus trends with AI recommendations for better routines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function InsightsPage() {
  const state = useVirgo();
  const run = useServerFn(generateRoutineTips);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const recent = state.health.slice(-7);
  const stats = [
    { label: "Avg sleep", value: `${avg(recent.map((h) => h.sleep)).toFixed(1)}h` },
    { label: "Avg energy", value: `${avg(recent.map((h) => h.energy)).toFixed(1)}/5` },
    { label: "Focus / day", value: `${Math.round(avg(recent.map((h) => h.focusMinutes)))}m` },
    { label: "Steps / day", value: Math.round(avg(recent.map((h) => h.steps))).toLocaleString() },
  ];
  const maxFocus = Math.max(...recent.map((h) => h.focusMinutes), 1);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { snapshot: JSON.stringify(contextSnapshot(state)) } });
      setState((s) => ({
        ...s,
        recommendations: { text: result.text, generatedAt: new Date().toISOString() },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Insights"
      subtitle="Health, sleep and productivity signals from the last two weeks."
      actions={
        <Button onClick={generate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Improve my routines
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

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

      <HealthLogger logs={state.health} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Sleep vs focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-2">
              {recent.map((h) => (
                <div key={h.date} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary"
                    style={{ height: `${(h.focusMinutes / maxFocus) * 100}%` }}
                    title={`${h.focusMinutes} focus minutes`}
                  />
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {h.sleep.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Bars: focus minutes. Numbers: hours slept the night before.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">AI recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {state.recommendations ? (
              <div className="space-y-2 text-sm leading-relaxed">
                {state.recommendations.text
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <p key={i}>{line.replace(/^[-•]\s*/, "• ")}</p>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Generate recommendations to see concrete routine changes based on your sleep,
                habits, spending and journal notes.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

const FIELDS = [
  { key: "sleep", label: "Sleep (h)", step: "0.1", max: 24 },
  { key: "energy", label: "Energy (1-5)", step: "1", max: 5 },
  { key: "focusMinutes", label: "Focus (min)", step: "5", max: 1440 },
  { key: "steps", label: "Steps", step: "100", max: 100000 },
] as const;

const emptyDraft = () => ({
  date: today(),
  sleep: "7.5",
  energy: "4",
  focusMinutes: "180",
  steps: "8000",
});

function HealthLogger({ logs }: { logs: HealthLog[] }) {
  const [draft, setDraft] = React.useState(emptyDraft);

  const existing = logs.find((h) => h.date === draft.date);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const num = (v: string) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    upsertHealth({
      date: draft.date,
      sleep: Math.max(0, Math.min(24, num(draft.sleep))),
      energy: Math.max(1, Math.min(5, Math.round(num(draft.energy)))),
      focusMinutes: Math.max(0, Math.round(num(draft.focusMinutes))),
      steps: Math.max(0, Math.round(num(draft.steps))),
    });
  };

  const edit = (h: HealthLog) =>
    setDraft({
      date: h.date,
      sleep: String(h.sleep),
      energy: String(h.energy),
      focusMinutes: String(h.focusMinutes),
      steps: String(h.steps),
    });

  const rows = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg">Log your day</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-1">
            <Label htmlFor="hl-date" className="text-xs">
              Date
            </Label>
            <Input
              id="hl-date"
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </div>
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1">
              <Label htmlFor={`hl-${f.key}`} className="text-xs">
                {f.label}
              </Label>
              <Input
                id={`hl-${f.key}`}
                type="number"
                min={0}
                max={f.max}
                step={f.step}
                value={draft[f.key]}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
              />
            </div>
          ))}
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              {existing ? "Update" : "Save"}
            </Button>
          </div>
        </form>

        <ul className="mt-4 divide-y rounded-lg border">
          {rows.map((h) => (
            <li key={h.date} className="flex items-center gap-3 p-2 text-sm">
              <span className="w-24 tabular-nums text-muted-foreground">{h.date}</span>
              <span className="tabular-nums">{h.sleep.toFixed(1)}h sleep</span>
              <span className="tabular-nums text-muted-foreground">energy {h.energy}/5</span>
              <span className="tabular-nums text-muted-foreground">{h.focusMinutes}m focus</span>
              <span className="tabular-nums text-muted-foreground">
                {h.steps.toLocaleString()} steps
              </span>
              <div className="ml-auto flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => edit(h)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete log for ${h.date}`}
                  onClick={() => removeHealth(h.date)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}