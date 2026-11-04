import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  Target,
  Wallet,
  Repeat,
  Activity,
  Lock,
  Smartphone,
  MailCheck,
} from "lucide-react";

import { BrandMark } from "@/components/virgo/brand-mark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Virgo OS — The personal operating system for clarity & execution" },
      {
        name: "description",
        content:
          "Plan your day with AI, rank what matters, and track habits, goals, budget and wellbeing in one calm workspace.",
      },
      { property: "og:title", content: "Virgo OS — Clarity & Execution" },
      {
        property: "og:description",
        content: "One calm workspace for your day: AI planning, priorities, habits, goals, budget and reflection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Sparkles, title: "AI daily planner", body: "A time-blocked plan built from your tasks, habits and energy — in seconds." },
  { icon: CheckCircle2, title: "Priority scoring", body: "Impact, urgency and effort combine into one ranking you can trust." },
  { icon: Repeat, title: "Habits & streaks", body: "Weekly grids and streaks that make consistency visible." },
  { icon: Target, title: "Goals", body: "Milestones and progress that tie daily work to the bigger picture." },
  { icon: Wallet, title: "Budget", body: "Income and spending by category, month by month, at a glance." },
  { icon: CalendarDays, title: "Calendar & reviews", body: "Plan the week, then close it with a guided Sunday review." },
  { icon: Activity, title: "Health insights", body: "Sleep, energy and focus logged daily, with AI routine advice." },
  { icon: MailCheck, title: "Passwordless", body: "Sign in with a secure email link. Nothing to remember." },
];

const PRIORITIES = [
  { title: "Finalize Q4 strategy deck", score: 92, tag: "Critical" },
  { title: "Review budget for November", score: 78, tag: "High" },
  { title: "Call with Morgan re: launch", score: 64, tag: "Medium" },
];

