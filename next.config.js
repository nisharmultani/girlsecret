/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'dl.airtable.com',
      'v5.airtableusercontent.com',
      'images.unsplash.com', // For demo images
    ],
    formats: ['image/avif', 'image/webp'],
  },
  swcMinify: true,
}

module.exports = nextConfig
