import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "www.glampinglochlomond.co.uk" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/footer/terms-of-use", destination: "/terms-of-use", permanent: true },
      { source: "/footer/privacy-policy", destination: "/privacy-policy", permanent: true },
      { source: "/book-now", destination: "/#book", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/things-to-do", destination: "/#things-to-do", permanent: true },
      { source: "/bbq-hut", destination: "/#bbq-hut", permanent: true },
      { source: "/gallery", destination: "/#gallery", permanent: true },
    ];
  },
};

export default nextConfig;
