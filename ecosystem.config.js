// PM2 — Ade Green TX Web (Next.js standalone) untuk VPS Hostinger KVM 8.
//
// CARA DEPLOY (jalankan di tiap KVM, dari folder project):
//   1) npm ci
//   2) npm run build           # build + auto-salin static/public/.env ke standalone
//   3) pm2 start ecosystem.config.js   (atau: pm2 reload ecosystem.config.js)
//   4) pm2 save
//
// Cluster mode menjalankan banyak worker yang berbagi port 3002, sehingga
// semua core terpakai. Reverse-proxy (nginx) / load balancer cukup mengarah
// ke 127.0.0.1:3002 (atau IP VPS:3002). Pastikan port 3002 difirewall agar
// tidak terbuka ke publik (mis. ufw allow dari IP LB saja).
module.exports = {
  apps: [
    {
      name: "ade-green-taxi",
      // Server hasil `output: "standalone"` (server Node murni -> bisa cluster).
      script: ".next/standalone/server.js",
      cwd: "/home/debian/ade-green-taxi",

      exec_mode: "cluster",
      instances: -1, // semua core, sisakan 1 untuk OS/nginx (KVM 8 -> 7 worker)

      max_memory_restart: "1G", // restart worker bila > 1 GB (cegah OOM)
      autorestart: true,
      kill_timeout: 8000, // beri waktu request berjalan selesai saat reload/stop
      listen_timeout: 10000, // ambang dianggap gagal start
      max_restarts: 10,
      restart_delay: 3000,

      merge_logs: true, // gabungkan log antar-worker cluster
      time: true, // timestamp di log

      env: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
