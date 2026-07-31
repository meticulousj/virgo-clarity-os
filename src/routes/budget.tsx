import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { monthSpend, setState, spendByCategory, today, uid, useVirgo } from "@/lib/store";

export const Route = createFileRoute("/budget")({
  component: BudgetPage,
  head: () => ({
    meta: [
      { title: "Budget Tracking — Virgo OS" },
      {
        name: "description",
        content: "See spending by category against your budgets, and log transactions in seconds.",
      },
      { property: "og:title", content: "Budget Tracking — Virgo OS" },
      {
        property: "og:description",
        content: "Spending by category against your budgets, updated as you log it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function BudgetPage() {
  const state = useVirgo();
  const [desc, setDesc] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("Food");

  const byCat = spendByCategory(state.txns);
  const income = state.txns
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const spent = monthSpend(state.txns);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!desc.trim() || !Number.isFinite(value) || value <= 0) return;
    setState((s) => ({
      ...s,
      txns: [
        {
          id: uid(),
          date: today(),
          description: desc.trim(),
          amount: value,
          category: category.trim() || "Other",
          type: "expense",
        },
        ...s.txns,
      ],
    }));
    setDesc("");
    setAmount("");
  };

  return (
    <AppShell
      title="Budget"
      subtitle={`$${spent.toFixed(0)} spent this month · $${(income - spent).toFixed(0)} net`}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(state.budgets).map(([cat, limit]) => {
              const used = byCat[cat] ?? 0;
              const pct = Math.min(100, (used / limit) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat}</span>
                    <span className="tabular-nums text-muted-foreground">
                      ${used.toFixed(0)} / ${limit}
                    </span>
                  </div>
                  <Progress value={pct} className="mt-2 h-1.5" />
                  {used > limit ? (
                    <p className="mt-1 text-xs text-destructive">
                      Over budget by ${(used - limit).toFixed(0)}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg">Log expense</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={add}>
                <div className="space-y-1.5">
                  <Label htmlFor="desc">Description</Label>
                  <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cat">Category</Label>
                    <Input
                      id="cat"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add expense
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg">Recent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {state.txns.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">{t.description}</span>
                  <Badge variant="secondary">{t.category}</Badge>
                  <span className="tabular-nums">
                    {t.type === "income" ? "+" : "−"}${t.amount.toFixed(0)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}