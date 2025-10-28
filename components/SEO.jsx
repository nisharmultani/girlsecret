import Head from 'next/head';
import { generatePageSEO } from '../lib/seo';

export default function SEO({ page = {} }) {
  const seo = generatePageSEO(page);

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={seo.openGraph.type} />
      <meta property="og:locale" content={seo.openGraph.locale} />
      <meta property="og:url" content={seo.openGraph.url} />
      <meta property="og:site_name" content={seo.openGraph.site_name} />
      <meta property="og:title" content={seo.openGraph.title} />
      <meta property="og:description" content={seo.openGraph.description} />
      {seo.openGraph.images.map((image, index) => (
        <meta key={index} property="og:image" content={image.url} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content={seo.twitter.cardType} />
      <meta name="twitter:site" content={seo.twitter.site} />
      <meta name="twitter:creator" content={seo.twitter.handle} />
      <meta name="twitter:title" content={seo.openGraph.title} />
      <meta name="twitter:description" content={seo.openGraph.description} />
      {seo.openGraph.images[0] && (
        <meta name="twitter:image" content={seo.openGraph.images[0].url} />
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Theme Color */}
      <meta name="theme-color" content="#c35d3f" />
    </Head>
  );
}
