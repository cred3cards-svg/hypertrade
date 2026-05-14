/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.VERCEL ? ".next" : ".next-live"
};

export default nextConfig;
