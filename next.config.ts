import type { NextConfig } from 'next';

// Static export: the dashboard is a client-side app that talks to the Task Manager API,
// so it can be hosted on GitHub Pages, Vercel, Netlify or any static host.
// For GitHub Pages project sites, set NEXT_PUBLIC_BASE_PATH=/repository-name at build time.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default nextConfig;
