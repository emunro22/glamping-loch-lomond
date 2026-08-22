import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getEnquiries } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getEnquiries());
}
