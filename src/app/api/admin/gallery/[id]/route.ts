import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json()) as { alt?: string; category?: string };

  const alt = (body.alt ?? "").slice(0, 200);
  const category = (body.category ?? "general").slice(0, 40);

  await sql`UPDATE gallery SET alt = ${alt}, category = ${category}
            WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const rows = (await sql`SELECT url FROM gallery WHERE id = ${Number(id)}`) as {
    url: string;
  }[];

  if (rows[0]?.url) {
    try {
      await del(rows[0].url);
    } catch (error) {
      // The database row still goes — an orphaned blob is the lesser problem.
      console.error("Blob delete failed:", error);
    }
  }

  await sql`DELETE FROM gallery WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}
