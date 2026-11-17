import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Brain, Sparkles, Loader2, Plus, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { generateBrainPriorities } from "@/lib/brain-dump.functions";
import { prioritiesToTasks } from "@/lib/brain-dump";
import { setState, today, uid, useVirgo } from "@/lib/store";

export function BrainDump() {
  const state = useVirgo();
  const saved = state.brainDump;
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const generate = useServerFn(generateBrainPriorities);
  React.useEffect(() => { if (saved) setText(saved.text); }, [saved?.text]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await generate({ data: { text } });
      if (!result.priorities) { setError(result.error ?? "Couldn't create priorities."); return; }
      setState((s) => ({ ...s, brainDump: { text, priorities: result.priorities, taskIds: [] } }));
    } catch { setError("Couldn't connect. Your thoughts are still here — try again."); }
    finally { setBusy(false); }
  }

  function saveTasks() {
    if (!saved || saved.taskIds.length) return;
    if (saved.priorities.some((p) => !p.title.trim())) { setError("Give each priority a title before saving."); return; }
    setState((s) => {
      if (!s.brainDump || s.brainDump.taskIds.length) return s;
      const result = prioritiesToTasks(s.brainDump.priorities, s.tasks, today(), uid);
      return { ...s, tasks: result.tasks, brainDump: { ...s.brainDump, taskIds: result.taskIds } };
    });
    setError("");
  }

  return (
    <section aria-labelledby="brain-dump-heading" className="border-b border-gold/35 pb-6">
      <div className="flex items-center gap-2 text-gold"><Brain className="h-5 w-5" /><p className="eyebrow">Clear your head</p></div>
      <h2 id="brain-dump-heading" className="mt-3 font-heading text-2xl font-semibold">Brain dump → top three priorities</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <Textarea aria-label="Brain dump" placeholder="What’s on your mind? The proposal due tomorrow, bills, ideas, things you keep putting off…" value={text} onChange={(e) => setText(e.target.value)} maxLength={12000} rows={4} disabled={busy} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs tabular-nums text-muted-foreground">{text.length.toLocaleString()} / 12,000</span>
          <Button type="submit" disabled={!text.trim() || busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{busy ? "Finding your priorities…" : saved ? "Rethink my top three" : "Find my top three"}</Button>
        </div>
      </form>
      {error && <p role="alert" className="mt-3 break-words text-sm text-destructive">{error}</p>}
      <div aria-live="polite" aria-busy={busy}>
        {saved && <div className="mt-6">
          <h3 className="font-heading text-lg font-semibold">Your top three</h3>
          <ol className="mt-3 divide-y divide-border">
            {saved.priorities.map((p, i) => {
              const taskId = saved.taskIds[i];
              const task = state.tasks.find((t) => t.id === taskId);
              return <li key={i} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-4">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-ink font-heading text-sm text-gold">{i + 1}</span>
                <div className="min-w-0">
                  {saved.taskIds.length ? <div className="flex items-start gap-2"><Checkbox aria-label={`Complete priority ${i + 1}: ${p.title}`} checked={task?.done ?? false} disabled={!task} className="mt-1" onCheckedChange={() => setState((s) => ({ ...s, tasks: s.tasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t) }))} /><p className={`break-words text-sm font-semibold ${task?.done ? "text-muted-foreground line-through" : ""}`}>{p.title}</p></div> : <Input aria-label={`Priority ${i + 1} title`} maxLength={180} value={p.title} disabled={busy} onChange={(e) => setState((s) => s.brainDump ? { ...s, brainDump: { ...s.brainDump, priorities: s.brainDump.priorities.map((item, index) => index === i ? { ...item, title: e.target.value } : item) } } : s)} />}
                  <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{p.why}</p>
                  <p className="mt-1 break-words text-sm leading-6"><span className="font-semibold">First step: </span>{p.firstStep}</p>
                </div>
              </li>;
            })}
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button onClick={saveTasks} disabled={busy || saved.taskIds.length > 0}>{saved.taskIds.length ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saved.taskIds.length ? "Saved to tasks" : "Add three to tasks"}</Button>
            {saved.taskIds.length > 0 && <Button asChild variant="link" size="sm"><Link to="/planner">Plan my day <ArrowRight className="h-4 w-4" /></Link></Button>}
          </div>
        </div>}
      </div>
    </section>
  );
}