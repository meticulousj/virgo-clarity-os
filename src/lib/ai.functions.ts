import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "openai/gpt-5.6-sol";

const Input = z.object({ snapshot: z.string().min(2) });

async function chat(system: string, user: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this app yet.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      reasoning_effort: "none",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (res.status === 429) throw new Error("AI is busy right now — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits are exhausted. Add credits to continue.");
  if (!res.ok) {
    const body = await res.text();
    console.error(`AI gateway error [${res.status}]: ${body}`);
    throw new Error(`AI request failed (${res.status}).`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new Error("AI returned an unreadable response.");
  }
}

const PlanShape = z.object({
  note: z.string().default(""),
  blocks: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
        title: z.string(),
        why: z.string().default(""),
      }),
    )
    .default([]),
});

export const generateDailyPlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const raw = await chat(
      [
        "You are the planning engine of Virgo OS, a personal operating system focused on clarity and execution.",
        "Build a realistic time-blocked plan for today from the user's snapshot (tasks with priority scores, fixed calendar events, habits, energy and sleep).",
        "Respect existing calendar events as fixed. Protect deep work when energy allows, batch small tasks, and leave recovery gaps.",
        "Keep it to 6-9 blocks between 07:00 and 21:00. Each 'why' is one short sentence, max 90 characters.",
        'Respond with JSON only: {"note": string (1-2 sentence strategy), "blocks": [{"start":"HH:mm","end":"HH:mm","title":string,"why":string}]}',
      ].join(" "),
      data.snapshot,
    );
    return PlanShape.parse(raw);
  });

const TipsShape = z.object({ text: z.string().min(1) });

export const generateRoutineTips = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const raw = await chat(
      [
        "You are the insights engine of Virgo OS. Read the user's snapshot (habits, goals, spending vs budget, sleep, energy, focus minutes, journal notes).",
        "Give 4 concrete recommendations for improving their routines. Reference their actual numbers. Be direct, no filler, no praise padding.",
        "Format as markdown-free plain text: each recommendation on its own line, starting with '- ', max 200 characters each.",
        'Respond with JSON only: {"text": string}',
      ].join(" "),
      data.snapshot,
    );
    return TipsShape.parse(raw);
  });

const ReviewShape = z.object({
  wins: z.string().default(""),
  friction: z.string().default(""),
  next: z.string().default(""),
});

export const generateWeeklyReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const raw = await chat(
      [
        "You are the weekly review engine of Virgo OS. From the user's snapshot, draft an honest weekly life review.",
        "Cite real numbers (habit completion, task scores, spend vs budget, sleep). 2-4 sentences per field. No praise padding.",
        'Respond with JSON only: {"wins": string, "friction": string, "next": string}',
      ].join(" "),
      data.snapshot,
    );
    return ReviewShape.parse(raw);
  });