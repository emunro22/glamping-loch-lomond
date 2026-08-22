"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** "gallery", "content:<key>" or "pod:<slug>" */
  attachTo: string;
  category?: string;
  label?: string;
  onUploaded?: (url: string) => void;
  className?: string;
};

export function ImageUpload({
  attachTo,
  category = "general",
  label = "Upload a photo",
  onUploaded,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setBusy(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("category", category);
        form.append("attachTo", attachTo);
        form.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.error ?? "That upload didn't work.");
        }

        const { url } = await res.json();
        onUploaded?.(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
          dragging
            ? "border-lamp-500 bg-lamp-500/5"
            : "border-loch-900/15 hover:border-loch-900/30",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={attachTo === "gallery"}
          onChange={(e) => upload(e.target.files)}
          className="hidden"
          id={`upload-${attachTo}`}
        />

        <p className="text-sm text-loch-800/70">
          {busy ? "Uploading…" : "Drop an image here, or"}
        </p>

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded-full bg-loch-900 px-5 py-2.5 text-sm font-semibold text-oat-50 transition-colors hover:bg-loch-700 disabled:opacity-50"
        >
          {label}
        </button>

        <p className="mt-3 text-xs text-loch-800/45">
          JPEG, PNG, WebP or AVIF · up to 12 MB
        </p>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
