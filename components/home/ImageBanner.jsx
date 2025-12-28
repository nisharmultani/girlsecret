import Link from 'next/link';
import Image from 'next/image';

/**
 * ImageBanner - Full-width promotional banner with image and optional text overlay
 * Perfect for campaigns, sales, seasonal promotions
 * Inspired by Victoria's Secret campaign banners
 */
export default function ImageBanner({
  imageSrc,
  imageAlt = 'Promotional Banner',
  title,
  subtitle,
  ctaText,
  ctaLink,
  height = 'h-[400px] md:h-[500px]',
  overlay = 'medium', // 'none', 'light', 'medium', 'dark'
  textPosition = 'center', // 'left', 'center', 'right'
  textColor = 'white', // 'white', 'black'
}) {
  const overlayClasses = {
    none: '',
    light: 'bg-black/20',
    medium: 'bg-black/40',
    dark: 'bg-black/60',
  };

  const positionClasses = {
    left: 'items-center justify-start text-left',
    center: 'items-center justify-center text-center',
    right: 'items-center justify-end text-right',
  };

  const textColorClass = textColor === 'white' ? 'text-white' : 'text-gray-900';

  return (
    <section className="relative overflow-hidden">
      <div className={`relative w-full ${height}`}>
        {/* Background Image */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          quality={90}
          priority
        />

        {/* Overlay */}
        {overlay !== 'none' && (
          <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
        )}

        {/* Content */}
        {(title || subtitle || ctaText) && (
          <div className={`relative z-10 h-full flex ${positionClasses[textPosition]} px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-7xl w-full">
              <div className={textPosition === 'center' ? 'max-w-3xl mx-auto' : 'max-w-2xl'}>
                {/* Subtitle */}
                {subtitle && (
                  <p className={`text-xs sm:text-sm font-semibold tracking-widest uppercase ${textColorClass} opacity-90 mb-3 sm:mb-4`}>
                    {subtitle}
                  </p>
                )}

                {/* Title */}
                {title && (
                  <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold ${textColorClass} mb-4 sm:mb-6 leading-tight`}>
                    {title}
                  </h2>
                )}

                {/* CTA */}
                {ctaText && ctaLink && (
                  <Link
                    href={ctaLink}
                    className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 ${
                      textColor === 'white'
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-black text-white hover:bg-gray-800'
                    } font-semibold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95`}
                  >
                    {ctaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
