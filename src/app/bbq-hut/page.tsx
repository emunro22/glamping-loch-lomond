import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";
import { FeaturePageHero } from "@/components/site/FeaturePageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PodGallery } from "@/components/site/PodGallery";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getContent, type ContentBlock, type GalleryImage } from "@/lib/db";
import { getGalleryWithFallback } from "@/lib/gallery";
import { fallbackContent } from "@/data/content";
import { bbqHutPhotos } from "@/data/media";
import { site } from "@/data/site";
import type { Photo } from "@/data/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The BBQ Hut",
  description:
    "A Scandinavian-inspired BBQ hut, exclusive to the Rose Pod at Ballagan Farm: a central charcoal grill, a prep area and cushioned seating for the whole party.",
  alternates: { canonical: "/bbq-hut" },
};

function toPhotos(images: GalleryImage[]): Photo[] {
  return images.map((image) => ({ src: image.url, alt: image.alt }));
}

export default async function BbqHutPage() {
  const [content, images] = await Promise.all([
    getContent().catch(() => ({}) as Record<string, ContentBlock>),
    getGalleryWithFallback("bbq hut"),
  ]);

  const fromDb = content.bbq;
  const fallback = fallbackContent.bbq;
  const heading = fromDb?.heading || fallback.heading;
  const body = fromDb?.body || fallback.body;
  const heroImage = fromDb?.image_url ?? bbqHutPhotos[0].src;

  const photos = images.length > 0 ? toPhotos(images) : bbqHutPhotos;

  return (
    <>
      <Header />

      <main id="main">
        <FeaturePageHero
          eyebrow="Exclusive to the Rose Pod"
          title={heading}
          body={body}
          imageUrl={heroImage}
          imageAlt="The Scandinavian-style BBQ hut at Ballagan Farm"
        />

        <section className="bg-oat-50 py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="How it works"
              title="Cook outdoors, whatever the sky's doing"
              intro="The hut sits a few steps from the Rose Pod's own decking, with room for the whole party to gather round the fire while dinner cooks."
            />

            <Reveal delay={0.1}>
              <ul className="mt-8 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  "Central charcoal grill with a built-in chimney",
                  "Circular dining table and cushioned bench seating",
                  "Prep area with a fridge and all the cooking tools you need",
                  "Fairy lights along the beams for an evening in",
                  "Plates, glasses and condiments provided",
                  "Marshmallows and toasting sticks provided",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm leading-relaxed text-loch-800/80"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-lamp-500"
                    >
                      <path
                        d="M2 7.5l3.2 3.2L12 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-12">
              <PodGallery photos={photos} />
            </div>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl border-l-2 border-lamp-500/50 pl-4 text-sm italic text-loch-800/60">
                The BBQ hut can be added to your stay for an additional cost, so get
                in touch to secure it for your dates.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-loch-900 py-14 on-dark">
          <div className="container-page">
            <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-oat-50/12 bg-loch-950/40 px-8 py-8 sm:px-10">
              <div>
                <p className="eyebrow mb-2 text-lamp-400">Book the Rose Pod</p>
                <p className="max-w-lg text-oat-100/75">
                  The BBQ hut comes exclusively with the Rose Pod, {site.address.line1}
                  &rsquo;s only pod with its own private cookout.
                </p>
              </div>
              <ButtonLink href="/pods/rose" variant="light">
                See the Rose Pod
              </ButtonLink>
            </Reveal>
          </div>
        </section>

        <Contact
          heading="Ask about the BBQ hut"
          body="Want to add the BBQ hut to a Thistle Pod stay, or check it's free on your dates? Send us a note and we'll get straight back to you."
        />
      </main>

      <Footer />
    </>
  );
}
