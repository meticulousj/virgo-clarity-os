import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { daysAgo, setState, today, uid, useVirgo } from "@/lib/store";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: "Calendar — Virgo OS" },
      {
        name: "description",
        content: "A built-in week calendar that feeds your AI daily plan with fixed commitments.",
      },
      { property: "og:title", content: "Calendar — Virgo OS" },
      {
        property: "og:description",
        content: "Your week of fixed commitments, feeding straight into the AI planner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function CalendarPage() {
  const state = useVirgo();
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState(today());
  const [start, setStart] = React.useState("09:00");
  const [end, setEnd] = React.useState("10:00");

  const week = Array.from({ length: 7 }, (_, i) => daysAgo(-i));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setState((s) => ({
      ...s,
      events: [
        ...s.events,
        { id: uid(), date, start, end, title: title.trim(), kind: "focus" as const },
      ],
    }));
    setTitle("");
  };

  const remove = (id: string) =>
    setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));

  return (
    <AppShell title="Calendar" subtitle="The next seven days, at a glance.">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {week.map((d) => {
            const events = state.events
              .filter((e) => e.date === d)
              .sort((a, b) => a.start.localeCompare(b.start));
            return (
              <Card key={d}>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-base">
                    {new Date(d).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                    {d === today() ? <Badge className="ml-2">Today</Badge> : null}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Open day.</p>
                  ) : (
                    <ul className="space-y-2">
                      {events.map((e) => (
                        <li
                          key={e.id}
                          className="flex items-center gap-3 rounded-lg border p-2 text-sm"
                        >
                          <span className="w-24 shrink-0 tabular-nums text-muted-foreground">
                            {e.start}–{e.end}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium">{e.title}</span>
                          <Badge variant="secondary" className="capitalize">
                            {e.kind}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${e.title}`}
                            onClick={() => remove(e.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">New event</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={add}>
              <div className="space-y-1.5">
                <Label htmlFor="ev-title">Title</Label>
                <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-date">Date</Label>
                <Input
                  id="ev-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ev-start">Start</Label>
                  <Input
                    id="ev-start"
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ev-end">End</Label>
                  <Input
                    id="ev-end"
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add event
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}