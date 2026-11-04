"use client";

import * as React from "react";
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
    <section className="ink-stage elevated relative isolate overflow-hidden rounded-lg" aria-label="Focus session">
      <div className="ink-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="p-6 pb-2">
         <h2 className="flex flex-wrap items-center justify-between gap-2 font-heading text-base font-semibold"><span>Focus session</span><span className="text-[10px] font-semibold uppercase text-gold">Deep work</span></h2>
      </div>
      <div className="space-y-4 p-6 pt-0">
        <div className="text-center">
           <div className="font-heading text-5xl font-medium tabular-nums">
            {formatTime(seconds)}
          </div>
           <p className="mt-2 text-xs text-ink-muted">25 minute focus block</p>
        </div>
         <div className="h-1 overflow-hidden rounded-full bg-ink-foreground/10">
          <div
             className="h-full bg-gold transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-center gap-2">
          <Button
             variant="secondary"
            className="bg-ink-foreground/10 text-ink-foreground hover:bg-gold hover:text-gold-foreground"
            size="icon"
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause" : "Start"}
            title={running ? "Pause" : "Start"}
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
           <Button variant="secondary" className="bg-ink-foreground/10 text-ink-foreground hover:bg-gold hover:text-gold-foreground" size="icon" onClick={reset} aria-label="Reset" title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
