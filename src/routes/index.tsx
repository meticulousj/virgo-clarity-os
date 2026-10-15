import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, CheckCircle2, Sparkles, Target, Wallet, Repeat } from "lucide-react";

const WORDMARK_URL = "/virgo-wordmark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Virgo OS — Clarity & Execution" },
      { name: "description", content: "Your all-in-one personal operating system for clarity and execution." },
      { property: "og:title", content: "Virgo OS — Clarity & Execution" },
      { property: "og:description", content: "Your all-in-one personal operating system for clarity and execution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Sparkles, title: "AI daily planner", body: "A time-blocked plan built from your tasks, habits, and energy." },
  { icon: CheckCircle2, title: "Priority scoring", body: "Impact, urgency, and effort combine into one clear ranking." },
  { icon: Repeat, title: "Habits & goals", body: "Streaks, weekly grids, and progress bars that keep you honest." },
  { icon: Wallet, title: "Budget tracking", body: "Know where the money goes, month by month." },
  { icon: CalendarDays, title: "Calendar & reviews", body: "Plan the week, then review it every Sunday." },
  { icon: Target, title: "Insights", body: "Sleep, focus, and productivity signals with AI recommendations." },
];

function Landing() {
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <img src={WORDMARK_URL} alt="Virgo OS" className="h-8 w-auto" />
        <Button asChild variant="outline" size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <section className="relative py-20 text-center sm:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
          />
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Personal operating system
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-6xl">
            Clarity and execution,
            <br />
            in one calm place.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Virgo OS brings your tasks, habits, goals, budget, and reflections together —
            with an AI planner that turns it all into a focused day.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-gold/12">
                <f.icon className="h-4.5 w-4.5 text-gold" />
              </div>
              <h2 className="font-heading text-base font-semibold">{f.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
