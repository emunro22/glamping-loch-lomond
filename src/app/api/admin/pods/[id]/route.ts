import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  const name = String(body.name ?? "").slice(0, 120);
  const tagline = String(body.tagline ?? "").slice(0, 160);
  const description = String(body.description ?? "").slice(0, 4000);
  const features = Array.isArray(body.features)
    ? body.features.map((f: unknown) => String(f).slice(0, 200)).slice(0, 12)
    : [];
  const bookableId = String(body.bookable_id ?? "").slice(0, 32);
  const rateTypeId = String(body.rate_type_id ?? "70916").slice(0, 32);
  const sleeps = Number(body.sleeps) || 4;
  const priceFrom = body.price_from ? String(body.price_from).slice(0, 40) : null;
  const heroImage = body.hero_image ? String(body.hero_image) : null;
  const isActive = Boolean(body.is_active);

  if (!name || !bookableId) {
    return NextResponse.json(
      { error: "A pod needs a name and a bookable ID." },
      { status: 400 },
    );
  }

  await sql`
    UPDATE pods SET
      name = ${name},
      tagline = ${tagline},
      description = ${description},
      features = ${JSON.stringify(features)}::jsonb,
      bookable_id = ${bookableId},
      rate_type_id = ${rateTypeId},
      sleeps = ${sleeps},
      price_from = ${priceFrom},
      hero_image = ${heroImage},
      is_active = ${isActive},
      updated_at = now()
    WHERE id = ${Number(id)}
  `;

  return NextResponse.json({ ok: true });
}
