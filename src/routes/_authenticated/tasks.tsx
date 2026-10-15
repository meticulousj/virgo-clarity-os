import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import {
  priorityBand,
  priorityScore,
  setState,
  sortedTasks,
  today,
  uid,
  useVirgo,
} from "@/lib/store";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  head: () => ({
    meta: [
      { title: "Tasks & Priority Scoring — Virgo OS" },
      {
        name: "description",
        content:
          "Every task scored on impact, urgency, effort and deadline so the right work rises to the top.",
      },
      { property: "og:title", content: "Tasks & Priority Scoring — Virgo OS" },
      {
        property: "og:description",
        content: "Impact, urgency, effort and deadline combined into one priority score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function TasksPage() {
  const state = useVirgo();
  const [title, setTitle] = React.useState("");
  const [project, setProject] = React.useState("Work");
  const [due, setDue] = React.useState("");
  const [impact, setImpact] = React.useState(3);
  const [urgency, setUrgency] = React.useState(3);
  const [effort, setEffort] = React.useState(2);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setState((s) => ({
      ...s,
      tasks: [
        {
          id: uid(),
          title: title.trim(),
          project: project.trim() || "Inbox",
          impact,
          urgency,
          effort,
          due: due || undefined,
          done: false,
          createdAt: today(),
        },
        ...s.tasks,
      ],
    }));
    setTitle("");
    setDue("");
  };

  const toggle = (id: string) =>
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));

  const remove = (id: string) =>
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));

  const list = sortedTasks(state.tasks);
  const open = list.filter((t) => !t.done);

  return (
    <AppShell
      title="Tasks"
      subtitle={`${open.length} open · scored on impact, urgency, effort and deadline`}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Priority queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {list.map((task) => {
                const score = priorityScore(task);
                const band = priorityBand(score);
                return (
                  <li
                    key={task.id}
                    className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/40"
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.done}
                      onCheckedChange={() => toggle(task.id)}
                      aria-label={task.title}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={cn(
                          "block text-sm font-medium leading-tight",
                          task.done && "text-muted-foreground line-through",
                        )}
                      >
                        {task.title}
                      </label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {task.project}
                        {task.due ? ` · due ${task.due}` : ""} · I{task.impact} U{task.urgency} E
                        {task.effort}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("tabular-nums", band.tone)}>{score}</Badge>
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {band.label}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${task.title}`}
                        onClick={() => remove(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Add task</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={add}>
              <div className="space-y-1.5">
                <Label htmlFor="title">Task</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs doing?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="project">Project</Label>
                  <Input
                    id="project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="due">Due</Label>
                  <Input
                    id="due"
                    type="date"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                  />
                </div>
              </div>
              <ScoreSlider label="Impact" value={impact} onChange={setImpact} />
              <ScoreSlider label="Urgency" value={urgency} onChange={setUrgency} />
              <ScoreSlider label="Effort" value={effort} onChange={setEffort} />
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add to queue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function ScoreSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <Label>{label}</Label>
        <span className="tabular-nums text-muted-foreground">{value}/5</span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={5}
        step={1}
        onValueChange={(v) => onChange(v[0] ?? 1)}
        aria-label={label}
      />
    </div>
  );
}