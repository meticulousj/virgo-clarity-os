"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

export function DailySummary() {
  return (
    <Card className="border bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg">Daily Focus</CardTitle>
          <Badge variant="secondary">3 goals</Badge>
        </div>
        <CardDescription>Ship the prototype, review roadmap, exercise.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Goal progress</span>
              <span className="text-muted-foreground">67%</span>
            </div>
            <Progress value={67} />
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
            <Target className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Priority today</p>
              <p className="text-sm text-muted-foreground">
                Finish Virgo OS dashboard polish and run a design review.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
