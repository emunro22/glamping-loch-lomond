import Link from "next/link";

export default function NotFound() {
  return (
    <main className="on-dark grid min-h-screen place-items-center bg-dusk px-6 text-center">
      <div>
        <p className="eyebrow mb-5 text-lamp-400">404</p>
        <h1 className="font-display text-4xl text-oat-50 sm:text-5xl">
          That page isn&rsquo;t here
        </h1>
        <p className="mx-auto mt-5 max-w-md text-oat-100/70">
          It may have moved when we rebuilt the site. The pods are still
          exactly where you left them.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex rounded-full bg-lamp-500 px-7 py-3.5 text-sm font-semibold text-loch-950 transition-colors hover:bg-lamp-400"
        >
          Back to the pods
        </Link>
      </div>
    </main>
  );
}
