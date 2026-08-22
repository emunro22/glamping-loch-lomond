import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createSession, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

function safeMatch(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "Admin access isn't configured. Set ADMIN_PASSWORD and AUTH_SECRET." },
      { status: 500 },
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!safeMatch(password, expected)) {
    // Slow down brute-force attempts a little.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "That password isn't right." }, { status: 401 });
  }

  await setSessionCookie(await createSession());
  return NextResponse.json({ ok: true });
}
