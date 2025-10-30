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

export const generateProductSchema = (product, reviews = []) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com';

  const schema = {
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
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'GirlSecret',
      },
    },
  };

  // Add aggregate rating if reviews exist
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };

    // Add individual reviews (max 10 for performance)
    schema.review = reviews.slice(0, 10).map((review) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Person',
        name: review.name || 'Anonymous',
      },
      datePublished: review.date,
      reviewBody: review.comment,
    }));
  }

  return schema;
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

/**
 * Generate FAQ Page Schema
 * Use this on your FAQ page to help search engines display rich results
 */
export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate Article Schema
 * Use this for blog posts or articles
 */
export const generateArticleSchema = (article) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'GirlSecret',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GirlSecret',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };
};

/**
 * Generate Local Business Schema
 * Use this if you have a physical store location
 */
export const generateLocalBusinessSchema = (business) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: business.name || 'GirlSecret',
    image: business.image,
    '@id': business.url,
    url: business.url,
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address?.street,
      addressLocality: business.address?.city,
      addressRegion: business.address?.state,
      postalCode: business.address?.zip,
      addressCountry: business.address?.country || 'US',
    },
    geo: business.coordinates && {
      '@type': 'GeoCoordinates',
      latitude: business.coordinates.lat,
      longitude: business.coordinates.lng,
    },
    openingHoursSpecification: business.hours || [],
  };
};
