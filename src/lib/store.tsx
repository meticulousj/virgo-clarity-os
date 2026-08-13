"use client";

import * as React from "react";

export type Task = {
  id: string;
  title: string;
  project: string;
  impact: number; // 1-5
  urgency: number; // 1-5
  effort: number; // 1-5
  due?: string | undefined; // yyyy-mm-dd
  done: boolean;
  createdAt: string;
};

export type Habit = {
  id: string;
  name: string;
  target: number; // times per week
  log: string[]; // yyyy-mm-dd
};

export type Goal = {
  id: string;
  title: string;
  area: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
};

export type Txn = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export type DeclutterItem = {
  id: string;
  label: string;
  area: string;
  count: number;
  done: boolean;
};

export type CalEvent = {
  id: string;
  date: string;
  start: string;
  end: string;
  title: string;
  kind: "focus" | "meeting" | "personal";
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: number;
  text: string;
};

export type Review = {
  id: string;
  weekOf: string;
  wins: string;
  friction: string;
  next: string;
};

export type HealthLog = {
  date: string;
  sleep: number;
  energy: number;
  focusMinutes: number;
  steps: number;
};

export type PlanBlock = { start: string; end: string; title: string; why: string };
export type DailyPlan = { date: string; blocks: PlanBlock[]; note: string; generatedAt: string };

export type State = {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  txns: Txn[];
  budgets: Record<string, number>;
  declutter: DeclutterItem[];
  events: CalEvent[];
  journal: JournalEntry[];
  reviews: Review[];
  health: HealthLog[];
  plan: DailyPlan | null;
  recommendations: { text: string; generatedAt: string } | null;
};

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const today = () => iso(new Date());
export const daysAgo = (n: number) => iso(new Date(Date.now() - n * 86400000));
export const uid = () => Math.random().toString(36).slice(2, 10);

function seedHealth(): HealthLog[] {
  const base = [7.4, 6.2, 8.1, 7.0, 5.8, 7.9, 6.9, 7.2, 8.0, 6.5, 7.1, 7.6, 6.8, 7.3];
  return base.map((sleep, i) => ({
    date: daysAgo(base.length - 1 - i),
    sleep,
    energy: Math.max(1, Math.min(5, Math.round(sleep - 3))),
    focusMinutes: Math.round(90 + sleep * 22 + (i % 3) * 15),
    steps: 4200 + ((i * 917) % 6000),
  }));
}

