"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Plus } from "lucide-react";
import { format } from "date-fns";

export function Header() {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const greeting = React.useMemo(() => {
    if (!now) return "Welcome back";
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, [now]);

  return (
    <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting}, Alex
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {now ? format(now, "EEEE, MMMM do, yyyy") : "—"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search anything..." className="w-64 pl-9" />
        </div>
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>
    </header>
  );
}
