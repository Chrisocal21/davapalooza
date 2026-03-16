/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.southoblockparty.com',
      },
    ],
  },
}

module.exports = nextConfig
