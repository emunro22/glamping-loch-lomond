import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getGallery, sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getGallery());
}

/** Bulk reorder: body is { order: number[] } of gallery ids, first = first. */
export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { order } = (await request.json()) as { order?: number[] };
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "Send an array of ids." }, { status: 400 });
  }

  await Promise.all(
    order.map((id, index) =>
      sql`UPDATE gallery SET sort_order = ${index} WHERE id = ${id}`,
    ),
  );

  return NextResponse.json({ ok: true });
}
