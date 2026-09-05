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
  Search,
  Command,
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
    <div className="flex h-full flex-col text-sidebar-foreground">
      <div className="flex h-20 items-center gap-2 px-5">
        <img src={WORDMARK_URL} alt="Virgo OS" className="h-9 w-auto brightness-0 invert" />
      </div>
      <Separator />
      <nav className="flex-1 overflow-auto px-3 py-5">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/40">
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
                       "group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                      active
                         ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                         : "text-sidebar-foreground/58 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-gold" : "text-sidebar-foreground/45 group-hover:text-gold")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
           <div className="grid h-9 w-9 place-items-center rounded-full border border-gold/25 bg-gold/10 font-heading text-xs font-semibold text-gold">AM</div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">Alex Morgan</p>
             <p className="truncate text-xs text-sidebar-foreground/40">Personal workspace</p>
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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <Nav />
      </aside>

      <div className="fixed left-0 right-0 top-0 z-30 grid h-16 grid-cols-[auto_minmax(0,1fr)] items-center border-b bg-background/85 px-4 backdrop-blur-xl lg:hidden">
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

      <main className="pt-16 lg:pl-64 lg:pt-0">
        <div className="mx-auto max-w-[1480px] p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <p className="mb-2 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Personal operating system</p>
              <h1 className="truncate font-heading text-2xl font-semibold sm:text-3xl">
                {title}
              </h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="icon" className="hidden sm:inline-flex" aria-label="Search"><Search /></Button>
              <Button variant="outline" size="icon" className="hidden sm:inline-flex" aria-label="Commands"><Command /></Button>
              {actions}
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}