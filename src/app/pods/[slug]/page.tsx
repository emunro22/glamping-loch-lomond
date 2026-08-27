import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";
import { PodHero } from "@/components/site/PodHero";
import { PodSection } from "@/components/site/PodSection";
import { LocationMap } from "@/components/site/LocationMap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getPodBySlug, getPodsWithFallback } from "@/lib/pods";
import { getContent, type ContentBlock, type GalleryImage } from "@/lib/db";
import { getGalleryWithFallback } from "@/lib/gallery";
import { getAvailabilitySummary } from "@/lib/availability";
import { pods as podDefs, site } from "@/data/site";
import { fallbackContent } from "@/data/content";
import type { Photo } from "@/data/media";

/** Gallery rows (admin-editable) shaped for the static-photo props the gallery grid expects. */
function toPhotos(images: GalleryImage[]): Photo[] {
  return images.map((image) => ({ src: image.url, alt: image.alt }));
}

export const revalidate = 60;

export function generateStaticParams() {
  return podDefs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pod = await getPodBySlug(slug);
  if (!pod) return {};

  const description = `${pod.tagline}. Sleeps ${pod.sleeps}, en-suite with a walk-in shower, on our family farm at Loch Lomond.`;

  return {
    title: pod.name,
    description,
    alternates: { canonical: `/pods/${pod.slug}` },
    openGraph: {
      title: `${pod.name} | ${site.name}`,
      description,
      images: pod.hero_image ? [{ url: pod.hero_image }] : undefined,
    },
  };
}

function block(
  content: Record<string, ContentBlock>,
  key: string,
): { heading: string; body: string } {
  const fromDb = content[key];
  const fallback = fallbackContent[key] ?? { heading: "", body: "" };
  return {
    heading: fromDb?.heading || fallback.heading,
    body: fromDb?.body || fallback.body,
  };
}

export default async function PodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [
    pod,
    allPods,
    content,
    availability,
    insideImages,
    podImages,
    bbqImages,
    hotTubImages,
    saunaImages,
    viewImages,
  ] = await Promise.all([
    getPodBySlug(slug),
    getPodsWithFallback(),
    getContent().catch(() => ({}) as Record<string, ContentBlock>),
    getAvailabilitySummary(),
    getGalleryWithFallback("inside"),
    getGalleryWithFallback(slug),
    getGalleryWithFallback("bbq hut"),
    getGalleryWithFallback(`${slug} hot tub`),
    getGalleryWithFallback("sauna"),
    getGalleryWithFallback("views"),
  ]);

  if (!pod) notFound();

  const isRose = pod.slug === "rose";
  const isThistle = pod.slug === "thistle";
  const otherPod = allPods.find((p) => p.slug !== pod.slug && p.is_active);

  // This pod's own photos first, then the shared inside-the-pod set.
  const insidePhotos = [...toPhotos(podImages), ...toPhotos(insideImages)];
  const bbqHutPhotos = toPhotos(bbqImages);
  const extrasPhotos = isThistle
    ? [...toPhotos(hotTubImages), ...toPhotos(saunaImages)]
    : toPhotos(hotTubImages);
  const viewPhotos = toPhotos(viewImages);

  const inside = block(content, "inside");
  const bbq = block(content, "bbq");
  const view = block(content, "view");
  const contact = block(content, "contact");

  return (
    <>
      <Header />

      <main id="main">
        <PodHero pod={pod} availability={availability?.[pod.slug]} />

        <PodSection
          id="pod-inside"
          eyebrow="Inside"
          heading={inside.heading}
          body={inside.body}
          points={pod.features}
          photos={insidePhotos}
        />

        {isRose ? (
          <PodSection
            id="pod-bbq"
            eyebrow="Exclusive to the Rose Pod"
            heading={bbq.heading}
            body={bbq.body}
            points={[
              "Central charcoal grill with chimney",
              "Circular dining table and bench seating",
              "Prep area with fridge and utensils",
              "Marshmallows and toasting sticks provided",
            ]}
            photos={bbqHutPhotos}
            footnote="Included with the Rose Pod — just let us know you'd like to use it for your stay."
            tone="loch"
          />
        ) : (
          <section className="bg-loch-900 py-14 on-dark">
            <div className="container-page">
              <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-oat-50/12 bg-loch-950/40 px-8 py-8 sm:px-10">
                <div>
                  <p className="eyebrow mb-2 text-lamp-400">Fancy a BBQ?</p>
                  <p className="max-w-lg text-oat-100/75">
                    Our Scandinavian-style BBQ hut comes exclusively with the
                    Rose Pod.
                  </p>
                </div>
                <ButtonLink href="/pods/rose" variant="light">
                  See the Rose Pod
                </ButtonLink>
              </Reveal>
            </div>
          </section>
        )}

        {isThistle ? (
          <PodSection
            id="pod-extras"
            eyebrow="Exclusive to the Thistle Pod"
            heading="Hot tub & sauna"
            body="The Thistle Pod has its own hot tub, set under a covered gazebo, and sole access to our Scandinavian barrel sauna — both a few steps from your door."
            points={[
              "Private hot tub under a covered gazebo",
              "Exclusive access to the barrel sauna",
              "Ready and up to temperature on arrival",
              "Towels and robes provided",
            ]}
            photos={extrasPhotos}
            footnote="Get in touch for availability — we'll have it ready before you arrive."
          />
        ) : (
          <PodSection
            id="pod-extras"
            eyebrow="Exclusive to the Rose Pod"
            heading="Your own hot tub"
            body="The Rose Pod has its own hot tub, right out on the decking under the open sky — up to temperature and ready before you arrive."
            points={[
              "Private hot tub, open to the sky",
              "Ready and up to temperature on arrival",
              "Towels and robes provided",
              "Right on your own decking",
            ]}
            photos={extrasPhotos}
            footnote="Fancy a sauna too? That one's exclusive to the Thistle Pod."
          />
        )}

        <PodSection
          id="pod-view"
          eyebrow="Outside"
          heading={view.heading}
          body={view.body}
          photos={viewPhotos}
          tone="loch"
        />

        <section className="bg-oat-50 py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="Getting here"
              title="Find your way to Ballagan Farm"
              intro={`${site.address.line1}, ${site.address.line2}, ${site.address.region}, ${site.address.postcode}. Once you're booked, we'll send full directions for the last stretch of farm track.`}
            />
            <Reveal delay={0.1} className="mt-10">
              <LocationMap tone="light" />
            </Reveal>
            <Reveal delay={0.15} className="mt-8">
              <Link
                href="/whats-nearby"
                className="inline-flex items-center gap-2 text-sm font-semibold text-lamp-600 transition-colors hover:text-lamp-500"
              >
                See what's nearby
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          </div>
        </section>

        {otherPod ? (
          <section className="bg-oat-100 py-16">
            <div className="container-page">
              <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-oat-50 px-8 py-8 ring-1 ring-loch-900/8 sm:px-10">
                <div>
                  <p className="eyebrow mb-2 text-lamp-600">The other pod</p>
                  <p className="max-w-lg text-loch-800/75">
                    Have a look at {otherPod.name} too — {otherPod.tagline.toLowerCase()}.
                  </p>
                </div>
                <ButtonLink href={`/pods/${otherPod.slug}`} variant="outline">
                  See {otherPod.name.replace("The ", "")}
                </ButtonLink>
              </Reveal>
            </div>
          </section>
        ) : null}

        <Contact heading={contact.heading} body={contact.body} />
      </main>

      <Footer />
    </>
  );
}
