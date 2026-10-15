import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { setState, today, uid, useVirgo } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/journal")({
  component: JournalPage,
  head: () => ({
    meta: [
      { title: "Personal Journal — Virgo OS" },
      {
        name: "description",
        content: "A daily journal with mood tracking that feeds your weekly reviews and insights.",
      },
      { property: "og:title", content: "Personal Journal — Virgo OS" },
      {
        property: "og:description",
        content: "Daily entries and mood, feeding your reviews and insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function JournalPage() {
  const state = useVirgo();
  const [text, setText] = React.useState("");
  const [mood, setMood] = React.useState(4);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setState((s) => ({
      ...s,
      journal: [{ id: uid(), date: today(), mood, text: text.trim() }, ...s.journal],
    }));
    setText("");
  };

  return (
    <AppShell title="Journal" subtitle="Write it down, then let it go.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Today's entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={save}>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="What happened, what drained you, what you'd repeat…"
                aria-label="Journal entry"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mood</span>
                {[1, 2, 3, 4, 5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    aria-label={`Mood ${m}`}
                    aria-pressed={mood === m}
                    className={cn(
                      "h-8 w-8 rounded-md border text-sm font-medium transition-colors",
                      mood === m
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-accent",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <Button type="submit">Save entry</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Recent entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.journal.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing written yet.</p>
            ) : (
              state.journal.map((entry) => (
                <div key={entry.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                    <Badge variant="secondary">Mood {entry.mood}/5</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{entry.text}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}