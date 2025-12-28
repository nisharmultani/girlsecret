import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

/**
 * LifestyleGrid - Instagram-style grid showcasing lifestyle imagery
 * Perfect for showing products in context, customer photos, or brand storytelling
 * Inspired by Bluebella's social media integration
 */
export default function LifestyleGrid({ images = [] }) {
  // Default images if none provided
  const defaultImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1583033117486-c930de1eb982?w=600&h=600&fit=crop',
      alt: 'Lifestyle image 1',
      link: '/shop',
      tag: '@girlsecret',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop',
      alt: 'Lifestyle image 2',
      link: '/shop',
      tag: '@girlsecret',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop',
      alt: 'Lifestyle image 3',
      link: '/shop',
      tag: '@girlsecret',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop',
      alt: 'Lifestyle image 4',
      link: '/shop',
      tag: '@girlsecret',
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&h=600&fit=crop',
      alt: 'Lifestyle image 5',
      link: '/shop',
      tag: '@girlsecret',
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop',
      alt: 'Lifestyle image 6',
      link: '/shop',
      tag: '@girlsecret',
    },
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gray-500 mb-3">
            Join Our Community
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
            #GirlSecret
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Share your confidence with us. Tag your photos with #GirlSecret for a chance to be featured.
          </p>
        </div>

        {/* Grid - 2 columns mobile, 3 columns desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          {displayImages.map((image) => (
            <LifestyleCard key={image.id} image={image} />
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center">
          <a
            href="https://instagram.com/girlsecret"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold text-base hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @GirlSecret
          </a>
        </div>
      </div>
    </section>
  );
}

// Individual lifestyle card with hover effect
function LifestyleCard({ image }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={image.link || '/shop'}
      className="group relative aspect-square overflow-hidden bg-gray-100 hover:shadow-2xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className={`object-cover transition-all duration-700 ${
          isHovered ? 'scale-110' : 'scale-100'
        } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        sizes="(max-width: 768px) 50vw, 33vw"
        loading="lazy"
        quality={85}
        onLoad={() => setImageLoaded(true)}
      />

      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
      )}

      {/* Overlay on hover */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } flex items-center justify-center`}
      >
        <div className="text-center text-white">
          {image.tag && (
            <p className="text-sm sm:text-base font-semibold mb-2">{image.tag}</p>
          )}
          <p className="text-xs sm:text-sm font-medium">Shop the look</p>
        </div>
      </div>

      {/* Hover border effect */}
      <div
        className={`absolute inset-0 border-4 border-white transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </Link>
  );
}
