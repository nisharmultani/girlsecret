/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Product/blog pages hit the database during static generation; keeping
  // a generous budget here in case many pages build in parallel.
  staticPageGenerationTimeout: 180,
  images: {
    domains: [
      'images.unsplash.com',
      'unsplash.com',
      'res.cloudinary.com', // For demo images
      'picsum.photos', // Placeholder images used by supabase/seed.sql
      // Temporary: some product rows still carry old Airtable attachment
      // URLs, which are signed and expire - these are already failing to
      // load and need re-uploading somewhere permanent (e.g. Cloudinary).
      // Remove this once no product/review images reference Airtable.
      'v5.airtableusercontent.com',
      'dl.airtable.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  swcMinify: true,
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable compression
  compress: true,
  // Optimize fonts
  optimizeFonts: true,
}

module.exports = nextConfig
