/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Assets are stored with .jpg names but webp bytes; skip optimizer to avoid
    // format mismatch and keep the app dependency-light for self-hosting.
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
