/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Output mandiri untuk self-host di VPS (pm2 cluster). Menghasilkan
  // .next/standalone/server.js — server Node ringan yang bisa dijalankan
  // banyak worker (cluster) agar semua core KVM 8 terpakai.
  output: "standalone",
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
