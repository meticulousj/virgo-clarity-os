"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const initialTasks = [
  { id: "1", label: "Review design system tokens", done: true, tag: "Design" },
  { id: "2", label: "Build dashboard widgets", done: false, tag: "Engineering" },
  { id: "3", label: "Write release notes", done: false, tag: "Product" },
  { id: "4", label: "Schedule user interviews", done: false, tag: "Research" },
];

export function TaskList() {
  const [tasks, setTasks] = React.useState(initialTasks);

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg">Tasks</CardTitle>
          <Badge variant="secondary">
            {tasks.filter((t) => t.done).length}/{tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start gap-3 rounded-lg p-2 hover:bg-secondary/50"
            >
              <Checkbox
                id={`task-${task.id}`}
                checked={task.done}
                onCheckedChange={() => toggle(task.id)}
                aria-label={task.label}
              />
              <div className="flex-1">
                <label
                  htmlFor={`task-${task.id}`}
                  className={cn(
                    "block text-sm font-medium leading-tight",
                    task.done && "text-muted-foreground line-through",
                  )}
                >
                  {task.label}
                </label>
                <span className="text-xs text-muted-foreground">{task.tag}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
