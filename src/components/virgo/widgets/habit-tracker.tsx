"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const habits = ["Read", "Exercise", "Meditate", "Deep work"];

const initial = habits.map((name) => ({
  name,
  days: [true, true, false, true, false, false, false],
}));

export function HabitTracker() {
  const [state, setState] = React.useState(initial);

  const toggle = (habitIdx: number, dayIdx: number) => {
    setState((prev) =>
      prev.map((h, i) =>
        i === habitIdx ? { ...h, days: h.days.map((d, j) => (j === dayIdx ? !d : d)) } : h,
      ),
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg">Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {state.map((habit, hi) => (
            <div key={habit.name} className="flex items-center justify-between">
              <span className="text-sm font-medium">{habit.name}</span>
              <div className="flex gap-1">
                {habit.days.map((done, di) => (
                  <button
                    key={di}
                    type="button"
                    onClick={() => toggle(hi, di)}
                    className={cn(
                      "h-6 w-6 rounded-md text-xs font-medium transition-colors",
                      done
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    aria-label={`${habit.name} day ${di + 1}`}
                  >
                    {di + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
