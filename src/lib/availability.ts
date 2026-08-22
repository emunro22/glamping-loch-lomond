/**
 * Reads live availability straight off InnStyle's own booking calendar.
 *
 * There's no documented API for this — InnStyle serves a plain, unauthenticated
 * HTML page per month at /listings/glampinglochlomond/calendars?date_in_view=...,
 * with one <section class="row bookable-av room_the-{slug}"> per pod and one
 * <div class="day js-day {status}" data-date="YYYY-MM-DD"> per day. That's what
 * gets parsed below with a couple of targeted regexes.
 *
 * This is unofficial and will silently stop working if InnStyle changes that
 * markup — every entry point here is wrapped so a failure just means "no
 * availability data", never a broken page. Nothing throws out of this module.
 */

const CALENDAR_URL = "https://glampinglochlomond.innstyle.co.uk/listings/glampinglochlomond/calendars";

export type DayStatus = "available" | "booked" | "unknown";

export type AvailabilitySummary = {
  /** "available" if bookable today or within the lookahead window, else "booked" (fully booked across that window). */
  status: "available" | "booked";
  /** ISO date of the earliest available night found, if any. */
  nextAvailable: string | null;
};

type MonthMap = Record<string, Record<string, DayStatus>>; // slug -> date -> status

function monthStartISO(monthsFromNow: number): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + monthsFromNow);
  return d.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Fetches and parses one month's calendar. Returns null on any failure. */
async function fetchMonth(dateInView: string): Promise<MonthMap | null> {
  try {
    const res = await fetch(`${CALENDAR_URL}?date_in_view=${dateInView}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GlampingLochLomondSite/1.0)" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const map: MonthMap = {};

    const sectionRe = /<section class="row bookable-av room_the-([a-z-]+)">([\s\S]*?)<\/section>/g;
    const dayRe = /<div class="day js-day ([\w-]+)" data-date="(\d{4}-\d{2}-\d{2})"/g;

    let sectionMatch: RegExpExecArray | null;
    while ((sectionMatch = sectionRe.exec(html))) {
      const slug = sectionMatch[1].replace(/-/g, "");
      const body = sectionMatch[2];
      const days: Record<string, DayStatus> = {};

      let dayMatch: RegExpExecArray | null;
      dayRe.lastIndex = 0;
      while ((dayMatch = dayRe.exec(body))) {
        const [, rawStatus, date] = dayMatch;
        days[date] = rawStatus === "available" ? "available" : rawStatus === "booked" ? "booked" : "unknown";
      }
      map[slug] = days;
    }

    return Object.keys(map).length > 0 ? map : null;
  } catch {
    return null;
  }
}

/**
 * Looks ~60 days ahead across two pods and returns a green/red summary per
 * pod slug ("rose" / "thistle"). Returns null if the fetch/parse didn't work
 * out — callers should treat that as "don't show a badge", not an error.
 */
export async function getAvailabilitySummary(): Promise<Record<string, AvailabilitySummary> | null> {
  const [thisMonth, nextMonth] = await Promise.all([
    fetchMonth(monthStartISO(0)),
    fetchMonth(monthStartISO(1)),
  ]);

  if (!thisMonth && !nextMonth) return null;

  const merged: MonthMap = {};
  for (const month of [thisMonth, nextMonth]) {
    if (!month) continue;
    for (const [slug, days] of Object.entries(month)) {
      merged[slug] = { ...merged[slug], ...days };
    }
  }

  const today = todayISO();
  const result: Record<string, AvailabilitySummary> = {};

  for (const [slug, days] of Object.entries(merged)) {
    const nextAvailable = Object.keys(days)
      .filter((date) => date >= today && days[date] === "available")
      .sort()[0];

    result[slug] = nextAvailable
      ? { status: "available", nextAvailable }
      : { status: "booked", nextAvailable: null };
  }

  return Object.keys(result).length > 0 ? result : null;
}
