import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Clock, Pencil, Save, X } from "lucide-react";
import { generateDailyPlan } from "@/lib/ai.functions";
import { contextSnapshot, setState, today, useVirgo, type DailyPlan, type PlanBlock } from "@/lib/store";
import { preparePlanEdits } from "@/lib/plan-edits";

export const Route = createFileRoute("/_authenticated/planner")({
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
  const [draft, setDraft] = React.useState<DailyPlan | null>(null);
  const [saved, setSaved] = React.useState(false);

  const plan = state.plan && state.plan.date === today() ? state.plan : null;

  const edit = () => {
    if (!plan) return;
    setDraft({ ...plan, blocks: plan.blocks.map((block) => ({ ...block })) });
    setError(null);
    setSaved(false);
  };
  const updateBlock = (index: number, field: keyof PlanBlock, value: string) => {
    setDraft((current) => current ? {
      ...current,
      blocks: current.blocks.map((block, i) => i === index ? { ...block, [field]: value } : block),
    } : null);
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    try {
      if (draft.date !== today()) throw new Error("This plan is from yesterday. Build today's plan first.");
      const updated = preparePlanEdits(draft);
      setState((s) => ({ ...s, plan: updated }));
      setDraft(null);
      setError(null);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your changes.");
    }
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);
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
        <div className="flex flex-wrap gap-2">
        {draft ? <>
          <Button variant="outline" onClick={() => { setDraft(null); setError(null); }}><X className="mr-2 h-4 w-4" />Cancel</Button>
          <Button type="submit" form="edit-daily-plan"><Save className="mr-2 h-4 w-4" />Save changes</Button>
        </> : <>
        {plan ? <Button variant="outline" onClick={edit} disabled={loading}><Pencil className="mr-2 h-4 w-4" />Edit plan</Button> : null}
        <Button onClick={generate} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {plan ? "Rebuild plan" : "Build today's plan"}
        </Button>
        </>}
        </div>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {saved ? <p role="status" className="mb-4 text-sm text-muted-foreground">Plan changes saved.</p> : null}
      <form id="edit-daily-plan" onSubmit={save} className="grid min-w-0 gap-4 lg:grid-cols-3">
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
            ) : draft ? (
              <ol className="space-y-4">
                {draft.blocks.map((block, i) => (
                  <li key={i} className="min-w-0 space-y-3 border-b pb-4 last:border-0">
                    <p className="text-xs font-semibold text-muted-foreground">Block {i + 1}</p>
                    <div className="grid min-w-0 grid-cols-2 gap-3">
                      <label className="min-w-0 space-y-1 text-xs font-medium">Start
                        <Input className="min-w-0" type="time" required aria-label={`Block ${i + 1} start`} value={block.start} onChange={(e) => updateBlock(i, "start", e.target.value)} />
                      </label>
                      <label className="min-w-0 space-y-1 text-xs font-medium">End
                        <Input className="min-w-0" type="time" required aria-label={`Block ${i + 1} end`} value={block.end} onChange={(e) => updateBlock(i, "end", e.target.value)} />
                      </label>
                    </div>
                    <label className="block space-y-1 text-xs font-medium">Title
                      <Input required aria-label={`Block ${i + 1} title`} value={block.title} onChange={(e) => updateBlock(i, "title", e.target.value)} />
                    </label>
                    <label className="block space-y-1 text-xs font-medium">Note
                      <Textarea aria-label={`Block ${i + 1} note`} value={block.why} onChange={(e) => updateBlock(i, "why", e.target.value)} />
                    </label>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="space-y-2">
                {plan.blocks.map((b, i) => (
                  <li
                    key={`${b.start}-${i}`}
                    className="grid grid-cols-[minmax(0,1fr)] gap-2 rounded-lg border p-3 transition-colors hover:bg-secondary/40 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-3"
                  >
                    <div className="w-24 shrink-0 font-heading text-sm font-semibold tabular-nums">
                      {b.start}–{b.end}
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium leading-tight">{b.title}</p>
                      {b.why ? (
                        <p className="mt-0.5 break-words text-xs text-muted-foreground">{b.why}</p>
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
              {draft ? <Textarea aria-label="Plan strategy" value={draft.note} onChange={(e) => setDraft((current) => current ? { ...current, note: e.target.value } : null)} /> : (plan?.note ?? "Virgo explains the logic behind the plan here once it's generated.")}
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
      </form>
    </AppShell>
  );
}