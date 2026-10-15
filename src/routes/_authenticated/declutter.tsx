import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { setState, useVirgo } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/declutter")({
  component: DeclutterPage,
  head: () => ({
    meta: [
      { title: "Digital Decluttering — Virgo OS" },
      {
        name: "description",
        content: "Clear inbox backlog, dead subscriptions, noisy notifications and stale files.",
      },
      { property: "og:title", content: "Digital Decluttering — Virgo OS" },
      {
        property: "og:description",
        content: "Clear the digital noise: inbox, subscriptions, notifications and files.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function DeclutterPage() {
  const state = useVirgo();
  const done = state.declutter.filter((d) => d.done).length;
  const pct = state.declutter.length ? (done / state.declutter.length) * 100 : 0;

  const toggle = (id: string) =>
    setState((s) => ({
      ...s,
      declutter: s.declutter.map((d) => (d.id === id ? { ...d, done: !d.done } : d)),
    }));

  return (
    <AppShell title="Digital Declutter" subtitle="Less noise, more signal.">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-lg">
            Cleanup queue · {done}/{state.declutter.length}
          </CardTitle>
          <Progress value={pct} className="mt-2 h-1.5" />
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {state.declutter.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Checkbox
                  id={`dc-${item.id}`}
                  checked={item.done}
                  onCheckedChange={() => toggle(item.id)}
                  aria-label={item.label}
                />
                <label
                  htmlFor={`dc-${item.id}`}
                  className={cn(
                    "min-w-0 flex-1 text-sm font-medium",
                    item.done && "text-muted-foreground line-through",
                  )}
                >
                  {item.label}
                </label>
                <Badge variant="secondary">{item.area}</Badge>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {item.count} items
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AppShell>
  );
}