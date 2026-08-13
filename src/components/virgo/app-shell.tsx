"use client";

import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

type NavLink = { to: string; label: string; icon: React.ElementType };

const GROUPS: { title: string; items: NavLink[] }[] = [
  {
    title: "Today",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
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

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-4">
        <img src={WORDMARK_URL} alt="Virgo OS" className="h-8 w-auto" />
      </div>
      <Separator />
      <nav className="flex-1 overflow-auto px-3 py-4">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-secondary" />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">Alex Morgan</p>
            <p className="truncate text-xs text-muted-foreground">Local workspace</p>
          </div>
        </div>
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

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r bg-sidebar lg:block">
        <Nav />
      </aside>

      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <Nav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <img src={WORDMARK_URL} alt="Virgo OS" className="ml-3 h-7 w-auto" />
      </div>

      <main className="pt-16 lg:pl-60 lg:pt-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}