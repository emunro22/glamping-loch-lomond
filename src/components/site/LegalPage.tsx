import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, intro, updated, children }: Props) {
  return (
    <>
      <Header />
      <main id="main">
        <header className="on-dark bg-dusk pb-16 pt-36 sm:pt-44">
          <div className="container-page">
            <p className="eyebrow mb-5 text-lamp-400">Ballagan Farm Glamping Pods</p>
            <h1 className="max-w-3xl text-balance font-display text-4xl leading-[1.05] text-oat-50 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-oat-100/70">{intro}</p>
            <p className="mt-6 text-sm text-oat-100/45">Last updated {updated}</p>
          </div>
        </header>

        <div className="bg-oat-50 py-16 sm:py-24">
          <article className="container-page max-w-3xl [&>h2]:mb-4 [&>h2]:mt-12 [&>h2]:text-2xl [&>h2:first-child]:mt-0 [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-loch-800/80 [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5 [&>ul]:text-loch-800/80">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <>
      <h2>{heading}</h2>
      {children}
    </>
  );
}
