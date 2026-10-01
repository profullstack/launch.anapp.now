import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The image runs the standalone server under Bun (`bun server.js`): it bundles
  // the server and only the dependencies it actually imports.
  output: "standalone",
  // Trace from this directory, never a lockfile further up the disk, so
  // server.js always lands at the top of .next/standalone.
  outputFileTracingRoot: new URL(".", import.meta.url).pathname,
  // The OG/Twitter cards read this font from node_modules at request time
  // (process.cwd() path, invisible to the tracer); without it they silently
  // fall back to the default font.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./node_modules/geist/dist/fonts/geist-sans/Geist-Black.ttf"],
    "/twitter-image": ["./node_modules/geist/dist/fonts/geist-sans/Geist-Black.ttf"],
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 768, 1024, 1280, 1600],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/marketing/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, immutable" }],
      },
    ];
  },
};

export default nextConfig;
