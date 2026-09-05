import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { FeatureSection } from "@/components/site/FeatureSection";
import { PodShowcase } from "@/components/site/PodShowcase";
import { ThingsToDo } from "@/components/site/ThingsToDo";
import { Gallery } from "@/components/site/Gallery";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getContent, type ContentBlock } from "@/lib/db";
import { getPodsWithFallback } from "@/lib/pods";
import { getGalleryWithFallback } from "@/lib/gallery";
import { getAvailabilitySummary } from "@/lib/availability";
import {
  heroPhoto,
  exteriorPhotos,
  insidePhotos,
  bbqHutPhotos,
  thistleHotTubPhotos,
  viewPhotos,
} from "@/data/media";
import { fallbackContent } from "@/data/content";

export const revalidate = 60;

function block(
  content: Record<string, ContentBlock>,
  key: string,
  fallbackImage: string | null = null,
): { heading: string; body: string; image: string | null } {
  const fromDb = content[key];
  const fallback = fallbackContent[key] ?? { heading: "", body: "" };
  return {
    heading: fromDb?.heading || fallback.heading,
    body: fromDb?.body || fallback.body,
    image: fromDb?.image_url ?? fallbackImage,
  };
}

export default async function HomePage() {
  // The site must still render if the database is unreachable.
  const [content, podRecords, images, availability] = await Promise.all([
    getContent().catch(() => ({}) as Record<string, ContentBlock>),
    getPodsWithFallback(),
    getGalleryWithFallback(),
    getAvailabilitySummary(),
  ]);

  const hero = block(content, "hero", heroPhoto.src);
  const about = block(content, "about");
  const pod = block(content, "pod", exteriorPhotos[2].src);
  const inside = block(content, "inside", insidePhotos[0].src);
  const bbq = block(content, "bbq", bbqHutPhotos[0].src);
  const extras = block(content, "extras", thistleHotTubPhotos[0].src);
  const view = block(content, "view", viewPhotos[0].src);
  const contact = block(content, "contact");

  return (
    <>
      <Header />

      <main id="main">
        <Hero
          heading={hero.heading}
          body={hero.body}
          imageUrl={hero.image}
          imageAlt={heroPhoto.alt}
        />

        {/* Welcome: narrow measure, no image, lets the page breathe after the hero */}
        <section id="about" className="bg-oat-50 py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading
              eyebrow="Ballagan Farm"
              title={about.heading}
              align="center"
            />
            <Reveal delay={0.1} className="mx-auto mt-8 max-w-2xl text-center">
              <p className="text-lg leading-relaxed text-loch-800/75">
                {about.body}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-loch-800/75">
                After seven years of planning, building and dreaming, we opened
                the first of our two pods. Whether it&rsquo;s a romantic break or
                a relaxed family getaway, everything you need is already here.
              </p>
            </Reveal>
          </div>
          <div className="container-page mt-16">
            <div className="rule-fade" />
          </div>
        </section>

        <FeatureSection
          id="the-pod"
          eyebrow="The pod"
          heading={pod.heading}
          body={pod.body}
          imageUrl={pod.image}
          imageAlt="A glamping pod at Ballagan Farm"
          points={[
            "Own electricity and water supply",
            "Double bed and double sofa bed",
            "En-suite with walk-in shower",
            "Fully furnished throughout",
          ]}
        />

        <FeatureSection
          id="inside"
          eyebrow="Inside"
          heading={inside.heading}
          body={inside.body}
          imageUrl={inside.image}
          imageAlt="Inside a glamping pod, showing the kitchen and living space"
          flip
          tone="loch"
          points={[
            "Air fryer, kettle, toaster and all crockery",
            "Two-ring cooker top (Thistle) or electric frying pan (Rose)",
            "Bedding and towels included",
            "Robes and slippers waiting for you",
          ]}
        />

        <PodShowcase pods={podRecords} availability={availability} />

        <FeatureSection
          id="bbq-hut"
          eyebrow="Exclusive to the Rose Pod"
          heading={bbq.heading}
          body={bbq.body}
          imageUrl={bbq.image}
          imageAlt="The Scandinavian-style BBQ hut"
          points={[
            "Central charcoal grill with chimney",
            "Circular dining table and bench seating",
            "Prep area with fridge and utensils",
            "Marshmallows and toasting sticks provided",
          ]}
          footnote="The BBQ hut can be added to your stay for an additional cost, so get in touch to secure it for your dates."
          moreHref="/bbq-hut"
        />

        <FeatureSection
          id="extras"
          eyebrow="Outside every pod"
          heading={extras.heading}
          body={extras.body}
          imageUrl={extras.image}
          imageAlt="The Thistle Pod's hot tub, bubbling under its covered gazebo"
          flip
          tone="loch"
          points={[
            "Every pod has its own hot tub",
            "Rose: open to the sky. Thistle: under a covered gazebo",
            "Sauna exclusive to the Thistle Pod",
            "Towels and robes provided",
          ]}
          moreHref="/hot-tub-sauna"
        />

        <FeatureSection
          id="view"
          eyebrow="Outside"
          heading={view.heading}
          body={view.body}
          imageUrl={view.image}
          imageAlt="The view south from the pods across open countryside"
          moreHref="/the-view"
        />

        <ThingsToDo />

        <Gallery images={images} />

        <FAQ />

        <Contact heading={contact.heading} body={contact.body} />
      </main>

      <Footer />
    </>
  );
}
