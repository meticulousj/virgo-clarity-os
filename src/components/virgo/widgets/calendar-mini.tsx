"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

export function CalendarMini() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg">Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day) => {
            const active = isSameDay(day, today);
            return (
              <div key={day.toISOString()} className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 space-y-2">
          <div className="rounded-lg bg-secondary/50 p-2">
            <p className="text-xs font-medium">10:00 AM</p>
            <p className="text-sm">Design sync</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2">
            <p className="text-xs font-medium">2:00 PM</p>
            <p className="text-sm">Engineering standup</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
