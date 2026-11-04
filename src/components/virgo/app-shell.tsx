"use client";

import * as React from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsFor, useProfile } from "@/lib/profile";
const WORDMARK_URL = "/virgo-wordmark.png";
import {
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  Repeat,
  Target,
  Wallet,
  Trash2,
  CalendarDays,
  ClipboardCheck,
  BookOpen,
  Activity,
  Menu,
  LogOut,
} from "lucide-react";

type NavLink = { to: string; label: string; icon: React.ElementType };

const GROUPS: { title: string; items: NavLink[] }[] = [
  {
    title: "Today",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/planner", label: "AI Planner", icon: Sparkles },
      { to: "/calendar", label: "Calendar", icon: CalendarDays },
    ],
  },
  {
    title: "Execution",
    items: [
      { to: "/tasks", label: "Tasks", icon: CheckCircle2 },
      { to: "/habits", label: "Habits", icon: Repeat },
      { to: "/goals", label: "Goals", icon: Target },
    ],
  },
  {
    title: "Life",
    items: [
      { to: "/budget", label: "Budget", icon: Wallet },
      { to: "/journal", label: "Journal", icon: BookOpen },
      { to: "/review", label: "Weekly Review", icon: ClipboardCheck },
      { to: "/declutter", label: "Declutter", icon: Trash2 },
    ],
  },
  {
    title: "Signals",
    items: [{ to: "/insights", label: "Insights", icon: Activity }],
  },
];

function sectionFor(pathname: string) {
  for (const g of GROUPS) if (g.items.some((i) => i.to === pathname)) return g.title;
  if (pathname === "/profile") return "Account";
  return "Virgo OS";
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="sidebar-stage flex h-full flex-col">
      <div className="flex h-20 items-center px-6">
        <Link to="/dashboard" onClick={onNavigate} aria-label="Virgo OS home">
          <img src={WORDMARK_URL} alt="Virgo OS" className="h-8 w-auto brightness-0 invert" />
        </Link>
      </div>
      <div className="mx-6 h-px bg-gradient-to-r from-gold/40 via-sidebar-border to-transparent" />
      <nav className="flex-1 overflow-auto px-3 py-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="eyebrow px-3 text-sidebar-foreground/45">{group.title}</p>
            <div className="mt-2 space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    {active ? (
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold" aria-hidden />
                    ) : null}
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        active ? "text-gold" : "text-sidebar-foreground/45 group-hover:text-gold/80",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <UserFooter onNavigate={onNavigate} />
    </div>
  );
}

function UserFooter({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const navigate = useNavigate();
  const { profile } = useProfile();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const name = profile?.displayName || profile?.email?.split("@")[0] || "Account";
  const initials = initialsFor(name);

  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="flex items-center gap-2">
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-sidebar-accent"
          title="Edit profile"
        >
          <Avatar className="h-9 w-9 shrink-0 ring-1 ring-gold/40">
            {profile?.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={name} className="object-cover" /> : null}
            <AvatarFallback className="bg-gold/15 font-heading text-xs font-semibold text-gold">
              {initials || "·"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-sidebar-foreground/50">{profile?.email ?? "Personal workspace"}</p>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sign out"
          title="Sign out"
          onClick={handleSignOut}
          className="text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-gold"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const section = sectionFor(pathname);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <Nav />
      </aside>

      <div className="sidebar-stage fixed left-0 right-0 top-0 z-30 grid h-16 grid-cols-[auto_minmax(0,1fr)] items-center border-b border-sidebar-border px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              title="Open menu"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-gold"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground" aria-label="Navigation">
            <Nav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
         <img src={WORDMARK_URL} alt="Virgo OS" className="ml-3 h-7 w-auto brightness-0 invert" />
      </div>

      <main className="pt-16 lg:pl-64 lg:pt-0">
        <div className="mx-auto max-w-[1480px] p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="virgo-rise mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-6">
            <div className="min-w-0">
              <p className="eyebrow mb-2 flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                {section}
              </p>
              <h1 className="break-words font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                {title}
              </h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}