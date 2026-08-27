"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import { Card } from "./AdminShell";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/db";

const CATEGORIES = [
  "general",
  "pods",
  "inside",
  "rose",
  "thistle",
  "bbq hut",
  "rose hot tub",
  "thistle hot tub",
  "sauna",
  "views",
  "nearby",
];

export function GalleryManager({ initial }: { initial: GalleryImage[] }) {
  const router = useRouter();
  const [images, setImages] = useState(initial);
  const [uploadCategory, setUploadCategory] = useState("general");
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);

  async function saveOrder(next: GalleryImage[]) {
    setSaving(true);
    await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((i) => i.id) }),
    });
    setSaving(false);
    setOrderDirty(false);
  }

  async function updateImage(id: number, patch: Partial<GalleryImage>) {
    const next = images.map((i) => (i.id === id ? { ...i, ...patch } : i));
    setImages(next);
    const image = next.find((i) => i.id === id);
    if (!image) return;

    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: image.alt, category: image.category }),
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this photo from the website?")) return;
    setImages((list) => list.filter((i) => i.id !== id));
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
  }

  return (
    <>
      <Card className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="eyebrow text-loch-800/50">Add to</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setUploadCategory(cat)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm capitalize transition-colors",
                uploadCategory === cat
                  ? "bg-loch-900 text-oat-50"
                  : "bg-loch-900/5 text-loch-800/70 hover:bg-loch-900/10",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <ImageUpload
          attachTo="gallery"
          category={uploadCategory}
          label="Choose photos"
          onUploaded={() => router.refresh()}
        />
      </Card>

      {orderDirty ? (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-lamp-500/40 bg-lamp-500/10 px-5 py-3.5">
          <p className="text-sm text-loch-900">Order changed.</p>
          <button
            type="button"
            onClick={() => saveOrder(images)}
            disabled={saving}
            className="rounded-full bg-loch-900 px-5 py-2 text-sm font-semibold text-oat-50 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save order"}
          </button>
        </div>
      ) : null}

      {images.length === 0 ? (
        <Card>
          <p className="py-10 text-center text-sm text-loch-800/55">
            No photos yet. Upload the first one above and it will appear in the
            gallery on the website.
          </p>
        </Card>
      ) : (
        <Reorder.Group
          axis="y"
          values={images}
          onReorder={(next) => {
            setImages(next);
            setOrderDirty(true);
          }}
          className="space-y-3"
        >
          {images.map((image) => (
            <Reorder.Item key={image.id} value={image}>
              <Card className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                <span
                  aria-hidden="true"
                  className="cursor-grab select-none px-1 text-loch-800/30 active:cursor-grabbing"
                >
                  ⠿
                </span>

                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-oat-200">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {editing === image.id ? (
                    <div className="space-y-2.5">
                      <input
                        value={image.alt}
                        onChange={(e) =>
                          setImages((list) =>
                            list.map((i) =>
                              i.id === image.id ? { ...i, alt: e.target.value } : i,
                            ),
                          )
                        }
                        placeholder="Describe the photo"
                        className="w-full rounded-lg border border-loch-900/15 px-3 py-2 text-sm outline-none focus:border-lamp-600"
                      />
                      <select
                        value={image.category}
                        onChange={(e) =>
                          setImages((list) =>
                            list.map((i) =>
                              i.id === image.id
                                ? { ...i, category: e.target.value }
                                : i,
                            ),
                          )
                        }
                        className="rounded-lg border border-loch-900/15 px-3 py-2 text-sm capitalize outline-none focus:border-lamp-600"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <p className="truncate text-sm text-loch-900">
                        {image.alt || "No description"}
                      </p>
                      <p className="mt-1 text-xs capitalize text-loch-800/50">
                        {image.category}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {editing === image.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        updateImage(image.id, {});
                        setEditing(null);
                      }}
                      className="rounded-full bg-loch-900 px-4 py-2 text-sm font-semibold text-oat-50"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing(image.id)}
                      className="rounded-full border border-loch-900/20 px-4 py-2 text-sm transition-colors hover:bg-loch-900/5"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(image.id)}
                    className="rounded-full px-4 py-2 text-sm text-rose-700 transition-colors hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </>
  );
}
