import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { site } from "@/data/site";
import { businessEnquiryEmail, customerConfirmationEmail } from "@/lib/emails";

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

  // Store first: an enquiry that reaches the admin portal is never lost,
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
    console.error("RESEND_API_KEY not set. Enquiry saved but no email sent.");
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  // Every enquiry notification goes to the business inbox: always
  // info@glampinglochlomond.co.uk, regardless of what CONTACT_TO_EMAIL is set to.
  const to = site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? `Glamping Loch Lomond <onboarding@resend.dev>`;

  const stay =
    arrival && departure ? `${arrival} → ${departure}` : "No dates given";

  const emailData = {
    name,
    email,
    phone,
    pod,
    stay,
    guests: Number.isFinite(guests) ? String(guests) : "—",
    message,
  };

  try {
    const business = businessEnquiryEmail(emailData);
    const businessResult = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: business.subject,
      html: business.html,
    });
    // The SDK resolves (never throws) on an API-level rejection, such as a bad
    // "from" domain or sandbox-mode restrictions, so that has to be
    // checked explicitly or a failed send silently reports success.
    if (businessResult.error) {
      throw new Error(`Business notification: ${businessResult.error.message}`);
    }

    // Acknowledge to the guest so they know it landed.
    const confirmation = customerConfirmationEmail(emailData);
    const confirmationResult = await resend.emails.send({
      from,
      to: email,
      subject: confirmation.subject,
      html: confirmation.html,
    });
    if (confirmationResult.error) {
      throw new Error(`Guest confirmation: ${confirmationResult.error.message}`);
    }
  } catch (error) {
    console.error("Resend failed:", error);
    return NextResponse.json(
      { error: "We couldn't send that just now. Please try again or call us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
