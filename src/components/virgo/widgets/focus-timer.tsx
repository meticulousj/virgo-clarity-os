"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

const FOCUS_SECONDS = 25 * 60;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function FocusTimer() {
  const [seconds, setSeconds] = React.useState(FOCUS_SECONDS);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setSeconds(FOCUS_SECONDS);
  };

  const progress = ((FOCUS_SECONDS - seconds) / FOCUS_SECONDS) * 100;

  return (
    <Card className="overflow-hidden border-primary/10 bg-primary text-primary-foreground">
      <CardHeader className="pb-2">
         <CardTitle className="flex items-center justify-between font-heading text-lg"><span>Focus session</span><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">Deep work</span></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
           <div className="font-heading text-5xl font-medium tabular-nums">
            {formatTime(seconds)}
          </div>
           <p className="mt-1 text-xs text-primary-foreground/50">25 minute focus block</p>
        </div>
         <div className="h-1 overflow-hidden rounded-full bg-primary-foreground/10">
          <div
             className="h-full bg-gold transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-center gap-2">
          <Button
             variant="secondary"
            size="icon"
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause" : "Start"}
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
           <Button variant="secondary" size="icon" onClick={reset} aria-label="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
