import { cn } from "@/lib/utils";
import type { AvailabilitySummary } from "@/lib/availability";

type Props = {
  summary?: AvailabilitySummary | null;
  tone?: "dark" | "light";
  className?: string;
};

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * A quiet green/red status pulled from InnStyle's own calendar. See
 * src/lib/availability.ts. Renders nothing if that data isn't available,
 * so a scrape hiccup never shows a wrong or broken badge.
 */
export function AvailabilityBadge({ summary, tone = "light", className }: Props) {
  if (!summary) return null;

  const today = new Date().toISOString().slice(0, 10);
  const isAvailable = summary.status === "available";
  const label = isAvailable
    ? summary.nextAvailable === today
      ? "Available now"
      : `Next available ${shortDate(summary.nextAvailable!)}`
    : "Fully booked right now";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        tone === "dark" ? "text-oat-100/75" : "text-loch-800/65",
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", isAvailable ? "bg-ok" : "bg-full")}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
