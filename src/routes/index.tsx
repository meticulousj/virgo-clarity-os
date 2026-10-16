import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, CheckCircle2, Sparkles, Target, Wallet, Repeat } from "lucide-react";
import workspaceImage from "@/assets/focus-workspace.jpg";

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
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <img src={WORDMARK_URL} alt="Virgo OS" className="h-9 w-auto dark:brightness-0 dark:invert" />
        <Button asChild variant="outline" size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      <main>
        <section className="relative isolate flex min-h-[440px] items-center overflow-hidden border-y border-border sm:min-h-[500px]">
          <img src={workspaceImage} alt="A notebook and laptop in a calm, sunlit workspace" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="photo-scrim absolute inset-0 -z-10" />
          <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="mb-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Personal operating system
          </p>
          <h1 className="font-heading text-5xl font-semibold leading-tight sm:text-7xl">Virgo OS</h1>
          <p className="mt-4 font-heading text-xl font-medium sm:text-2xl">A clear mind. A focused day.</p>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            Virgo OS brings your tasks, habits, goals, budget, and reflections together —
            with an AI planner that turns it all into a focused day.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg">
              <Link to="/auth">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3"><h2 className="font-heading text-xl font-semibold">Everything, in perspective.</h2><span className="text-xs text-muted-foreground">Plan · Execute · Reflect</span></div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border-t border-border pt-5"
            >
              <div className="mb-4">
                <f.icon className="h-5 w-5 text-foreground" />
              </div>
              <h2 className="font-heading text-base font-semibold">{f.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
          </div>
        </section>
        <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-border px-5 py-6 text-xs text-muted-foreground sm:px-8"><span>Virgo OS</span><span>Clarity & execution.</span></footer>
      </main>
    </div>
  );
}
