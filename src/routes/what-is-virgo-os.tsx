import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ListChecks, Sparkles, Compass, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/virgo/brand-mark";
import workspacePhoto from "@/assets/focus-workspace.jpg";

const description = "Virgo OS is an all-in-one personal operating system for clarity and execution, combining AI daily planning, tasks, habits, goals, budget and reflection.";

export const Route = createFileRoute("/what-is-virgo-os")({
  head: () => ({
    meta: [
      { title: "What is Virgo OS? — Your personal operating system" },
      { name: "description", content: description },
      { property: "og:title", content: "What is Virgo OS? — Clarity & execution" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://virgo-os.lovable.app/what-is-virgo-os" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://virgo-os.lovable.app/what-is-virgo-os" }],
  }),
  component: AboutVirgo,
});

const pillars = [
  { icon: ListChecks, label: "Clarity", title: "Know what matters.", body: "Bring tasks, habits and goals together. Rank priorities by impact, urgency and effort, and connect daily progress to the bigger picture." },
  { icon: Sparkles, label: "Execution", title: "Make room for it.", body: "Turn your priorities into an AI-generated, time-blocked daily plan. Edit the plan to fit your day, then settle into a focused work session." },
  { icon: Compass, label: "Reflection", title: "See the whole week.", body: "Keep a journal, review your week and track spending, sleep, energy and focus. Notice patterns beyond your to-do list." },
];

function AboutVirgo() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <Link to="/" aria-label="Virgo OS home"><BrandMark size="sm" /></Link>
          <Button asChild size="sm"><Link to="/auth" search={{ redirect: "/dashboard" }}>Open app <ArrowRight /></Link></Button>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-gold/40 bg-ink text-ink-foreground">
          <img src={workspacePhoto} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-ink/90" />
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
            <p className="eyebrow text-gold">Clarity & execution</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-6xl">What is <span className="text-gold">Virgo OS?</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-ink-foreground sm:text-lg">Virgo OS is an all-in-one personal operating system: one workspace for planning your day, deciding what matters and following through.</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted">It brings AI planning, tasks, habits, goals, budget, calendar and reflection together—so your day is more than a scattered to-do list.</p>
            <Button asChild size="lg" className="mt-8"><Link to="/auth" search={{ redirect: "/dashboard" }}>Open Virgo OS <ArrowRight /></Link></Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="purpose-heading">
          <p className="eyebrow text-muted-foreground">A little more intention</p>
          <h2 id="purpose-heading" className="mt-3 max-w-2xl font-heading text-2xl font-semibold sm:text-3xl">A clearer picture. A day you can act on.</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {pillars.map(({ icon: Icon, label, title, body }) => (
              <article key={label} className="border-t border-gold/60 pt-5">
                <div className="flex items-center gap-3 text-sm font-semibold"><Icon className="h-5 w-5 text-gold" />{label}</div>
                <h3 className="mt-5 font-heading text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="font-heading text-2xl font-semibold">Who is it for?</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">People balancing work and life who want fewer scattered lists and a more intentional routine. Virgo OS connects the things you need to do with the things you want to build.</p>
            </div>
            <div>
              <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold"><LockKeyhole className="h-5 w-5 shrink-0 text-gold" />Your workspace, your device.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">Sign in with an email magic link—no password needed. Your profile belongs to your account; your plans, tasks and other workspace data stay in this browser on this device, rather than syncing between devices.</p>
            </div>
          </div>
        </section>

        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center">
            <div><h2 className="font-heading text-2xl font-semibold">Start with what matters today.</h2><p className="mt-3 text-sm text-ink-muted">Your Virgo OS workspace starts with a secure email link.</p></div>
            <Button asChild size="lg"><Link to="/auth" search={{ redirect: "/dashboard" }}>Open Virgo OS <ArrowRight /></Link></Button>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-muted-foreground sm:px-8">
        <span>© 2026 Virgo OS · Clarity & execution.</span>
        <Button asChild variant="link" size="sm"><Link to="/">Back to home <ArrowRight /></Link></Button>
      </footer>
    </div>
  );
}