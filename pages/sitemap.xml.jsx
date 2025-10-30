import { getAllProducts } from '../lib/airtable';

/**
 * Dynamic Sitemap Generator
 *
 * This generates a sitemap.xml file dynamically based on your products
 * and static pages. It helps search engines discover all your pages.
 *
 * The sitemap is regenerated on each request in production with ISR.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com';

function generateSiteMap(products) {
  const staticPages = [
    { url: '', changefreq: 'daily', priority: 1.0 },
    { url: '/shop', changefreq: 'daily', priority: 0.9 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/faq', changefreq: 'monthly', priority: 0.6 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
     ${staticPages
       .map(({ url, changefreq, priority }) => {
         return `
       <url>
           <loc>${SITE_URL}${url}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>${changefreq}</changefreq>
           <priority>${priority}</priority>
       </url>
     `;
       })
       .join('')}
     ${products
       .map((product) => {
         const images = product.images || [];
         const imageXml = images
           .slice(0, 5)
           .map(
             (img) => `
           <image:image>
               <image:loc>${img}</image:loc>
               <image:title>${product.name}</image:title>
           </image:image>`
           )
           .join('');

         return `
       <url>
           <loc>${SITE_URL}/products/${product.slug}</loc>
           <lastmod>${new Date(product.updatedAt || Date.now()).toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>${imageXml}
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch all products
    const products = await getAllProducts();

    // Generate the XML sitemap
    const sitemap = generateSiteMap(products);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
}

// Default export to prevent Next.js errors
export default function Sitemap() {
  return null;
}
