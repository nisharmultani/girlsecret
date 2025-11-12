import Image from 'next/image';
import Link from 'next/link';

export default function Banner({
  imageSrc = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=400&fit=crop',
  imageAlt = 'Promotional Banner',
  title = 'Special Offer',
  subtitle = 'Discover our latest collection',
  buttonText = 'Shop Now',
  buttonLink = '/shop',
  height = 'h-64',
  overlay = true,
  className = ''
}) {
  return (
    <div className={`relative ${height} w-full overflow-hidden bg-black ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for better text readability */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full max-w-xl">
          {subtitle && (
            <p className="text-white/90 text-sm sm:text-base font-medium uppercase tracking-wider mb-2 animate-fade-in">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight animate-slide-up">
              {title}
            </h2>
          )}
          {buttonText && buttonLink && (
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Link
                href={buttonLink}
                className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold text-black bg-white rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {buttonText}
                <svg
                  className="ml-2 w-5 h-5"
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
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
