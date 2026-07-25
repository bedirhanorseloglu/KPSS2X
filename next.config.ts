import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  compress: true, // Gzip/Brotli sıkıştırması — Vercel bant genişliğini %60-70 korur
  trailingSlash: true,
  outputFileTracingRoot: projectDir,
  turbopack: {
    root: projectDir,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*.(png|jpg|jpeg|gif|webp|avif|ico|svg|woff|woff2|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
