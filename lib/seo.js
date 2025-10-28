// SEO utilities and metadata

export const defaultSEO = {
  title: 'GirlSecret - Luxury Beauty & Lifestyle',
  description: 'Discover premium beauty products and luxurious lifestyle essentials at GirlSecret. Quality, elegance, and sophistication in every product.',
  keywords: 'luxury beauty, premium skincare, lifestyle products, beauty essentials, luxury cosmetics, women beauty products',
  ogImage: '/og-image.jpg',
  twitterHandle: '@girlsecret',
};

export const generatePageSEO = (page) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com';

  return {
    title: page.title ? `${page.title} | GirlSecret` : defaultSEO.title,
    description: page.description || defaultSEO.description,
    keywords: page.keywords || defaultSEO.keywords,
    canonical: `${baseUrl}${page.path || ''}`,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${baseUrl}${page.path || ''}`,
      site_name: 'GirlSecret',
      title: page.title || defaultSEO.title,
      description: page.description || defaultSEO.description,
      images: [
        {
          url: page.image || `${baseUrl}${defaultSEO.ogImage}`,
          width: 1200,
          height: 630,
          alt: page.title || defaultSEO.title,
        },
      ],
    },
    twitter: {
      handle: defaultSEO.twitterHandle,
      site: defaultSEO.twitterHandle,
      cardType: 'summary_large_image',
    },
  };
};

export const generateProductSchema = (product) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com';

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map(img => img.url || img.thumbnails?.large?.url) || [],
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'GirlSecret',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.salePrice || product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
};

export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateOrganizationSchema = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GirlSecret',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://www.facebook.com/girlsecret',
      'https://www.instagram.com/girlsecret',
      'https://www.twitter.com/girlsecret',
      'https://www.pinterest.com/girlsecret',
    ],
  };
};
