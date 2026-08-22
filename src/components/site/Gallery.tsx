"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/lib/db";

type Props = { images: GalleryImage[] };

export function Gallery({ images }: Props) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<number | null>(null);

  const categories = useMemo(() => {
    const set = new Set(images.map((i) => i.category).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [images]);

  const shown = useMemo(
    () => (filter === "all" ? images : images.filter((i) => i.category === filter)),
    [images, filter],
  );

  useEffect(() => {
    if (active === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((v) => ((v ?? 0) + 1) % shown.length);
      if (e.key === "ArrowLeft")
        setActive((v) => ((v ?? 0) - 1 + shown.length) % shown.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, shown.length]);

  if (images.length === 0) {
    return (
      <section id="gallery" className="bg-oat-50 py-20 sm:py-28">
        <div className="container-page text-center">
          <p className="eyebrow mb-4 text-lamp-600">Gallery</p>
          <h2 className="text-3xl sm:text-4xl">Photos coming soon</h2>
          <p className="mx-auto mt-4 max-w-md text-loch-800/65">
            Upload photos in the admin portal and they&rsquo;ll appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="bg-oat-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4 text-lamp-600">Gallery</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl">Have a look round</h2>
          </div>

          {categories.length > 2 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFilter(cat);
                    setActive(null);
                  }}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm capitalize transition-colors",
                    filter === cat
                      ? "bg-loch-900 text-oat-50"
                      : "bg-loch-900/5 text-loch-800/70 hover:bg-loch-900/10",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-10 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {shown.map((image, i) => (
            <motion.button
              key={image.id}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (i % 6) * 0.05 }}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-oat-200"
            >
              <Image
                src={image.url}
                alt={image.alt || "Glamping Loch Lomond"}
                width={800}
                height={600}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-loch-950/0 transition-colors duration-300 group-hover:bg-loch-950/20" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && shown[active] ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-loch-950/95 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={shown[active].url}
                alt={shown[active].alt || "Glamping Loch Lomond"}
                width={1600}
                height={1200}
                className="h-auto max-h-[85vh] w-full rounded-2xl object-contain"
              />
              {shown[active].alt ? (
                <p className="mt-4 text-center text-sm text-oat-100/70">
                  {shown[active].alt}
                </p>
              ) : null}
            </motion.div>

            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close photo"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-oat-50/25 text-oat-50 transition-colors hover:bg-oat-50/10"
            >
              ✕
            </button>

            <NavArrow
              side="left"
              onClick={(e) => {
                e.stopPropagation();
                setActive((v) => ((v ?? 0) - 1 + shown.length) % shown.length);
              }}
            />
            <NavArrow
              side="right"
              onClick={(e) => {
                e.stopPropagation();
                setActive((v) => ((v ?? 0) + 1) % shown.length);
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function NavArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-oat-50/25 text-oat-50 transition-colors hover:bg-oat-50/10 sm:grid",
        side === "left" ? "left-5" : "right-5",
      )}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
