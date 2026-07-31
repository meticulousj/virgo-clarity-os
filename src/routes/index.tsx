import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/virgo/sidebar";
import { Header } from "@/components/virgo/header";
import { DailySummary } from "@/components/virgo/widgets/daily-summary";
import { TaskList } from "@/components/virgo/widgets/task-list";
import { CalendarMini } from "@/components/virgo/widgets/calendar-mini";
import { FocusTimer } from "@/components/virgo/widgets/focus-timer";
import { HabitTracker } from "@/components/virgo/widgets/habit-tracker";
import { NotesWidget } from "@/components/virgo/widgets/notes-widget";
import { InboxPreview } from "@/components/virgo/widgets/inbox-preview";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Virgo OS — Clarity & Execution" },
      {
        name: "description",
        content: "Your all-in-one personal operating system for clarity and execution.",
      },
      { property: "og:title", content: "Virgo OS — Clarity & Execution" },
      {
        property: "og:description",
        content: "Your all-in-one personal operating system for clarity and execution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pt-16 lg:pt-0 lg:pl-60">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Header />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="md:col-span-2">
              <DailySummary />
            </div>
            <TaskList />
            <CalendarMini />
            <FocusTimer />
            <HabitTracker />
            <NotesWidget />
            <InboxPreview />
          </div>
        </div>
      </main>
    </div>
  );
}
