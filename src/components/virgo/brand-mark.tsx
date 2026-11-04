import { cn } from "@/lib/utils";

const MARK_URL = "/icon-192.png";

/** Logo mark + "Virgo OS" wordmark. `tone="ink"` for navy surfaces, `tone="paper"` for light ones. */
export function BrandMark({
  size = "md",
  tone = "ink",
  className,
}: {
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "paper";
  className?: string;
}) {
  const box = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src={MARK_URL} alt="" className={cn("shrink-0 rounded-md ring-1 ring-gold/30", box)} />
      <span
        className={cn(
          "font-heading font-semibold",
          text,
          tone === "ink" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        Virgo <span className="text-gold">OS</span>
      </span>
    </span>
  );
}
