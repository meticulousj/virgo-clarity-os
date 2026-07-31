"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare } from "lucide-react";

const items = [
  { id: "1", type: "message" as const, from: "Sarah", subject: "Design feedback", time: "10m ago" },
  { id: "2", type: "email" as const, from: "Team", subject: "Sprint plan", time: "1h ago" },
  { id: "3", type: "message" as const, from: "Marcus", subject: "Quick question", time: "3h ago" },
];

const iconMap = {
  message: MessageSquare,
  email: Mail,
};

export function InboxPreview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg">Inbox</CardTitle>
          <Badge variant="secondary">3</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = iconMap[item.type];
            return (
              <li key={item.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-secondary/50">
                <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{item.from}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{item.subject}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
