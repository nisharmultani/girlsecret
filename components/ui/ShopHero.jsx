import Image from 'next/image';
import Link from 'next/link';

export default function ShopHero({
  imageSrc = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop',
  title = 'New Collection',
  subtitle = 'Discover Your Perfect Style',
  description = 'Explore our latest arrivals and exclusive designs',
  ctaText = 'Shop Now',
  ctaLink = '/shop',
  badge = null, // e.g., "Sale", "New", "Limited Time"
  height = 'h-[400px] md:h-[500px] lg:h-[600px]',
  textAlign = 'left', // 'left', 'center', 'right'
  darkOverlay = true,
}) {
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  const contentAlignment = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <section className={`relative ${height} w-full overflow-hidden bg-black`}>
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        priority
        quality={90}
      />

      {/* Overlay */}
      {darkOverlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      )}

      {/* Content */}
      <div className={`relative z-10 h-full flex ${contentAlignment[textAlign]}`}>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`h-full flex flex-col ${alignmentClasses[textAlign]} justify-center max-w-2xl`}>
            {/* Badge */}
            {badge && (
              <div className="mb-4">
                <span className="inline-block bg-white text-black text-xs font-bold px-4 py-2 uppercase tracking-wider">
                  {badge}
                </span>
              </div>
            )}

            {/* Subtitle */}
            {subtitle && (
              <p className="text-white/90 text-sm md:text-base font-medium mb-3 tracking-wide uppercase">
                {subtitle}
              </p>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-white/80 text-base md:text-lg mb-6 md:mb-8 max-w-xl leading-relaxed">
                {description}
              </p>
            )}

            {/* CTA Button */}
            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-center bg-white text-black px-8 py-4 font-bold text-sm md:text-base uppercase tracking-wide hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator (optional) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-xs uppercase tracking-wide">Scroll</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
