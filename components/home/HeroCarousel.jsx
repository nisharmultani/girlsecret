import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Default fallback slides if no Airtable data is provided
const defaultSlides = [
  {
    id: 1,
    title: 'Elegance Redefined',
    subtitle: 'Timeless Beauty',
    description: 'Discover intimate apparel designed for confidence and comfort.',
    cta: 'Shop Collection',
    ctaLink: '/shop',
    image: 'https://images.unsplash.com/photo-1583033117486-c930de1eb982?w=1920&h=1080&fit=crop',
  },
  {
    id: 2,
    title: 'Modern Luxury',
    subtitle: 'Premium Collection',
    description: 'Experience the perfect blend of sophistication and comfort.',
    cta: 'Explore Now',
    ctaLink: '/shop?category=Lingerie',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop',
  },
  {
    id: 3,
    title: 'Perfect Fit',
    subtitle: 'Guaranteed',
    description: 'Find your ideal size with our expert fit guide.',
    cta: 'Find Your Fit',
    ctaLink: '/shop?category=Bras',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop',
  },
  {
    id: 4,
    title: 'Confidence',
    subtitle: 'Everyday',
    description: 'Essentials designed to empower you through every moment.',
    cta: 'Shop Essentials',
    ctaLink: '/shop?category=Panties',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop',
  },
];

export default function HeroCarousel({ slides: propSlides }) {
  // Use slides from props, or fallback to default slides
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
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

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section
      className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                {/* Subtitle */}
                <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium uppercase tracking-widest mb-4 animate-fade-in">
                  {slide.subtitle}
                </p>

                {/* Title */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight animate-slide-up">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fade-in">
                  {slide.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold text-black bg-white rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl animate-fade-in"
                >
                  {slide.cta}
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
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 md:p-4 rounded-full transition-all hover:scale-110 border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 md:p-4 rounded-full transition-all hover:scale-110 border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 md:bottom-12 right-4 md:right-8 z-20 text-white/80 text-sm md:text-base font-medium">
        <span className="text-white text-lg md:text-xl">{currentSlide + 1}</span>
        <span className="mx-1">/</span>
        <span>{slides.length}</span>
      </div>
    </section>
  );
}
