import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  email: string;
  displayName: string;
  avatarPath: string | null;
  avatarUrl: string | null;
  timezone: string | null;
};

const listeners = new Set<() => void>();

/** Tell every mounted profile view (sidebar, profile page) to reload. */
export function notifyProfileChanged() {
  listeners.forEach((l) => l());
}

export async function signedAvatarUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export async function loadProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, timezone")
    .eq("id", user.id)
    .maybeSingle();
  const avatarPath = data?.avatar_url ?? null;
  return {
    id: user.id,
    email: user.email ?? "",
    displayName: data?.display_name ?? "",
    avatarPath,
    avatarUrl: await signedAvatarUrl(avatarPath),
    timezone: data?.timezone ?? null,
  };
}

export function useProfile() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    const run = () => {
      loadProfile().then((p) => {
        if (cancelled) return;
        setProfile(p);
        setLoading(false);
      });
    };
    run();
    listeners.add(run);
    return () => {
      cancelled = true;
      listeners.delete(run);
    };
  }, []);

  return { profile, loading };
}

export function initialsFor(name: string) {
  return name
    .split(/[\s._-]+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function listTimezones(): string[] {
  try {
    const fn = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf;
    if (fn) return fn("timeZone");
  } catch {
    /* fall through */
  }
  return [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
}

export function browserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
