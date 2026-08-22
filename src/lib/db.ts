import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/**
 * The connection is created on first query rather than at import time, so
 * `next build` succeeds in environments that don't have DATABASE_URL set
 * (CI, a fresh clone, a preview deploy before env vars are added).
 */
function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set.");
    client = neon(url);
  }
  return client;
}

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) =>
  getClient()(strings, ...values)) as NeonQueryFunction<false, false>;

/* ---------------------------------- Types --------------------------------- */

export type GalleryImage = {
  id: number;
  url: string;
  pathname: string;
  alt: string;
  category: string;
  sort_order: number;
  created_at: string;
};

export type PodRecord = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  bookable_id: string;
  rate_type_id: string;
  hero_image: string | null;
  sleeps: number;
  price_from: string | null;
  is_active: boolean;
  sort_order: number;
};

export type ContentBlock = {
  key: string;
  heading: string;
  body: string;
  image_url: string | null;
  updated_at: string;
};

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  pod: string | null;
  arrival: string | null;
  departure: string | null;
  guests: number | null;
  message: string;
  status: "new" | "replied" | "archived";
  created_at: string;
};

/* --------------------------------- Queries -------------------------------- */

export async function getGallery(category?: string): Promise<GalleryImage[]> {
  const rows = category
    ? await sql`SELECT * FROM gallery WHERE category = ${category}
                ORDER BY sort_order ASC, id DESC`
    : await sql`SELECT * FROM gallery ORDER BY sort_order ASC, id DESC`;
  return rows as GalleryImage[];
}

export async function getPods(): Promise<PodRecord[]> {
  const rows = await sql`SELECT * FROM pods WHERE is_active = true
                         ORDER BY sort_order ASC, id ASC`;
  return rows as PodRecord[];
}

export async function getContent(): Promise<Record<string, ContentBlock>> {
  const rows = (await sql`SELECT * FROM site_content`) as ContentBlock[];
  return Object.fromEntries(rows.map((r) => [r.key, r]));
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const rows = await sql`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200`;
  return rows as Enquiry[];
}
