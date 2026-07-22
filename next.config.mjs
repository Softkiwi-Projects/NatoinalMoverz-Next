/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow a build to target a fresh output dir (avoids a locked .next held by
  // a separately-running dev server). Defaults to .next when unset.
  distDir: process.env.DIST_DIR || ".next",
  images: {
    // Original assets are pre-generated WordPress uploads served from /public.
    // Disable the optimizer so paths resolve 1:1 and static export stays simple.
    unoptimized: true,
  },
};

export default nextConfig;
