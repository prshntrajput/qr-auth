/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // Using pages directory
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;