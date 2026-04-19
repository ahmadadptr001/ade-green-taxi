module.exports = {
  apps: [
    {
      name: "ade-green-taxi",
      script: "npm",
      args: "start",
      cwd: "/home/debian/ade-green-taxi",
      // cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};
