"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "./AdminShell";
import { ImageUpload } from "./ImageUpload";
import { buildBookingUrl, defaultStay } from "@/lib/booking";
import { cn } from "@/lib/utils";
import type { PodRecord } from "@/lib/db";

const inputClass =
  "w-full rounded-xl border border-loch-900/15 bg-oat-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-lamp-600";
const labelClass = "eyebrow mb-2 block text-loch-800/50";

export function PodsManager({ initial }: { initial: PodRecord[] }) {
  if (initial.length === 0) {
    return (
      <Card>
        <p className="py-10 text-center text-sm text-loch-800/55">
          No pods in the database yet. Run{" "}
          <code className="rounded bg-loch-900/8 px-1.5 py-0.5">
            npm run db:setup
          </code>{" "}
          to create them.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {initial.map((pod) => (
        <PodEditor key={pod.id} pod={pod} />
      ))}
    </div>
  );
}

function PodEditor({ pod }: { pod: PodRecord }) {
  const router = useRouter();
  const stay = defaultStay();

  const [draft, setDraft] = useState<PodRecord>({
    ...pod,
    features: Array.isArray(pod.features) ? pod.features : [],
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  function set<K extends keyof PodRecord>(key: K, value: PodRecord[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setStatus("idle");
  }

  function setFeature(index: number, value: string) {
    const next = [...draft.features];
    next[index] = value;
    set("features", next);
  }

  async function save() {
    setStatus("saving");
    setError("");

    const res = await fetch(`/api/admin/pods/${pod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        features: draft.features.filter((f) => f.trim().length > 0),
      }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload.error ?? "Couldn't save that.");
      setStatus("error");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  const previewUrl = buildBookingUrl({
    bookableId: draft.bookable_id,
    rateTypeId: draft.rate_type_id,
    startDate: stay.start,
    endDate: stay.end,
    occupancy: { adults: 2 },
  });

  return (
    <Card>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "h-3 w-3 rounded-full",
              draft.slug === "rose" ? "bg-rose-500" : "bg-thistle-500",
            )}
          />
          <h2 className="font-display text-xl text-loch-900">{draft.name}</h2>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-loch-800/70">
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
            className="h-4 w-4 accent-lamp-600"
          />
          Show on website
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div>
          <span className={labelClass}>Main photo</span>
          <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-oat-200">
            {draft.hero_image ? (
              <Image
                src={draft.hero_image}
                alt=""
                fill
                sizes="220px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-xs text-loch-800/40">
                No photo yet
              </div>
            )}
          </div>
          <ImageUpload
            attachTo={`pod:${draft.slug}`}
            category="pods"
            label="Replace photo"
            onUploaded={(url) => {
              set("hero_image", url);
              router.refresh();
            }}
          />
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor={`name-${pod.id}`}>
                Pod name
              </label>
              <input
                id={`name-${pod.id}`}
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor={`tagline-${pod.id}`}>
                Short tagline
              </label>
              <input
                id={`tagline-${pod.id}`}
                value={draft.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor={`desc-${pod.id}`}>
              Description
            </label>
            <textarea
              id={`desc-${pod.id}`}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className={cn(inputClass, "resize-y")}
            />
          </div>

          <div>
            <span className={labelClass}>Features</span>
            <div className="space-y-2">
              {draft.features.map((feature, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={feature}
                    onChange={(e) => setFeature(i, e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "features",
                        draft.features.filter((_, index) => index !== i),
                      )
                    }
                    aria-label="Remove feature"
                    className="shrink-0 rounded-xl px-3 text-loch-800/50 transition-colors hover:bg-rose-500/10 hover:text-rose-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {draft.features.length < 8 ? (
              <button
                type="button"
                onClick={() => set("features", [...draft.features, ""])}
                className="mt-2.5 text-sm text-lamp-600 transition-colors hover:text-lamp-500"
              >
                + Add a feature
              </button>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor={`sleeps-${pod.id}`}>
                Sleeps
              </label>
              <input
                id={`sleeps-${pod.id}`}
                type="number"
                min={1}
                max={8}
                value={draft.sleeps}
                onChange={(e) => set("sleeps", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor={`price-${pod.id}`}>
                Price from
              </label>
              <input
                id={`price-${pod.id}`}
                value={draft.price_from ?? ""}
                placeholder="£120 a night"
                onChange={(e) => set("price_from", e.target.value || null)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor={`bookable-${pod.id}`}>
                InnStyle bookable ID
              </label>
              <input
                id={`bookable-${pod.id}`}
                value={draft.bookable_id}
                onChange={(e) => set("bookable_id", e.target.value)}
                className={cn(inputClass, "font-mono")}
              />
            </div>
          </div>

          <details className="rounded-xl bg-oat-100 p-4">
            <summary className="cursor-pointer text-sm font-medium text-loch-900">
              Booking link preview
            </summary>
            <p className="mt-3 break-all font-mono text-xs leading-relaxed text-loch-800/65">
              {previewUrl}
            </p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-lamp-600 underline underline-offset-2"
            >
              Test this link ↗
            </a>
          </details>

          {error ? (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              className="rounded-full bg-loch-900 px-6 py-3 text-sm font-semibold text-oat-50 transition-colors hover:bg-loch-700 disabled:opacity-50"
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
            {status === "saved" ? (
              <span className="text-sm text-bracken">Saved</span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
