import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get("file");
  const category = (form.get("category") as string) || "general";
  const alt = ((form.get("alt") as string) || "").slice(0, 200);
  const attachTo = (form.get("attachTo") as string) || ""; // 'gallery' | content key | pod slug

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Upload a JPEG, PNG, WebP or AVIF image." },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is over 12 MB. Compress it and try again." },
      { status: 413 },
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const pathname = `glamping/${category}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  // Where does this image belong?
  if (attachTo.startsWith("content:")) {
    const key = attachTo.slice("content:".length);
    await sql`UPDATE site_content SET image_url = ${blob.url}, updated_at = now()
              WHERE key = ${key}`;
  } else if (attachTo.startsWith("pod:")) {
    const slug = attachTo.slice("pod:".length);
    await sql`UPDATE pods SET hero_image = ${blob.url}, updated_at = now()
              WHERE slug = ${slug}`;
  } else {
    const [{ next }] = (await sql`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM gallery
    `) as { next: number }[];

    await sql`
      INSERT INTO gallery (url, pathname, alt, category, sort_order)
      VALUES (${blob.url}, ${blob.pathname}, ${alt}, ${category}, ${next})
    `;
  }

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