const seed: State = {
  tasks: [
    {
      id: "t1",
      title: "Ship Q3 roadmap draft",
      project: "Work",
      impact: 5,
      urgency: 4,
      effort: 3,
      due: daysAgo(-1),
      done: false,
      createdAt: daysAgo(3),
    },
    {
      id: "t2",
      title: "Deep work: pricing model",
      project: "Work",
      impact: 4,
      urgency: 3,
      effort: 4,
      due: daysAgo(-3),
      done: false,
      createdAt: daysAgo(2),
    },
    {
      id: "t3",
      title: "Reply to landlord email",
      project: "Life",
      impact: 2,
      urgency: 5,
      effort: 1,
      due: today(),
      done: false,
      createdAt: daysAgo(1),
    },
    {
      id: "t4",
      title: "Unsubscribe from dead newsletters",
      project: "Declutter",
      impact: 2,
      urgency: 1,
      effort: 2,
      done: false,
      createdAt: daysAgo(6),
    },
    {
      id: "t5",
      title: "Book dentist appointment",
      project: "Health",
      impact: 3,
      urgency: 3,
      effort: 1,
      due: daysAgo(-5),
      done: true,
      createdAt: daysAgo(8),
    },
  ],
  habits: [
    { id: "h1", name: "Morning pages", target: 7, log: [daysAgo(0), daysAgo(1), daysAgo(3)] },
    { id: "h2", name: "Strength training", target: 4, log: [daysAgo(1), daysAgo(4)] },
    { id: "h3", name: "No phone before 9am", target: 5, log: [daysAgo(0), daysAgo(2), daysAgo(3)] },
    { id: "h4", name: "Read 20 pages", target: 6, log: [daysAgo(0), daysAgo(1), daysAgo(2)] },
  ],
  goals: [
    {
      id: "g1",
      title: "Launch personal site v2",
      area: "Craft",
      current: 6,
      target: 10,
      unit: "milestones",
      deadline: daysAgo(-45),
    },
    {
      id: "g2",
      title: "Emergency fund",
      area: "Money",
      current: 7200,
      target: 12000,
      unit: "$",
      deadline: daysAgo(-180),
    },
    {
      id: "g3",
      title: "Run a half marathon",
      area: "Health",
      current: 14,
      target: 21,
      unit: "km long run",
      deadline: daysAgo(-90),
    },
  ],
  txns: [
    { id: "x1", date: daysAgo(1), description: "Groceries", amount: 82.4, category: "Food", type: "expense" },
    { id: "x2", date: daysAgo(2), description: "Coffee", amount: 5.5, category: "Food", type: "expense" },
    { id: "x3", date: daysAgo(3), description: "Rent", amount: 1450, category: "Housing", type: "expense" },
    { id: "x4", date: daysAgo(4), description: "Salary", amount: 4200, category: "Income", type: "income" },
    { id: "x5", date: daysAgo(5), description: "Streaming bundle", amount: 34.99, category: "Subscriptions", type: "expense" },
    { id: "x6", date: daysAgo(6), description: "Train pass", amount: 76, category: "Transport", type: "expense" },
  ],
  budgets: { Food: 500, Housing: 1500, Subscriptions: 60, Transport: 150, Fun: 200 },
  declutter: [
    { id: "d1", label: "Inbox zero sweep", area: "Email", count: 214, done: false },
    { id: "d2", label: "Cancel unused subscriptions", area: "Money", count: 4, done: false },
    { id: "d3", label: "Clean desktop + downloads", area: "Files", count: 96, done: false },
    { id: "d4", label: "Mute noisy channels", area: "Notifications", count: 11, done: true },
    { id: "d5", label: "Delete stale photo bursts", area: "Photos", count: 1320, done: false },
  ],
  events: [
    { id: "e1", date: today(), start: "09:00", end: "10:30", title: "Deep work block", kind: "focus" },
    { id: "e2", date: today(), start: "11:00", end: "11:30", title: "Standup", kind: "meeting" },
    { id: "e3", date: today(), start: "18:30", end: "19:30", title: "Gym", kind: "personal" },
    { id: "e4", date: daysAgo(-1), start: "14:00", end: "15:00", title: "1:1 with Dana", kind: "meeting" },
  ],
  journal: [
    {
      id: "j1",
      date: daysAgo(1),
      mood: 4,
      text: "Good momentum on the roadmap. Evening scroll ate an hour I wanted for reading.",
    },
    {
      id: "j2",
      date: daysAgo(3),
      mood: 3,
      text: "Low sleep, shallow work. Meetings stacked back to back with no recovery gap.",
    },
  ],
  reviews: [
    {
      id: "r1",
      weekOf: daysAgo(7),
      wins: "Shipped the pricing draft, trained twice, no late-night screens on 4 nights.",
      friction: "Mornings hijacked by Slack. Two habits slipped after Wednesday.",
      next: "Protect 9-11am. Batch messages twice a day.",
    },
  ],
  health: seedHealth(),
  plan: null,
  recommendations: null,
};

const KEY = "virgo-os-state-v1";

let state: State = seed;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function setState(update: (s: State) => State) {
  state = update(state);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => seed;

let hydrated = false;
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      state = { ...seed, ...parsed };
      emit();
    }
  } catch {
    /* ignore corrupt state */
  }
}

export function useVirgo() {
  const snap = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  React.useEffect(() => {
    hydrate();
  }, []);
  return snap;
}

export function resetState() {
  setState(() => seed);
}

