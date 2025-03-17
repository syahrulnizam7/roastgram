import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    APIFY_API_TOKEN: process.env.APIFY_API_TOKEN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Konfigurasi lainnya
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "instagram.com",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "scontent-*.com",
      },
      {
        protocol: "https",
        hostname: "**.instagram.com",
      },
    ],
    // Izinkan gambar dari domain apapun (alternatif jika masih bermasalah)
    // domains: ['*'],
    // ATAU gunakan unoptimized
    unoptimized: true,
  },
};

export default nextConfig;
