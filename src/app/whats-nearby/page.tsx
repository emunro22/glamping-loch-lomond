import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";
import { FeaturePageHero } from "@/components/site/FeaturePageHero";
import { ThingsToDo } from "@/components/site/ThingsToDo";
import { getContent, type ContentBlock } from "@/lib/db";
import { fallbackContent } from "@/data/content";
import { nearbyPhotos } from "@/data/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "What's Nearby",
  description:
    "Loch Lomond Shores, Balloch Marina, Conic Hill and the West Highland Way: everything within half an hour of Ballagan Farm, Scotland's first National Park.",
  alternates: { canonical: "/whats-nearby" },
};

export default async function WhatsNearbyPage() {
  const content = await getContent().catch(() => ({}) as Record<string, ContentBlock>);

  const fromDb = content.nearby;
  const fallback = fallbackContent.nearby;
  const heading = fromDb?.heading || fallback.heading;
  const body = fromDb?.body || fallback.body;
  const heroImage = fromDb?.image_url ?? nearbyPhotos[0].src;

  return (
    <>
      <Header />

      <main id="main">
        <FeaturePageHero
          eyebrow="Within half an hour"
          title={heading}
          body={body}
          imageUrl={heroImage}
          imageAlt="The view over Loch Lomond and its islands from The Cobbler"
        />

        <ThingsToDo />

        <Contact
          heading="Plan your trip"
          body="Not sure what to fit in? Send us a note and we'll point you the right way. We live here."
        />
      </main>

      <Footer />
    </>
  );
}
