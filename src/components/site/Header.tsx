"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "on-dark fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-oat-50/10 bg-loch-800/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 shrink-0 items-center rounded-xl bg-oat-50 px-2 py-1.5 shadow-sm ring-1 ring-loch-950/5 sm:h-11">
            <Image
              src="/logo-mark.png"
              alt={site.name}
              width={140}
              height={85}
              priority
              className="h-full w-auto object-contain"
            />
          </span>
          <span className="flex shrink-0 flex-col leading-none">
            <span className="whitespace-nowrap font-display text-lg tracking-tight text-oat-50 sm:text-xl">
              Glamping Loch Lomond
            </span>
            <span className="eyebrow mt-1 text-lamp-400/80">Ballagan Farm</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex">
          {nav.map((item) => {
            const isContact = item.label === "Contact";
            const linkClass = cn(
              "whitespace-nowrap text-sm transition-colors",
              isContact
                ? "font-semibold text-lamp-400 hover:text-lamp-300"
                : "text-oat-100/75 hover:text-oat-50",
            );

            return item.href.startsWith("#") ? (
              <a key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className="hidden whitespace-nowrap text-sm font-semibold text-lamp-400 transition-colors hover:text-lamp-300 md:block"
          >
            {site.phone}
          </a>
          <Link
            href="/#book"
            className="hidden whitespace-nowrap rounded-full bg-lamp-500 px-5 py-2.5 text-sm font-semibold text-loch-950 transition-all hover:bg-lamp-400 hover:shadow-glow sm:block"
          >
            Check dates
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-oat-50/20 text-oat-50 xl:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 h-[1.5px] w-4 bg-current transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-[1.5px] w-4 bg-current transition-all duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-[1.5px] w-4 bg-current transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-oat-50/10 bg-loch-800/95 backdrop-blur-xl xl:hidden"
          >
            <nav className="container-page flex flex-col py-4">
              {nav.map((item, i) => {
                const isContact = item.label === "Contact";
                const itemClass = cn(
                  "block py-4 font-display text-2xl",
                  isContact ? "text-lamp-400" : "text-oat-50",
                );

                return item.href.startsWith("#") ? (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className={cn(itemClass, "border-b border-oat-50/5 last:border-0")}
                  >
                    {item.label}
                  </motion.a>
                ) : (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className="border-b border-oat-50/5 last:border-0"
                  >
                    <Link href={item.href} onClick={() => setOpen(false)} className={itemClass}>
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <Link
                href="/#book"
                onClick={() => setOpen(false)}
                className="mt-5 rounded-full bg-lamp-500 px-6 py-3.5 text-center text-sm font-semibold text-loch-950"
              >
                Check dates
              </Link>
              <a
                href={site.phoneHref}
                className="mt-3 py-2 text-center text-sm font-semibold text-lamp-400"
              >
                {site.phone}
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
