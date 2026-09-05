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
import { viewPhotos } from "@/data/media";
import type { Photo } from "@/data/media";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The View",
  description:
    "Open farmland, south-facing decking and grazing sheep and cattle: the view from the pods at Ballagan Farm, Loch Lomond.",
  alternates: { canonical: "/the-view" },
};

function toPhotos(images: GalleryImage[]): Photo[] {
  return images.map((image) => ({ src: image.url, alt: image.alt }));
}

export default async function TheViewPage() {
  const [content, images] = await Promise.all([
    getContent().catch(() => ({}) as Record<string, ContentBlock>),
    getGalleryWithFallback("views"),
  ]);

  const fromDb = content.view;
  const fallback = fallbackContent.view;
  const heading = fromDb?.heading || fallback.heading;
  const body = fromDb?.body || fallback.body;
  const heroImage = fromDb?.image_url ?? viewPhotos[0].src;

  const photos = images.length > 0 ? toPhotos(images) : viewPhotos;

  return (
    <>
      <Header />

      <main id="main">
        <FeaturePageHero
          eyebrow="Outside"
          title={heading}
          body={body}
          imageUrl={heroImage}
          imageAlt="Farmland surrounding the pods at Ballagan Farm"
        />

        <section className="bg-oat-50 py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="What you'll see"
              title="South-facing, and genuinely rural"
              intro="Both pods face south across the farm's own fields, so the light and the outlook are the same wherever you're staying."
            />

            <Reveal delay={0.1}>
              <ul className="mt-8 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  "South-facing decking on both pods",
                  "Sheep and cattle grazing right up to the fence line",
                  "Open, uninterrupted countryside, no other buildings in view",
                  "Loch Lomond and The Trossachs National Park on the doorstep",
                  "Quiet enough to hear the farm wake up",
                  "A different sky every evening",
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
                <p className="eyebrow mb-2 text-lamp-400">See more nearby</p>
                <p className="max-w-lg text-oat-100/75">
                  Loch shores, hill walks and Highland cows are all within half an
                  hour of the farm gate.
                </p>
              </div>
              <ButtonLink href="/whats-nearby" variant="light">
                What&rsquo;s nearby
              </ButtonLink>
            </Reveal>
          </div>
        </section>

        <Contact
          heading="Come and see it for yourself"
          body="The photos only get you so far. Send us a note and we'll get straight back to you about dates."
        />
      </main>

      <Footer />
    </>
  );
}
