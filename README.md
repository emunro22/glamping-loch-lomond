# Glamping Loch Lomond

Full rebuild of glampinglochlomond.co.uk — Next.js 15 (App Router), TypeScript,
Tailwind, Framer Motion, Neon Postgres, Vercel Blob and Resend.

The InnStyle booking engine is untouched. The site builds booking links from the
dates and occupancy a guest picks and hands them over to InnStyle exactly as
before.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in the values below
npm run db:setup               # creates tables + seeds pods and page text
npm run dev
```

Site at `http://localhost:3000`, admin portal at `http://localhost:3000/admin`.

---

## Environment variables

| Variable | What it's for | Where to get it |
|---|---|---|
| `DATABASE_URL` | Pods, gallery, page text, enquiries | Neon dashboard → Connection string |
| `BLOB_READ_WRITE_TOKEN` | Photo uploads | Vercel → Storage → Blob → Tokens |
| `ADMIN_PASSWORD` | Password for `/admin/login` | Pick one, give it to the client |
| `AUTH_SECRET` | Signs the admin session cookie | `openssl rand -base64 32` |
| `RESEND_API_KEY` | Contact form emails | Resend dashboard |
| `CONTACT_TO_EMAIL` | Where enquiries land | `info@glampinglochlomond.co.uk` |
| `CONTACT_FROM_EMAIL` | Sender address | Must be on a domain verified in Resend |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap | `https://www.glampinglochlomond.co.uk` |

> `AUTH_SECRET` and `ADMIN_PASSWORD` must not contain a `$` if you're pasting
> into `.env.local` — Next's dotenv-expand will strip it. Use base64 output
> without `$`, or wrap the value in single quotes.

---

## The booking integration

`src/lib/booking.ts` is the only place that knows about InnStyle. It rebuilds
the query string the engine expects:

```
booking[bookable_id]      75351 (Rose) / 75350 (Thistle)
booking[start_date]       YYYY-MM-DD
booking[end_date]         YYYY-MM-DD
booking[discount]         (empty)
iframe                    0
booking[occupancy][adults|children|infants|dogs]
booking[rate_type_id]     70916
commit                    Book
```

Generated links are byte-for-byte identical to the ones currently in use.

Bookable IDs are stored in the database and editable at **Admin → Pods**, so if
InnStyle ever reissues them the client can fix it without a deploy. There's a
"Booking link preview" panel on that page to test the link before saving.

---

## Deploying to Vercel

1. Push to GitHub, import the repo in Vercel.
2. Add all environment variables (Production **and** Preview).
3. Create a Neon database and a Blob store, link both to the project.
4. Run `npm run db:setup` once locally against the production `DATABASE_URL`.
5. Point the domain at Vercel. Old URLs (`/about`, `/things-to-do`, `/bbq-hut`,
   `/gallery`, `/book-now`, `/footer/terms-of-use`, `/footer/privacy-policy`)
   already 301 to their new homes in `next.config.ts`, so existing rankings and
   inbound links carry over.

---

## Admin portal

`/admin` — password only, session cookie lasts 8 hours, `middleware.ts` guards
every route under `/admin`.

- **Overview** — new enquiry count, photos live, pods bookable.
- **Enquiries** — everything from the contact form, with new/replied/archived
  status. Enquiries are written to the database *before* the email is sent, so
  nothing is lost if Resend has a wobble.
- **Photos** — drag to reorder, edit captions, assign categories (the categories
  become the filter buttons in the site gallery), delete removes from Blob too.
- **Pods** — name, tagline, description, feature list, main photo, sleeps, price
  from, bookable ID, and a show/hide toggle.
- **Page text** — the heading, paragraph and photo for each homepage section,
  labelled in plain English ("Top of the page", "The dark green section") rather
  than by database key.

Homepage revalidates every 60 seconds, so edits appear within a minute.

---

## Design notes

Palette is built from the subject rather than a stock template: deep loch-at-dusk
pine for the hero and footer, warm oat for the body of the page, and lamplight
amber as the single accent. The two pods carry their own colours — dusty rose and
heather purple — taken from the flowers they're named after.

The signature element is the botanical line-art in `components/ui/Botanical.tsx`:
a rose and a thistle drawn as continuous strokes that draw themselves in on
scroll, one per pod card. That's the one place motion does something other than
fade, and everything else stays quiet around it.

Type is Fraunces (display, with its optical-size and softness axes set warm) over
Karla (body). Scroll reveals go through a single `Reveal` primitive so timing is
consistent, and `prefers-reduced-motion` is respected globally in `globals.css`.

---

## Structure

```
src/
├── app/
│   ├── page.tsx                 homepage — all sections
│   ├── terms-of-use/            rewritten, now with a bookings + Scots law clause
│   ├── privacy-policy/          rewritten for UK GDPR (rights, retention, legal basis)
│   ├── admin/
│   │   ├── login/               sits outside the admin shell
│   │   └── (dashboard)/         overview, enquiries, gallery, pods, content
│   └── api/
│       ├── contact/             validate → store → notify → auto-reply
│       └── admin/               login, logout, upload, gallery, pods, content, enquiries
├── components/
│   ├── site/                    Header, Hero, BookingPanel, FeatureSection,
│   │                            PodShowcase, ThingsToDo, Gallery, Contact, Footer
│   ├── admin/                   AdminShell, managers, ImageUpload
│   └── ui/                      Botanical, Reveal, Button, SectionHeading
├── lib/                         booking.ts, db.ts, auth.ts, utils.ts
└── data/site.ts                 contact details, nav, pod fallbacks
```

Every section falls back to hard-coded copy if the database is unreachable, so
the site never renders empty.

---

## Things worth checking before launch

- **Postcode.** I've used G83 8SB as a placeholder in `src/data/site.ts` —
  confirm the real one with the client, it's in the schema markup.
- **Social links.** Placeholders in `site.social`, swap in the real profiles.
- **Photography.** The old site's images are low-resolution. The layout is built
  for large photos; worth asking whether they have originals.
- **The hot tub and sauna.** The About page mentions a wood-fired hot tub and a
  private sauna pod, but no other page does. If those are live they deserve their
  own section — currently not built.
- **Resend domain.** Verify glampinglochlomond.co.uk in Resend, otherwise the
  auto-reply will land in spam.
