import Link from "next/link";
import { PageHeader, Card } from "@/components/admin/AdminShell";
import { getEnquiries, getGallery, sql } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [enquiries, images, podRows] = await Promise.all([
    getEnquiries().catch(() => []),
    getGallery().catch(() => []),
    sql`SELECT slug, name, is_active FROM pods ORDER BY sort_order`.catch(() => []),
  ]);

  const unread = enquiries.filter((e) => e.status === "new");
  const recent = enquiries.slice(0, 5);
  const pods = podRows as { slug: string; name: string; is_active: boolean }[];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Everything on the website that you can change from here."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="New enquiries"
          value={unread.length}
          href="/admin/enquiries"
          highlight={unread.length > 0}
        />
        <Stat label="Photos live" value={images.length} href="/admin/gallery" />
        <Stat
          label="Pods bookable"
          value={pods.filter((p) => p.is_active).length}
          href="/admin/pods"
        />
      </div>

      <Card className="mt-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg text-loch-900">Latest enquiries</h2>
          <Link
            href="/admin/enquiries"
            className="text-sm text-lamp-600 transition-colors hover:text-lamp-500"
          >
            See all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-loch-800/55">
            No enquiries yet. They&rsquo;ll land here as soon as someone uses the
            contact form.
          </p>
        ) : (
          <ul className="divide-y divide-loch-900/8">
            {recent.map((enquiry) => (
              <li key={enquiry.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3.5">
                <span className="font-medium text-loch-900">{enquiry.name}</span>
                {enquiry.status === "new" ? (
                  <span className="rounded-full bg-lamp-500/20 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-lamp-600">
                    New
                  </span>
                ) : null}
                <span className="flex-1 truncate text-sm text-loch-800/60">
                  {enquiry.message}
                </span>
                <span className="text-xs tabular-nums text-loch-800/45">
                  {formatDateTime(enquiry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="mt-6">
        <h2 className="mb-3 font-display text-lg text-loch-900">
          A note on bookings
        </h2>
        <p className="text-sm leading-relaxed text-loch-800/70">
          Availability, prices and payments all stay in InnStyle. The website
          builds a booking link from the dates a guest picks and hands them over.
          If a pod&rsquo;s bookable ID ever changes in InnStyle, update it on the{" "}
          <Link href="/admin/pods" className="text-lamp-600 underline underline-offset-2">
            Pods
          </Link>{" "}
          page and the links will follow.
        </p>
      </Card>
    </>
  );
}

function Stat({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-loch-900/8 bg-oat-50 p-6 transition-shadow hover:shadow-lift"
    >
      <p className="eyebrow text-loch-800/50">{label}</p>
      <p
        className={
          highlight
            ? "mt-3 font-display text-4xl text-lamp-600"
            : "mt-3 font-display text-4xl text-loch-900"
        }
      >
        {value}
      </p>
    </Link>
  );
}
