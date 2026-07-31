"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckCircle2,
  Calendar,
  StickyNote,
  Timer,
  TrendingUp,
  Inbox,
  Settings,
  Command,
  Menu,
} from "lucide-react";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function NavItem({ icon: Icon, label, active }: NavItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Command className="h-5 w-5" />
        </div>
        <span className="font-heading text-lg font-semibold tracking-tight">Virgo OS</span>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto px-3 py-4">
        <div className="space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={CheckCircle2} label="Tasks" />
          <NavItem icon={Calendar} label="Calendar" />
          <NavItem icon={StickyNote} label="Notes" />
        </div>
        <div className="mt-6">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Execution
          </p>
          <div className="mt-2 space-y-1">
            <NavItem icon={Timer} label="Focus" />
            <NavItem icon={TrendingUp} label="Habits" />
          </div>
        </div>
        <div className="mt-6">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            System
          </p>
          <div className="mt-2 space-y-1">
            <NavItem icon={Inbox} label="Inbox" />
            <NavItem icon={Settings} label="Settings" />
          </div>
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-secondary" />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">Alex Morgan</p>
            <p className="truncate text-xs text-muted-foreground">alex@virgo.os</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r bg-sidebar lg:block">
        {nav}
      </aside>
      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            {nav}
          </SheetContent>
        </Sheet>
        <div className="ml-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Command className="h-4 w-4" />
          </div>
          <span className="font-heading text-base font-semibold tracking-tight">Virgo OS</span>
        </div>
      </div>
    </>
  );
}
