"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/gallery", label: "Photos" },
  { href: "/admin/pods", label: "Pods" },
  { href: "/admin/content", label: "Page text" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-oat-100">
      <header className="on-dark sticky top-0 z-40 border-b border-oat-50/10 bg-loch-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 items-center rounded-lg bg-oat-50 px-1.5 py-1">
              <Image
                src="/logo-mark.png"
                alt=""
                width={120}
                height={73}
                className="h-full w-auto object-contain"
              />
            </span>
            <span className="font-display text-base text-oat-50">
              Glamping Loch Lomond
            </span>
            <span className="hidden rounded-full bg-lamp-500/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-lamp-400 sm:block">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-oat-100/60 transition-colors hover:text-oat-50"
            >
              View site ↗
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-oat-50/20 px-4 py-2 text-sm text-oat-50 transition-colors hover:bg-oat-50/10"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:gap-12 lg:py-12">
        <nav className="lg:w-52 lg:shrink-0">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-loch-900 text-oat-50"
                        : "text-loch-800/70 hover:bg-loch-900/5 hover:text-loch-900",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-loch-900 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-loch-800/65">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-loch-900/8 bg-oat-50 p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
