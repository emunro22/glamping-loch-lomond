"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Photo } from "@/data/media";

type Props = { photos: Photo[] };

/** A lightweight masonry grid with a lightbox — used across the pod pages for photo sets. */
export function PodGallery({ photos }: Props) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((v) => ((v ?? 0) + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setActive((v) => ((v ?? 0) - 1 + photos.length) % photos.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "gap-4 [&>*]:mb-4",
          photos.length > 1 ? "columns-2 md:columns-3" : "columns-1",
        )}
      >
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: (i % 6) * 0.05 }}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-oat-200"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={900}
              height={650}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 bg-loch-950/0 transition-colors duration-300 group-hover:bg-loch-950/20" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && photos[active] ? (
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
                src={photos[active].src}
                alt={photos[active].alt}
                width={1600}
                height={1200}
                className="h-auto max-h-[85vh] w-full rounded-2xl object-contain"
              />
              <p className="mt-4 text-center text-sm text-oat-100/70">
                {photos[active].alt}
              </p>
            </motion.div>

            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close photo"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-oat-50/25 text-oat-50 transition-colors hover:bg-oat-50/10"
            >
              ✕
            </button>

            {photos.length > 1 ? (
              <>
                <NavArrow
                  side="left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((v) => ((v ?? 0) - 1 + photos.length) % photos.length);
                  }}
                />
                <NavArrow
                  side="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((v) => ((v ?? 0) + 1) % photos.length);
                  }}
                />
              </>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
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
