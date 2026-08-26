import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-loch-950 pt-16">
      <div className="container-page">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <span className="mb-5 flex h-14 w-fit items-center rounded-xl bg-oat-50 px-3 py-2 shadow-sm">
              <Image
                src="/logo-mark.png"
                alt={site.name}
                width={200}
                height={122}
                className="h-full w-auto object-contain"
              />
            </span>
            <p className="font-display text-xl text-oat-50">{site.name}</p>
            <p className="eyebrow mt-2 text-lamp-400/80">{site.legalName}</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-oat-100/60">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-4 text-oat-100/40">Explore</p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("#") ? (
                    <a
                      href={item.href}
                      className="text-sm text-oat-100/70 transition-colors hover:text-lamp-400"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-oat-100/70 transition-colors hover:text-lamp-400"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-4 text-oat-100/40">Contact</p>
            <ul className="space-y-2.5 text-sm text-oat-100/70">
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-lamp-400">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="break-all transition-colors hover:text-lamp-400"
                >
                  {site.email}
                </a>
              </li>
              <li className="pt-2 leading-relaxed text-oat-100/55">
                {site.address.line1}
                <br />
                {site.address.line2}, {site.address.postcode}
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-fade-dark" />

        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-oat-100/45">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <Link
              href="/terms-of-use"
              className="text-oat-100/55 transition-colors hover:text-lamp-400"
            >
              Terms of use
            </Link>
            <Link
              href="/privacy-policy"
              className="text-oat-100/55 transition-colors hover:text-lamp-400"
            >
              Privacy policy
            </Link>
            <Link
              href="/admin"
              className="text-oat-100/35 transition-colors hover:text-oat-100/70"
            >
              Owner login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
