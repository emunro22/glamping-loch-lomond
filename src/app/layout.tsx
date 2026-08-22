import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const body = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Glamping Loch Lomond | Luxury Glamping Pods at Ballagan Farm",
    template: "%s | Glamping Loch Lomond",
  },
  description:
    "Two fully-equipped glamping pods on a family farm at Loch Lomond, inside Scotland's first National Park. En-suite, south-facing, dog friendly. Book direct.",
  keywords: [
    "glamping Loch Lomond",
    "glamping pods Scotland",
    "Ballagan Farm",
    "Gartocharn accommodation",
    "Loch Lomond pods",
    "dog friendly glamping Scotland",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "Glamping Loch Lomond | Pods at Ballagan Farm",
    description:
      "Two south-facing glamping pods on a working family farm at Loch Lomond. En-suite, fully furnished, BBQ hut available.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0F211E",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  priceRange: "££",
  petsAllowed: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: site.address.line2,
    addressRegion: site.address.region,
    postalCode: site.address.postcode,
    addressCountry: "GB",
  },
  amenityFeature: [
    "En-suite shower",
    "Full kitchen",
    "Bedding and towels included",
    "BBQ hut",
    "Hot tub",
    "Sauna",
    "Dog friendly",
  ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-loch-900 focus:px-5 focus:py-3 focus:text-sm focus:text-oat-50"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
