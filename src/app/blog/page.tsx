import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBlogPostsSorted } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from Ballagan Farm: our pods, what's nearby, and life on a working farm at Loch Lomond, Scotland's first National Park.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getBlogPostsSorted();

  return (
    <>
      <Header />

      <main id="main">
        <header className="on-dark bg-dusk pb-16 pt-36 sm:pt-44">
          <div className="container-page">
            <p className="eyebrow mb-5 text-lamp-400">Ballagan Farm Glamping Pods</p>
            <h1 className="max-w-3xl text-balance font-display text-4xl leading-[1.05] text-oat-50 sm:text-5xl">
              Notes from the farm
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-oat-100/70">
              Our pods, what's on the doorstep, and life on a working farm at Loch
              Lomond.
            </p>
          </div>
        </header>

        <section className="bg-oat-50 py-16 sm:py-24">
          <div className="container-page">
            <SectionHeading title="Latest posts" className="mb-14" />

            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={(i % 2) * 0.06} as="article">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-pod bg-loch-100">
                      <Image
                        src={post.heroImage.src}
                        alt={post.heroImage.alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="eyebrow mt-5 text-lamp-600">{post.category}</p>
                    <h2 className="mt-2 text-balance text-2xl leading-tight text-loch-900 transition-colors group-hover:text-lamp-600">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-loch-800/70">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-sm text-loch-800/50">
                      {formatDate(post.publishDate)}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
