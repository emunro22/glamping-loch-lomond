import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { site } from "@/data/site";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  pod?: string;
  arrival?: string;
  departure?: string;
  guests?: string;
  message?: string;
  company?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a real person never fills this in.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 40);
  const pod = clean(body.pod, 60);
  const arrival = clean(body.arrival, 10);
  const departure = clean(body.departure, 10);
  const guests = Number.parseInt(clean(body.guests, 3), 10);
  const message = clean(body.message, 2000);

  if (!name || !message) {
    return NextResponse.json(
      { error: "Add your name and a message so we know what to reply to." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  // Store first — an enquiry that reaches the admin portal is never lost,
  // even if the email provider is having a bad day.
  try {
    await sql`
      INSERT INTO enquiries (name, email, phone, pod, arrival, departure, guests, message)
      VALUES (
        ${name}, ${email}, ${phone || null}, ${pod || null},
        ${arrival || null}, ${departure || null},
        ${Number.isFinite(guests) ? guests : null}, ${message}
      )
    `;
  } catch (error) {
    console.error("Failed to save enquiry:", error);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — enquiry saved but no email sent.");
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? `Glamping Loch Lomond <onboarding@resend.dev>`;

  const stay =
    arrival && departure ? `${arrival} → ${departure}` : "No dates given";

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Enquiry from ${name}${pod ? ` · ${pod}` : ""}`,
      html: `
        <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#0F211E">
          <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#B9862F;margin:0 0 12px">
            New website enquiry
          </p>
          <h1 style="font-size:22px;margin:0 0 20px">${escapeHtml(name)}</h1>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#5b6b64;width:110px">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#5b6b64">Phone</td><td>${escapeHtml(phone) || "—"}</td></tr>
            <tr><td style="padding:6px 0;color:#5b6b64">Pod</td><td>${escapeHtml(pod) || "Not specified"}</td></tr>
            <tr><td style="padding:6px 0;color:#5b6b64">Dates</td><td>${escapeHtml(stay)}</td></tr>
            <tr><td style="padding:6px 0;color:#5b6b64">Guests</td><td>${Number.isFinite(guests) ? guests : "—"}</td></tr>
          </table>
          <div style="margin-top:24px;padding:18px;background:#F5F3EC;border-radius:12px;white-space:pre-wrap;font-size:15px;line-height:1.6">${escapeHtml(message)}</div>
          <p style="margin-top:24px;font-size:12px;color:#8a978f">Sent from glampinglochlomond.co.uk</p>
        </div>
      `,
    });

    // Acknowledge to the guest so they know it landed.
    await resend.emails.send({
      from,
      to: email,
      subject: "We've got your message — Glamping Loch Lomond",
      html: `
        <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#0F211E">
          <h1 style="font-size:22px;margin:0 0 16px">Thanks, ${escapeHtml(name)}</h1>
          <p style="font-size:15px;line-height:1.6;color:#3d4d46">
            Your message has reached us at Ballagan Farm and we'll reply within a day.
            If it's urgent, give us a ring on ${site.phone}.
          </p>
          <div style="margin:24px 0;padding:18px;background:#F5F3EC;border-radius:12px;font-size:14px;line-height:1.6;color:#3d4d46">
            <strong>What you sent us</strong><br/>
            ${escapeHtml(pod) || "Pod not specified"} · ${escapeHtml(stay)}<br/><br/>
            <span style="white-space:pre-wrap">${escapeHtml(message)}</span>
          </div>
          <p style="font-size:13px;color:#8a978f">
            Glamping Loch Lomond · Ballagan Farm, Gartocharn<br/>
            ${site.phone} · ${site.email}
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Resend failed:", error);
    return NextResponse.json(
      { error: "We couldn't send that just now. Please try again or call us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