const FLOW = [
  { time: "08:00", label: "Deep work · Strategy deck", accent: true },
  { time: "10:30", label: "Team sync" },
  { time: "13:00", label: "Walk + lunch" },
  { time: "15:00", label: "Inbox & admin" },
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
      {/* HERO */}
      <section className="ink-stage relative isolate overflow-hidden">
        <div className="ink-grid pointer-events-none absolute inset-0 -z-10" />
        <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" aria-label="Virgo OS home">
            <BrandMark />
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink-foreground sm:inline-flex"
            >
              Sign in
            </Link>
            <Button asChild size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/auth">Get started</Link>
            </Button>
          </nav>
        </header>

        <div className="mx-auto max-w-6xl px-5 pb-0 pt-14 text-center sm:px-8 sm:pt-20">
          <p className="virgo-rise mx-auto inline-flex items-center gap-2 rounded-full border border-ink-foreground/15 bg-ink-foreground/5 px-3 py-1 text-xs font-medium text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            The personal operating system
          </p>
          <h1 className="virgo-rise mx-auto mt-7 max-w-4xl font-heading text-5xl font-semibold leading-[1.05] sm:text-7xl">
            A clear mind.
            <br />
            <span className="gold-text">A focused day.</span>
          </h1>
          <p className="virgo-rise mx-auto mt-6 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
            Virgo OS brings your tasks, habits, goals, budget and reflections into one calm
            workspace — and an AI planner turns it all into the day you meant to have.
          </p>
          <div className="virgo-rise mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 bg-gold px-6 text-gold-foreground hover:bg-gold/90">
              <Link to="/auth">
                Start for free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 px-6 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
            >
              <a href="#features">See what's inside</a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-ink-muted">No password. No credit card. Sign in with your email.</p>

          {/* Product preview */}
          <div className="virgo-rise relative mx-auto mt-16 max-w-5xl">
            <div className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-full bg-gold/15 blur-3xl" />
            <div className="elevated overflow-hidden rounded-t-xl border border-b-0 border-ink-foreground/15 bg-background text-left text-foreground">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="ml-3 text-xs text-muted-foreground">Virgo OS · Dashboard</span>
              </div>
              <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[1.4fr_1fr]">
                <div className="rounded-lg bg-ink p-5 text-ink-foreground">
                  <p className="text-xs font-medium uppercase text-gold">Daily brief</p>
                  <p className="mt-2 font-heading text-xl font-semibold">Good morning. Three things matter today.</p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      ["6", "tasks"],
                      ["4/5", "habits"],
                      ["7.5h", "sleep"],
                    ].map(([v, l]) => (
                      <div key={l} className="rounded-md border border-ink-foreground/10 bg-ink-foreground/5 p-3">
                        <p className="font-heading text-lg font-semibold">{v}</p>
                        <p className="text-xs text-ink-muted">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="premium-panel rounded-lg p-5">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Today's flow</p>
                  <ul className="mt-3 space-y-2.5">
                    {FLOW.map((f) => (
                      <li key={f.time} className="flex items-center gap-3 text-sm">
                        <span className="w-11 shrink-0 tabular-nums text-muted-foreground">{f.time}</span>
                        <span className={f.accent ? "h-5 w-1 rounded-full bg-gold" : "h-5 w-1 rounded-full bg-border"} />
                        <span className="truncate">{f.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="premium-panel rounded-lg p-5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Top priorities</p>
                    <p className="text-xs text-muted-foreground">Ranked by impact, urgency & effort</p>
                  </div>
                  <ul className="mt-3 divide-y divide-border">
                    {PRIORITIES.map((p) => (
                      <li key={p.title} className="flex items-center gap-4 py-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary font-heading text-sm font-semibold tabular-nums">
                          {p.score}
                        </span>
                        <span className="flex-1 truncate text-sm font-medium">{p.title}</span>
                        <span
                          className={
                            p.tag === "Critical"
                              ? "rounded-full bg-gold px-2.5 py-0.5 text-xs font-medium text-gold-foreground"
                              : "rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
                          }
                        >
                          {p.tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 text-sm sm:px-8 md:grid-cols-4">
          {[
            [Sparkles, "AI planning built in"],
            [Lock, "Private by default"],
            [Smartphone, "Installs like an app"],
            [MailCheck, "Passwordless sign-in"],
          ].map(([Icon, label]) => {
            const I = Icon as React.ElementType;
            return (
              <div key={label as string} className="flex items-center gap-3 text-muted-foreground">
                <I className="h-4 w-4 text-gold" />
                <span>{label as string}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-gold">Plan · Execute · Reflect</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Everything in your life, in perspective.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Eleven focused modules that share one picture of you — so your plan knows your
            energy, and your review knows your week.
          </p>
        </div>
        <div className="mt-14 grid overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "1px" }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="group bg-card p-6 transition-colors hover:bg-background">
              <div className="grid h-10 w-10 place-items-center rounded-md border border-gold/30 bg-gold/10 transition-transform group-hover:-translate-y-0.5">
                <f.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-5 font-heading text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-3">
          {[
            ["01", "Capture", "Drop in tasks, habits, goals and spending. Score what matters in one tap."],
            ["02", "Plan", "Your AI planner builds a realistic, time-blocked day around your energy."],
            ["03", "Reflect", "Journal, log your health, and close the week with a guided review."],
          ].map(([n, t, b]) => (
            <div key={n}>
              <p className="font-heading text-sm font-semibold text-gold">{n}</p>
              <h3 className="mt-3 font-heading text-2xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="ink-stage relative isolate overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-16">
          <div className="ink-grid pointer-events-none absolute inset-0 -z-10" />
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
            Your clearest week starts <span className="gold-text">today.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-muted">
            Enter your email, click the link, and your workspace is ready.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 bg-gold px-7 text-gold-foreground hover:bg-gold/90">
            <Link to="/auth">
              Get started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="ink-stage">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 text-xs text-ink-muted sm:px-8">
          <BrandMark size="sm" />
          <span>© 2026 Virgo OS · Clarity & execution.</span>
        </div>
      </footer>
    </div>
  );
}
