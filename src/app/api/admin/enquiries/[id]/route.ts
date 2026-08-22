import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };
const STATUSES = ["new", "replied", "archived"] as const;

export async function PATCH(request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const { status } = (await request.json()) as { status?: string };

  if (!status || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }

  await sql`UPDATE enquiries SET status = ${status} WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await sql`DELETE FROM enquiries WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}
