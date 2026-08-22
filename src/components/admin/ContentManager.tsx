"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "./AdminShell";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/lib/db";

const inputClass =
  "w-full rounded-xl border border-loch-900/15 bg-oat-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-lamp-600";
const labelClass = "eyebrow mb-2 block text-loch-800/50";

/** Plain-English names so the client knows which bit of the page they're editing. */
const SECTION_LABELS: Record<string, { title: string; where: string }> = {
  hero: { title: "Top of the page", where: "The big heading and the line under it" },
  about: { title: "Welcome", where: "The paragraph about the farm" },
  pod: { title: "The pod", where: "First photo-and-text section" },
  inside: { title: "Inside the pod", where: "The dark green section" },
  bbq: { title: "The BBQ hut", where: "Below the two pod cards" },
  view: { title: "The view", where: "Last photo-and-text section" },
  contact: { title: "Contact", where: "Above the contact form" },
};

export function ContentManager({ initial }: { initial: ContentBlock[] }) {
  if (initial.length === 0) {
    return (
      <Card>
        <p className="py-10 text-center text-sm text-loch-800/55">
          No content in the database yet. Run{" "}
          <code className="rounded bg-loch-900/8 px-1.5 py-0.5">
            npm run db:setup
          </code>{" "}
          to add the starting text.
        </p>
      </Card>
    );
  }

  const order = Object.keys(SECTION_LABELS);
  const sorted = [...initial].sort(
    (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
  );

  return (
    <div className="space-y-6">
      {sorted.map((block) => (
        <BlockEditor key={block.key} block={block} />
      ))}
    </div>
  );
}

function BlockEditor({ block }: { block: ContentBlock }) {
  const router = useRouter();
  const [draft, setDraft] = useState(block);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const meta = SECTION_LABELS[block.key] ?? {
    title: block.key,
    where: "Homepage section",
  };

  const hasImage = block.key !== "hero" ? true : true;

  async function save() {
    setStatus("saving");
    setError("");

    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: draft.key,
        heading: draft.heading,
        body: draft.body,
        image_url: draft.image_url,
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

  return (
    <Card>
      <div className="mb-5">
        <h2 className="font-display text-lg text-loch-900">{meta.title}</h2>
        <p className="mt-1 text-sm text-loch-800/55">{meta.where}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor={`heading-${block.key}`}>
              Heading
            </label>
            <input
              id={`heading-${block.key}`}
              value={draft.heading}
              onChange={(e) => {
                setDraft({ ...draft, heading: e.target.value });
                setStatus("idle");
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor={`body-${block.key}`}>
              Text
            </label>
            <textarea
              id={`body-${block.key}`}
              value={draft.body}
              rows={5}
              onChange={(e) => {
                setDraft({ ...draft, body: e.target.value });
                setStatus("idle");
              }}
              className={cn(inputClass, "resize-y leading-relaxed")}
            />
            <p className="mt-2 text-xs text-loch-800/45">
              {draft.body.length} characters
            </p>
          </div>

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

        {hasImage ? (
          <div>
            <span className={labelClass}>Section photo</span>
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-oat-200">
              {draft.image_url ? (
                <Image
                  src={draft.image_url}
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center px-3 text-center text-xs text-loch-800/40">
                  No photo yet
                </div>
              )}
            </div>
            <ImageUpload
              attachTo={`content:${block.key}`}
              category="general"
              label={draft.image_url ? "Replace photo" : "Add photo"}
              onUploaded={(url) => {
                setDraft({ ...draft, image_url: url });
                router.refresh();
              }}
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