export function upsertHealth(entry: HealthLog) {
  setState((s) => {
    const exists = s.health.some((h) => h.date === entry.date);
    const health = exists
      ? s.health.map((h) => (h.date === entry.date ? entry : h))
      : [...s.health, entry];
    return { ...s, health: health.sort((a, b) => a.date.localeCompare(b.date)) };
  });
}

export function removeHealth(date: string) {
  setState((s) => ({ ...s, health: s.health.filter((h) => h.date !== date) }));
}

export function priorityScore(task: Task): number {
  const dueBoost = (() => {
    if (!task.due) return 0;
    const days = Math.ceil((new Date(task.due).getTime() - Date.now()) / 86400000);
    if (days < 0) return 25;
    if (days === 0) return 20;
    if (days <= 2) return 14;
    if (days <= 7) return 7;
    return 2;
  })();
  const ageDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(task.createdAt).getTime()) / 86400000),
  );
  const raw =
    task.impact * 9 + task.urgency * 6 + dueBoost + Math.min(ageDays, 10) - (task.effort - 1) * 3;
  return Math.max(1, Math.min(100, Math.round(raw)));
}

export function priorityBand(score: number): { label: string; tone: string } {
  if (score >= 70) return { label: "Critical", tone: "bg-primary text-primary-foreground" };
  if (score >= 50) return { label: "High", tone: "bg-secondary text-secondary-foreground" };
  if (score >= 30) return { label: "Medium", tone: "bg-muted text-muted-foreground" };
  return { label: "Low", tone: "bg-muted text-muted-foreground" };
}

export function sortedTasks(tasks: Task[]) {
  return [...tasks].sort(
    (a, b) => Number(a.done) - Number(b.done) || priorityScore(b) - priorityScore(a),
  );
}

export function habitStreak(habit: Habit) {
  const set = new Set(habit.log);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    if (set.has(daysAgo(i))) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function weekDates(): string[] {
  return Array.from({ length: 7 }, (_, i) => daysAgo(6 - i));
}

export function monthSpend(txns: Txn[]) {
  const month = today().slice(0, 7);
  return txns
    .filter((t) => t.type === "expense" && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function spendByCategory(txns: Txn[]) {
  const map: Record<string, number> = {};
  for (const t of txns) {
    if (t.type !== "expense") continue;
    map[t.category] = (map[t.category] ?? 0) + t.amount;
  }
  return map;
}

export function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function contextSnapshot(s: State) {
  const openTasks = sortedTasks(s.tasks.filter((t) => !t.done))
    .slice(0, 8)
    .map((t) => ({
      title: t.title,
      project: t.project,
      score: priorityScore(t),
      due: t.due ?? null,
      effort: t.effort,
    }));
  const recent = s.health.slice(-7);
  return {
    date: today(),
    openTasks,
    events: s.events
      .filter((e) => e.date === today())
      .map((e) => ({ title: e.title, start: e.start, end: e.end, kind: e.kind })),
    habits: s.habits.map((h) => ({
      name: h.name,
      target: h.target,
      doneThisWeek: h.log.filter((d) => weekDates().includes(d)).length,
      streak: habitStreak(h),
    })),
    goals: s.goals.map((g) => ({
      title: g.title,
      progress: `${g.current}/${g.target} ${g.unit}`,
      deadline: g.deadline,
    })),
    money: {
      monthSpend: Math.round(monthSpend(s.txns)),
      byCategory: spendByCategory(s.txns),
      budgets: s.budgets,
    },
    health: {
      avgSleep: Number(avg(recent.map((h) => h.sleep)).toFixed(1)),
      avgEnergy: Number(avg(recent.map((h) => h.energy)).toFixed(1)),
      avgFocusMinutes: Math.round(avg(recent.map((h) => h.focusMinutes))),
      avgSteps: Math.round(avg(recent.map((h) => h.steps))),
    },
    journal: s.journal.slice(0, 3).map((j) => ({ date: j.date, mood: j.mood, text: j.text })),
  };
}