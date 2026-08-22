import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const rows = await sql`SELECT * FROM site_content ORDER BY key ASC`;
  return NextResponse.json(rows);
}

/** Upsert a single content block. */
export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json();
  const key = String(body.key ?? "").slice(0, 60);
  const heading = String(body.heading ?? "").slice(0, 200);
  const content = String(body.body ?? "").slice(0, 6000);
  const imageUrl = body.image_url ? String(body.image_url) : null;

  if (!key) {
    return NextResponse.json({ error: "Missing content key." }, { status: 400 });
  }

  await sql`
    INSERT INTO site_content (key, heading, body, image_url, updated_at)
    VALUES (${key}, ${heading}, ${content}, ${imageUrl}, now())
    ON CONFLICT (key) DO UPDATE SET
      heading = EXCLUDED.heading,
      body = EXCLUDED.body,
      image_url = EXCLUDED.image_url,
      updated_at = now()
  `;

  return NextResponse.json({ ok: true });
}
