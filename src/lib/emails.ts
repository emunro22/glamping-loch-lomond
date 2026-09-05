import { site } from "@/data/site";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type EnquiryEmailData = {
  name: string;
  email: string;
  phone: string;
  pod: string;
  stay: string;
  guests: string;
  message: string;
};

/* ---------------------------- shared building blocks ---------------------------- */

const COLORS = {
  loch950: "#0B1A17",
  loch900: "#0F211E",
  loch800: "#173029",
  oat50: "#F5F3EC",
  oat100: "#EEEBE1",
  oat300: "#D2CCBA",
  lamp400: "#E8BC6B",
  lamp500: "#D9A441",
  lamp600: "#B9862F",
  ink: "#0F211E",
  muted: "#5B6B64",
  faint: "#8A978F",
};

const FONT_DISPLAY = "'Fraunces', Georgia, 'Times New Roman', serif";
const FONT_BODY =
  "'Karla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function preheader(text: string): string {
  // Hidden preview text: shows in the inbox list next to the subject line.
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(
    text,
  )}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</div>`;
}

function shell(opts: { preheaderText: string; eyebrow: string; body: string }): string {
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(site.name)}</title>
    <!--[if mso]>
    <style>* { font-family: Georgia, 'Times New Roman', serif !important; }</style>
    <![endif]-->
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.oat100};">
    ${preheader(opts.preheaderText)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.oat100};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background-color:${COLORS.oat50};border-radius:20px;overflow:hidden;box-shadow:0 24px 60px -32px rgba(11,26,23,0.25);">

            <!-- Header -->
            <tr>
              <td style="background-color:${COLORS.loch900};padding:32px 40px;text-align:left;">
                <img
                  src="${site.url}/logo-mark.png"
                  width="40"
                  height="24"
                  alt="${escapeHtml(site.name)}"
                  style="display:block;border:0;outline:none;text-decoration:none;height:24px;width:auto;margin-bottom:18px;"
                />
                <p style="margin:0;font-family:${FONT_BODY};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.lamp400};">
                  ${escapeHtml(opts.eyebrow)}
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px 8px;">
                ${opts.body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:28px 40px 36px;border-top:1px solid ${COLORS.oat300};margin-top:8px;">
                <p style="margin:20px 0 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${COLORS.faint};">
                  ${escapeHtml(site.name)} · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.line2)}, ${escapeHtml(site.address.region)} ${escapeHtml(site.address.postcode)}<br />
                  <a href="${site.phoneHref}" style="color:${COLORS.faint};text-decoration:underline;">${escapeHtml(site.phone)}</a>
                  &nbsp;·&nbsp;
                  <a href="mailto:${site.email}" style="color:${COLORS.faint};text-decoration:underline;">${escapeHtml(site.email)}</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORS.oat300};font-family:${FONT_BODY};font-size:13px;color:${COLORS.muted};width:110px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORS.oat300};font-family:${FONT_BODY};font-size:14px;color:${COLORS.ink};vertical-align:top;">${value}</td>
  </tr>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;">
    <tr>
      <td style="border-radius:999px;background-color:${COLORS.lamp500};">
        <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${FONT_BODY};font-size:14px;font-weight:700;color:${COLORS.loch950};text-decoration:none;border-radius:999px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}

/* ---------------------------------- templates ------------------------------------ */

/** Sent to the business (always info@glampinglochlomond.co.uk) for every enquiry. */
export function businessEnquiryEmail(d: EnquiryEmailData): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 22px;font-family:${FONT_DISPLAY};font-size:26px;line-height:1.2;color:${COLORS.ink};">
      New enquiry from ${escapeHtml(d.name)}
    </h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:${FONT_BODY};">
      ${detailRow("Email", `<a href="mailto:${escapeHtml(d.email)}" style="color:${COLORS.lamp600};text-decoration:none;">${escapeHtml(d.email)}</a>`)}
      ${detailRow("Phone", d.phone ? `<a href="tel:${escapeHtml(d.phone)}" style="color:${COLORS.lamp600};text-decoration:none;">${escapeHtml(d.phone)}</a>` : "—")}
      ${detailRow("Pod", escapeHtml(d.pod) || "Not specified")}
      ${detailRow("Dates", escapeHtml(d.stay))}
      ${detailRow("Guests", escapeHtml(d.guests))}
    </table>

    <p style="margin:24px 0 8px;font-family:${FONT_BODY};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.muted};">
      Message
    </p>
    <div style="padding:18px 20px;background-color:${COLORS.oat100};border-radius:14px;font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${COLORS.ink};white-space:pre-wrap;">${escapeHtml(d.message)}</div>

    ${button(`mailto:${d.email}`, `Reply to ${d.name}`)}
  `;

  return {
    subject: `New enquiry from ${d.name}${d.pod ? ` · ${d.pod}` : ""}`,
    html: shell({
      preheaderText: `${d.name} · ${d.stay} · ${d.message.slice(0, 90)}`,
      eyebrow: "New website enquiry",
      body,
    }),
  };
}

/** Auto-reply sent to the customer who submitted the enquiry. */
export function customerConfirmationEmail(d: EnquiryEmailData): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 16px;font-family:${FONT_DISPLAY};font-size:26px;line-height:1.2;color:${COLORS.ink};">
      Thanks, ${escapeHtml(d.name)}
    </h1>
    <p style="margin:0 0 24px;font-family:${FONT_BODY};font-size:15px;line-height:1.7;color:${COLORS.muted};">
      Your message has reached us at Ballagan Farm and we&rsquo;ll get back to you within a day.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:18px 20px;background-color:${COLORS.loch900};border-radius:14px;">
          <p style="margin:0 0 4px;font-family:${FONT_BODY};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.lamp400};">
            Need us urgently?
          </p>
          <p style="margin:0;font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${COLORS.oat50};">
            Give us a ring on
            <a href="${site.phoneHref}" style="color:${COLORS.lamp400};font-weight:700;text-decoration:none;">${escapeHtml(site.phone)}</a>
            and we&rsquo;ll pick up.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-family:${FONT_BODY};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.muted};">
      What you sent us
    </p>
    <div style="padding:18px 20px;background-color:${COLORS.oat100};border-radius:14px;font-family:${FONT_BODY};font-size:14px;line-height:1.7;color:${COLORS.ink};">
      <strong>${escapeHtml(d.pod) || "Pod not specified"}</strong> · ${escapeHtml(d.stay)}
      <div style="margin-top:10px;white-space:pre-wrap;color:${COLORS.muted};">${escapeHtml(d.message)}</div>
    </div>

    ${button(site.url, "Back to the website")}
  `;

  return {
    subject: "We've got your message: Glamping Loch Lomond",
    html: shell({
      preheaderText: `Thanks ${d.name}. We'll reply within a day. Urgent? Call ${site.phone}.`,
      eyebrow: "Thanks for getting in touch",
      body,
    }),
  };
}
