import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck, Sparkles } from "lucide-react";
import workspaceImage from "@/assets/focus-workspace.jpg";

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
    <div className="relative isolate flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <img src={workspaceImage} alt="" width={1536} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-background/80" />
      <main className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <img src={WORDMARK_URL} alt="Virgo OS" className="h-10 w-auto dark:brightness-0 dark:invert" />
            {status !== "sent" ? <h1 className="mt-10 font-heading text-3xl font-semibold">Welcome back.</h1> : null}
            <p className="mt-4 text-sm text-muted-foreground">
              Your personal operating system for clarity and execution.
            </p>
          </div>

          {status === "sent" ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/15">
                <MailCheck className="h-6 w-6 text-gold" />
              </div>
              <h1 className="font-heading text-xl font-semibold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>.
                Click it to enter your workspace — no password needed.
              </p>
              <Button variant="ghost" size="sm" onClick={() => setStatus("idle")}>
                Use a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {status === "error" ? (
                <p className="text-sm text-destructive">{errorMsg}</p>
              ) : null}
              <Button type="submit" className="w-full" disabled={status === "sending"}>
                <Sparkles className="mr-2 h-4 w-4" />
                {status === "sending" ? "Sending link…" : "Email me a sign-in link"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Passwordless sign-in. We'll email you a secure one-time link.
              </p>
            </form>
          )}
      </main>
    </div>
  );
}
