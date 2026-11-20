/** @type {import('next').NextConfig} */
const nextConfig = {
  // Short, friendly URL for the private shop preview (see lib/shop/enabled.ts).
  async rewrites() {
    return [{ source: '/preview/:path*', destination: '/shop-preview/:path*' }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.southoblockparty.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-a3656c448d10463daaa2f66d77665216.r2.dev',
      },
    ],
  },
}

module.exports = nextConfig

// Initialize OpenNext for Cloudflare during development
if (process.env.NODE_ENV === 'development') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}
