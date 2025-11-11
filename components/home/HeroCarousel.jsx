import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getOptimizedImageProps } from '../../utils/imageOptimization';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    id: 1,
    title: 'Feel Beautiful',
    subtitle: 'From Within',
    description: 'Discover intimate apparel designed for comfort, confidence, and your unique beauty.',
    cta: 'Shop Now',
    ctaLink: '/shop',
    secondaryCta: 'Find Your Fit',
    secondaryCtaLink: '/about',
    image: "/images/Image1.jpg",
    bgGradient: 'from-rose-50 to-blush-50',
  },
  {
    id: 2,
    title: 'New Collection',
    subtitle: 'Luxe Lace',
    description: 'Exquisite lace designs that make you feel extraordinary every day.',
    cta: 'Explore Collection',
    ctaLink: '/shop?category=Lingerie',
    secondaryCta: null,
    secondaryCtaLink: null,
    image:"/images/image2.jpg" ,
    bgGradient: 'from-purple-50 to-pink-50',
  },
  {
    id: 3,
    title: 'Perfect Fit',
    subtitle: 'Guaranteed',
    description: 'Find your perfect size with our expert fit guide and free exchanges.',
    cta: 'Shop Bras',
    ctaLink: '/shop?category=Bras',
    secondaryCta: 'Size Guide',
    secondaryCtaLink: '/size-guide',
    image:"/images/image3.jpg",
    bgGradient: 'from-blue-50 to-rose-50',
  },
  {
    id: 4,
    title: 'Comfort Meets',
    subtitle: 'Confidence',
    description: 'Everyday essentials designed to support you through every moment.',
    cta: 'Shop Essentials',
    ctaLink: '/shop?category=Panties',
    secondaryCta: null,
    secondaryCtaLink: null,
    image: "/images/image4.jpg",
    bgGradient: 'from-amber-50 to-rose-50',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  // Swipe gesture handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient}`} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 h-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                {/* Text Content */}
                <div className={`animate-fade-in ${index === currentSlide ? 'animate-slide-in' : ''}`}>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-gray-900 mb-4">
                    {s.title}
                    <span className="block text-gradient mt-2">{s.subtitle}</span>
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 max-w-xl">
                    {s.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={s.ctaLink}
                      className="btn-blush text-center inline-flex items-center justify-center"
                    >
                      {s.cta}
                    </Link>
                    {s.secondaryCta && (
                      <Link
                        href={s.secondaryCtaLink}
                        className="btn-secondary text-center inline-flex items-center justify-center"
                      >
                        {s.secondaryCta}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Hero Image with Optimization */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[500px] hidden lg:block">
                  <Image
                    {...getOptimizedImageProps(s.image, index === 0)}
                    alt={`${s.title} ${s.subtitle}`}
                    fill
                    sizes="(max-width: 1024px) 0vw, 50vw"
                    className="object-cover rounded-3xl"
                    quality={90}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-rose-500'
                : 'w-2 bg-white/60 hover:bg-white/80'
            } h-2 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
