/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Output mandiri untuk self-host di VPS (pm2 cluster). Menghasilkan
  // .next/standalone/server.js — server Node ringan yang bisa dijalankan
  // banyak worker (cluster) agar semua core KVM 8 terpakai.
  output: "standalone",
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
