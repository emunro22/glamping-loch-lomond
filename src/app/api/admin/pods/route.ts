import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const rows = await sql`SELECT * FROM pods ORDER BY sort_order ASC, id ASC`;
  return NextResponse.json(rows);
}
