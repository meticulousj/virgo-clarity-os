"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

const notes = [
  { id: "1", title: "Product vision", preview: "Clarity and execution as the core OS primitives." },
  { id: "2", title: "Meeting notes", preview: "Reviewed dashboard layout and widget density." },
  { id: "3", title: "Ideas", preview: "Keyboard-first navigation for power users." },
];

export function NotesWidget() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg">Notes</CardTitle>
          <Button variant="ghost" size="icon" aria-label="Add note">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-secondary/50">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{note.title}</p>
                <p className="truncate text-xs text-muted-foreground">{note.preview}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
