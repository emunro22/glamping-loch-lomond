import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";
import { Reveal } from "@/components/ui/Reveal";
import { BlogPostBody } from "@/components/site/BlogPostBody";
import { blogPosts, getBlogPostBySlug } from "@/lib/blogPosts";
import { site } from "@/data/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} | ${site.name}`,
      description: post.metaDescription,
      publishedTime: post.publishDate,
      images: [{ url: post.heroImage.src }],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    image: [new URL(post.heroImage.src, site.url).toString()],
    author: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <Header />

      <main id="main">
        <section className="relative isolate overflow-hidden bg-dusk pt-20">
          <Image
            src={post.heroImage.src}
            alt={post.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-loch-950/70 via-loch-900/80 to-loch-900" />

          <div className="grain relative">
            <div className="container-page py-20 lg:py-28">
              <div className="on-dark max-w-2xl">
                <Reveal>
                  <Link
                    href="/blog"
                    className="eyebrow inline-flex items-center gap-2 text-lamp-400 transition-colors hover:text-lamp-300"
                  >
                    ← Back to the blog
                  </Link>
                </Reveal>

                <Reveal delay={0.08}>
                  <p className="eyebrow mt-6 text-lamp-400">{post.category}</p>
                  <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-oat-50 sm:text-5xl">
                    {post.title}
                  </h1>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="mt-6 text-sm text-oat-100/55">
                    {formatDate(post.publishDate)}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="h-16 bg-gradient-to-b from-transparent to-oat-50" />
        </section>

        <div className="bg-oat-50 py-16 sm:py-24">
          <article className="container-page">
            <BlogPostBody body={post.body} />
          </article>
        </div>

        <Contact
          heading="Come and stay"
          body="Ready to see it for yourself? Send us a note and we'll get straight back to you."
        />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
