/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  images: {
    unoptimized: true,
  },

  trailingSlash: true,
  reactStrictMode: true,
  // Allow a build to target a fresh output dir (avoids a locked .next held by
  // a separately-running dev server). Defaults to .next when unset.
  distDir: process.env.DIST_DIR || ".next",

};

export default nextConfig;
