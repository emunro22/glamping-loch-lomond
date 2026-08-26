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
import { hotTubPhotos, saunaPhotos } from "@/data/media";
import type { Photo } from "@/data/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hot Tub & Sauna",
  description:
    "A private hot tub and a Scandinavian barrel sauna, exclusive to the Thistle Pod at Ballagan Farm — up to temperature and waiting when you arrive.",
  alternates: { canonical: "/hot-tub-sauna" },
};

function toPhotos(images: GalleryImage[]): Photo[] {
  return images.map((image) => ({ src: image.url, alt: image.alt }));
}

export default async function HotTubSaunaPage() {
  const [content, hotTubImages, saunaImages] = await Promise.all([
    getContent().catch(() => ({}) as Record<string, ContentBlock>),
    getGalleryWithFallback("hot tub"),
    getGalleryWithFallback("sauna"),
  ]);

  const fromDb = content.extras;
  const fallback = fallbackContent.extras;
  const heading = fromDb?.heading || fallback.heading;
  const body = fromDb?.body || fallback.body;
  const heroImage = fromDb?.image_url ?? hotTubPhotos[0].src;

  const photos = [
    ...(hotTubImages.length > 0 ? toPhotos(hotTubImages) : hotTubPhotos),
    ...(saunaImages.length > 0 ? toPhotos(saunaImages) : saunaPhotos),
  ];

  return (
    <>
      <Header />

      <main id="main">
        <FeaturePageHero
          eyebrow="Exclusive to the Thistle Pod"
          title={heading}
          body={body}
          imageUrl={heroImage}
          imageAlt="The Thistle Pod's hot tub, bubbling with farmland behind it"
        />

        <section className="bg-oat-50 py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="How it works"
              title="Ready before you arrive"
              intro="The tub is up to temperature and the sauna's ready to fire up the moment you pull up — both sit out on the decking with the same open farmland view as the rest of the pod."
            />

            <Reveal delay={0.1}>
              <ul className="mt-8 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  "Private hot tub, topped up and ready on arrival",
                  "Scandinavian wood-fired barrel sauna",
                  "Both exclusive to the Thistle Pod",
                  "Open farmland view straight from the water",
                  "Towels and robes provided",
                  "Included in your stay — nothing extra to book",
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
          </div>
        </section>

        <section className="bg-loch-900 py-14 on-dark">
          <div className="container-page">
            <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-oat-50/12 bg-loch-950/40 px-8 py-8 sm:px-10">
              <div>
                <p className="eyebrow mb-2 text-lamp-400">Book the Thistle Pod</p>
                <p className="max-w-lg text-oat-100/75">
                  The hot tub and sauna come exclusively with the Thistle Pod —
                  yours alone for the length of your stay.
                </p>
              </div>
              <ButtonLink href="/pods/thistle" variant="light">
                See the Thistle Pod
              </ButtonLink>
            </Reveal>
          </div>
        </section>

        <Contact
          heading="Ask about the hot tub & sauna"
          body="Questions about the tub, the sauna, or getting the timing right for your arrival? Send us a note and we'll get straight back to you."
        />
      </main>

      <Footer />
    </>
  );
}
