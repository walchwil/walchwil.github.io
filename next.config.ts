import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This mirror is intentionally static: every page can be served directly by
  // GitHub Pages, without the original Cloudflare/Sites runtime.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
