import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * CollectionSpotlight - Large image section highlighting a collection
 * Inspired by Victoria's Secret and Bluebella collection showcases
 *
 * @param {Object} props
 * @param {string} props.title - Collection title
 * @param {string} props.subtitle - Collection subtitle/tagline
 * @param {string} props.description - Collection description
 * @param {string} props.imageSrc - Large hero image URL
 * @param {string} props.ctaText - Call to action button text
 * @param {string} props.ctaLink - Call to action link
 * @param {string} props.imagePosition - 'left' or 'right' for image placement
 * @param {string} props.theme - 'light' or 'dark' for text color
 */
export default function CollectionSpotlight({
  title,
  subtitle,
  description,
  imageSrc,
  ctaText = 'Shop Collection',
  ctaLink = '/shop',
  imagePosition = 'left',
  theme = 'dark',
}) {
  const isImageLeft = imagePosition === 'left';
  const isDark = theme === 'dark';

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Desktop: Side-by-side layout */}
        <div className={`flex flex-col lg:flex-row ${isImageLeft ? '' : 'lg:flex-row-reverse'} items-stretch`}>
          {/* Image Section - 60% width on desktop */}
          <div className="relative w-full lg:w-3/5 h-[400px] md:h-[500px] lg:h-[600px]">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              quality={90}
              priority
            />

            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content Section - 40% width on desktop */}
          <div className={`flex items-center w-full lg:w-2/5 ${isDark ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="px-6 sm:px-8 lg:px-12 xl:px-16 py-12 md:py-16 lg:py-20">
              {/* Subtitle/Tag */}
              {subtitle && (
                <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gray-500 mb-3">
                  {subtitle}
                </p>
              )}

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                {title}
              </h2>

              {/* Description */}
              {description && (
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 lg:mb-8 leading-relaxed max-w-xl">
                  {description}
                </p>
              )}

              {/* CTA Button */}
              <Link
                href={ctaLink}
                className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                {ctaText}
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
