/**
 * Every booking link on the site points here: InnStyle's live booking
 * start screen, where the guest picks Rose or Thistle and their own dates.
 * (Not a per-pod deep link: a fixed single-enquiry URL was tried and caused
 * every visitor to land on the same stale pod/date, so this was reverted.)
 */
const BOOKING_URL = "https://glampinglochlomond.innstyle.co.uk/bliss/bookings/new";

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

export function buildBookingUrl(_params: BookingParams): string {
  return BOOKING_URL;
}

/** Availability calendar for the whole property. */
export function bookingHomeUrl(): string {
  return BOOKING_URL;
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

/** Tomorrow / the day after: sensible defaults for an empty date picker. */
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
