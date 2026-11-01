import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/virgo/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  browserTimezone,
  initialsFor,
  listTimezones,
  notifyProfileChanged,
  signedAvatarUrl,
  useProfile,
} from "@/lib/profile";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Your Profile — Virgo OS" },
      { name: "description", content: "Set your display name, avatar and timezone in Virgo OS." },
      { property: "og:title", content: "Your Profile — Virgo OS" },
      { property: "og:description", content: "Personalise your Virgo OS account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const MAX_BYTES = 5 * 1024 * 1024;

function ProfilePage() {
  const { profile, loading } = useProfile();
  const [name, setName] = React.useState("");
  const [timezone, setTimezone] = React.useState("");
  const [avatarPath, setAvatarPath] = React.useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const timezones = React.useMemo(() => listTimezones(), []);
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!profile) return;
    setName(profile.displayName);
    setTimezone(profile.timezone ?? browserTimezone());
    setAvatarPath(profile.avatarPath);
    setAvatarUrl(profile.avatarUrl);
  }, [profile]);

  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !profile) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ kind: "error", text: "Please choose an image file." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus({ kind: "error", text: "That image is over 5 MB. Try a smaller one." });
      return;
    }
    setUploading(true);
    setStatus(null);
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type, upsert: true });
    if (error) {
      setUploading(false);
      setStatus({ kind: "error", text: "Couldn't upload that photo. Please try again." });
      return;
    }
    const { error: saveErr } = await supabase
      .from("profiles")
      .update({ avatar_url: path, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    if (saveErr) {
      setUploading(false);
      setStatus({ kind: "error", text: "Photo uploaded but couldn't be saved to your profile." });
      return;
    }
    if (avatarPath && avatarPath !== path) {
      await supabase.storage.from("avatars").remove([avatarPath]);
    }
    setAvatarPath(path);
    setAvatarUrl(await signedAvatarUrl(path));
    setUploading(false);
    setStatus({ kind: "ok", text: "Photo updated." });
    notifyProfileChanged();
  }

  async function removeAvatar() {
    if (!profile || !avatarPath) return;
    setUploading(true);
    await supabase.storage.from("avatars").remove([avatarPath]);
    await supabase
      .from("profiles")
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    setAvatarPath(null);
    setAvatarUrl(null);
    setUploading(false);
    setStatus({ kind: "ok", text: "Photo removed." });
    notifyProfileChanged();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setStatus({ kind: "error", text: "Your display name can't be empty." });
      return;
    }
    if (trimmed.length > 60) {
      setStatus({ kind: "error", text: "Keep your display name under 60 characters." });
      return;
    }
    setSaving(true);
    setStatus(null);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: trimmed, timezone, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      setStatus({ kind: "error", text: "Couldn't save your changes. Please try again." });
      return;
    }
    setName(trimmed);
    setStatus({ kind: "ok", text: "Profile saved." });
    notifyProfileChanged();
  }

  const shownName = name.trim() || profile?.email.split("@")[0] || "You";
  const localTime =
    now && timezone
      ? new Intl.DateTimeFormat(undefined, {
          timeZone: timezone,
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        }).format(now)
      : "";

  return (
    <AppShell title="Profile" subtitle="How you appear across Virgo OS.">
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your profile…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <Avatar className="h-28 w-28 border border-gold/30">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={shownName} className="object-cover" /> : null}
                <AvatarFallback className="bg-gold/10 font-heading text-2xl font-semibold text-gold">
                  {initialsFor(shownName) || "·"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-heading text-lg font-semibold">{shownName}</p>
                <p className="truncate text-sm text-muted-foreground">{profile?.email}</p>
                {localTime ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {localTime} · {timezone.replace(/_/g, " ")}
                  </p>
                ) : null}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
                aria-label="Upload photo"
              />
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  {avatarPath ? "Change photo" : "Upload photo"}
                </Button>
                {avatarPath ? (
                  <Button type="button" variant="ghost" size="sm" disabled={uploading} onClick={removeAvatar}>
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF, up to 5 MB.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Account details</CardTitle>
              <CardDescription>Your name and timezone are used throughout your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={save}>
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input
                    id="display-name"
                    value={name}
                    maxLength={60}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jessica Butler"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email ?? ""} disabled readOnly />
                  <p className="text-xs text-muted-foreground">You sign in with a link sent to this address.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" aria-label="Timezone">
                      <SelectValue placeholder="Choose a timezone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    onClick={() => setTimezone(browserTimezone())}
                  >
                    Use this device's timezone ({browserTimezone().replace(/_/g, " ")})
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Save changes
                  </Button>
                  {status ? (
                    <p
                      role="status"
                      className={status.kind === "ok" ? "text-sm text-muted-foreground" : "text-sm text-destructive"}
                    >
                      {status.text}
                    </p>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
