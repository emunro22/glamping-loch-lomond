"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "./AdminShell";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import type { Enquiry } from "@/lib/db";

type Filter = "new" | "replied" | "archived" | "all";

const filters: { key: Filter; label: string }[] = [
  { key: "new", label: "New" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
  { key: "all", label: "All" },
];

export function EnquiriesManager({ initial }: { initial: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initial);
  const [filter, setFilter] = useState<Filter>("new");
  const [expanded, setExpanded] = useState<number | null>(null);

  const shown =
    filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  async function setStatus(id: number, status: Enquiry["status"]) {
    setEnquiries((list) =>
      list.map((e) => (e.id === id ? { ...e, status } : e)),
    );
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this enquiry? This can't be undone.")) return;
    setEnquiries((list) => list.filter((e) => e.id !== id));
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count =
            f.key === "all"
              ? enquiries.length
              : enquiries.filter((e) => e.status === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                filter === f.key
                  ? "bg-loch-900 text-oat-50"
                  : "bg-loch-900/5 text-loch-800/70 hover:bg-loch-900/10",
              )}
            >
              {f.label}
              <span className="ml-2 tabular-nums opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <Card>
          <p className="py-10 text-center text-sm text-loch-800/55">
            Nothing here right now.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {shown.map((enquiry) => {
            const open = expanded === enquiry.id;
            return (
              <Card key={enquiry.id} className="p-0">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : enquiry.id)}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-5 text-left"
                  aria-expanded={open}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-medium text-loch-900">
                        {enquiry.name}
                      </span>
                      {enquiry.status === "new" ? (
                        <span className="rounded-full bg-lamp-500/20 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-lamp-600">
                          New
                        </span>
                      ) : null}
                      {enquiry.pod ? (
                        <span className="text-xs text-loch-800/55">
                          {enquiry.pod}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-sm text-loch-800/60">
                      {enquiry.message}
                    </p>
                  </div>
                  <span className="text-xs tabular-nums text-loch-800/45">
                    {formatDateTime(enquiry.created_at)}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-loch-900/8 p-5">
                        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                          <Field label="Email">
                            <a
                              href={`mailto:${enquiry.email}`}
                              className="text-lamp-600 underline underline-offset-2"
                            >
                              {enquiry.email}
                            </a>
                          </Field>
                          <Field label="Phone">
                            {enquiry.phone ? (
                              <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
                            ) : (
                              "—"
                            )}
                          </Field>
                          <Field label="Dates">
                            {enquiry.arrival && enquiry.departure
                              ? `${formatDate(enquiry.arrival)} → ${formatDate(enquiry.departure)}`
                              : "Not given"}
                          </Field>
                          <Field label="Guests">{enquiry.guests ?? "—"}</Field>
                        </dl>

                        <div className="mt-5 whitespace-pre-wrap rounded-xl bg-oat-100 p-4 text-sm leading-relaxed text-loch-800/85">
                          {enquiry.message}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <a
                            href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Re: your enquiry to Glamping Loch Lomond")}`}
                            className="rounded-full bg-loch-900 px-5 py-2.5 text-sm font-semibold text-oat-50 transition-colors hover:bg-loch-700"
                          >
                            Reply by email
                          </a>
                          {enquiry.status !== "replied" ? (
                            <button
                              type="button"
                              onClick={() => setStatus(enquiry.id, "replied")}
                              className="rounded-full border border-loch-900/20 px-5 py-2.5 text-sm transition-colors hover:bg-loch-900/5"
                            >
                              Mark as replied
                            </button>
                          ) : null}
                          {enquiry.status !== "archived" ? (
                            <button
                              type="button"
                              onClick={() => setStatus(enquiry.id, "archived")}
                              className="rounded-full border border-loch-900/20 px-5 py-2.5 text-sm transition-colors hover:bg-loch-900/5"
                            >
                              Archive
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => remove(enquiry.id)}
                            className="rounded-full px-5 py-2.5 text-sm text-rose-700 transition-colors hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="eyebrow mb-1 text-loch-800/45">{label}</dt>
      <dd className="text-loch-800/85">{children}</dd>
    </div>
  );
}
