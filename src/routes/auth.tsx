import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Lock, MailCheck } from "lucide-react";

const WORDMARK_URL = "/virgo-wordmark.png";

function sanitizeRedirect(value: unknown): string {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    search["redirect"] == null ? {} : { redirect: sanitizeRedirect(search["redirect"]) },
  head: () => ({
    meta: [
      { title: "Sign in — Virgo OS" },
      { name: "description", content: "Sign in to Virgo OS with a magic link — no password needed." },
      { property: "og:title", content: "Sign in — Virgo OS" },
      { property: "og:description", content: "Sign in to Virgo OS with a magic link — no password needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect: rawRedirect } = Route.useSearch();
  const redirectTo = rawRedirect ?? "/dashboard";
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: redirectTo, replace: true });
    });
  }, [navigate, redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}${redirectTo}`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      <aside className="ink-stage relative isolate hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="ink-grid pointer-events-none absolute inset-0 -z-10" />
        <Link to="/">
          <img src={WORDMARK_URL} alt="Virgo OS" className="h-8 w-auto brightness-0 invert" />
        </Link>
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase text-gold">Your daily brief</p>
          <p className="mt-4 font-heading text-4xl font-semibold leading-tight">
            Fewer decisions.
            <br />
            <span className="gold-text">Better days.</span>
          </p>
          <ul className="mt-10 space-y-4 text-sm text-ink-muted">
            {[
              "An AI plan built around your energy",
              "Priorities ranked by impact, urgency and effort",
              "Habits, goals, budget and health in one place",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <Check className="h-4 w-4 shrink-0 text-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-ink-muted">Private by default · Passwordless sign-in</p>
      </aside>

      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="virgo-rise w-full max-w-sm">
          <Link to="/" className="mb-10 inline-block lg:hidden">
            <img src={WORDMARK_URL} alt="Virgo OS" className="h-9 w-auto dark:brightness-0 dark:invert" />
          </Link>

          {status === "sent" ? (
            <div className="flex flex-col items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-gold/10">
                <MailCheck className="h-6 w-6 text-gold" />
              </div>
              <h1 className="font-heading text-3xl font-semibold">Check your inbox</h1>
              <p className="text-sm leading-6 text-muted-foreground">
                We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>.
                Open it on this device to enter your workspace.
              </p>
              <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-semibold">Welcome to Virgo OS</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we'll send you a secure sign-in link.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    className="h-11"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {status === "error" ? <p className="text-sm text-destructive">{errorMsg}</p> : null}
                <Button type="submit" className="h-11 w-full" disabled={status === "sending"}>
                  {status === "sending" ? "Sending link…" : "Email me a sign-in link"}
                  {status === "sending" ? null : <ArrowRight className="ml-1 h-4 w-4" />}
                </Button>
              </form>
              <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
                <Lock className="h-4 w-4 shrink-0 text-gold" />
                No password to remember. New here? Your account is created the first time you sign in.
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
