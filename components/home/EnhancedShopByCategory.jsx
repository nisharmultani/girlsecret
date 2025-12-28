import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

/**
 * EnhancedShopByCategory - Image-rich category navigation
 * Shows categories with large, beautiful images
 * Inspired by Victoria's Secret and Bluebella category showcases
 */
export default function EnhancedShopByCategory() {
  const categories = [
    {
      id: 1,
      name: 'Bras',
      slug: 'Bras',
      description: 'Find your perfect fit',
      image: 'https://images.unsplash.com/photo-1583033117486-c930de1eb982?w=800&h=1000&fit=crop',
      badge: 'New Arrivals',
    },
    {
      id: 2,
      name: 'Panties',
      slug: 'Panties',
      description: 'Everyday comfort & style',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop',
    },
    {
      id: 3,
      name: 'Lingerie',
      slug: 'Lingerie',
      description: 'Elegant & seductive',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop',
      badge: 'Trending',
    },
    {
      id: 4,
      name: 'Sleepwear',
      slug: 'Sleepwear',
      description: 'Luxurious relaxation',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gray-500 mb-3">
            Explore Our Collections
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover intimate apparel designed for every moment of your life
          </p>
        </div>

        {/* Category Grid - 2 columns mobile, 4 columns desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
        )}

        {/* Image */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          className={`object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 768px) 50vw, 25vw"
          loading="lazy"
          quality={85}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay - stronger on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-80' : 'opacity-60'
          }`}
        />

        {/* Badge (if exists) */}
        {category.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white text-black text-xs font-bold px-3 py-1 shadow-lg">
              {category.badge}
            </span>
          </div>
        )}
      </div>

      {/* Content - Overlaid on image */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
        <h3
          className={`text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mb-1 md:mb-2 transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-0'
          }`}
        >
          {category.name}
        </h3>

        <p
          className={`text-sm md:text-base text-white/90 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-1'
          }`}
        >
          {category.description}
        </p>

        {/* Shop Now indicator - appears on hover */}
        <div
          className={`flex items-center mt-3 text-white font-semibold text-sm transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}
        >
          <span>Shop Now</span>
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>

      {/* Animated border on hover */}
      <div
        className={`absolute inset-0 border-2 border-white transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 scale-95' : 'opacity-0 scale-100'
        }`}
      />
    </Link>
  );
}
