import { BOOKING_BASE_URL, DEFAULT_RATE_TYPE_ID } from "@/data/site";

export type Occupancy = {
  adults: number;
  children: number;
  infants: number;
  dogs: number;
};

export type BookingParams = {
  bookableId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  occupancy?: Partial<Occupancy>;
  rateTypeId?: string;
  discount?: string;
};

export const defaultOccupancy: Occupancy = {
  adults: 2,
  children: 0,
  infants: 0,
  dogs: 0,
};

/**
 * Rebuilds the exact query string the InnStyle booking engine expects:
 *
 * booking[bookable_id], booking[start_date], booking[end_date], booking[discount],
 * iframe, booking[occupancy][adults|children|infants|dogs],
 * booking[rate_type_id], commit
 *
 * URLSearchParams handles the bracket encoding, so the output matches the
 * links currently in use on the live site.
 */
export function buildBookingUrl({
  bookableId,
  startDate,
  endDate,
  occupancy,
  rateTypeId = DEFAULT_RATE_TYPE_ID,
  discount = "",
}: BookingParams): string {
  const occ = { ...defaultOccupancy, ...occupancy };

  const params = new URLSearchParams();
  params.set("booking[bookable_id]", bookableId);
  params.set("booking[start_date]", startDate);
  params.set("booking[end_date]", endDate);
  params.set("booking[discount]", discount);
  params.set("iframe", "0");
  params.set("booking[occupancy][adults]", String(occ.adults));
  params.set("booking[occupancy][children]", String(occ.children));
  params.set("booking[occupancy][infants]", String(occ.infants));
  params.set("booking[occupancy][dogs]", String(occ.dogs));
  params.set("booking[rate_type_id]", rateTypeId);
  params.set("commit", "Book");

  return `${BOOKING_BASE_URL}?${params.toString()}`;
}

/** Availability calendar for the whole property. */
export function bookingHomeUrl(): string {
  return "https://glampinglochlomond.innstyle.co.uk/bliss/bookings/new";
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Tomorrow / the day after — sensible defaults for an empty date picker. */
export function defaultStay(): { start: string; end: string } {
  const start = addDays(new Date(), 1);
  return { start: toISODate(start), end: toISODate(addDays(start, 1)) };
}

export function nightsBetween(start: string, end: string): number {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  const diff = Math.round((b.getTime() - a.getTime()) / 86_400_000);
  return Number.isFinite(diff) ? diff : 0;
}
