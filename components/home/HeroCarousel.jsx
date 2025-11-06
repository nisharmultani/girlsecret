import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import image1 from "@/public/images/Image1.jpg"
// import image2 from "../../public/images/Image2.jpg"
// import image3 from "../../public/images/Image3.jpg"
// import image4 from "../../public/images/Image4.jpg"


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

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden bg-black">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((s, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110'
              }`}
            >
              {/* Stunning gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient}`} />

              {/* Multiple animated decorative elements for depth */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-400/30 rounded-full blur-3xl animate-float"
                     style={{ animationDelay: '0s', animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blush-400/25 rounded-full blur-3xl animate-float"
                     style={{ animationDelay: '1s', animationDuration: '10s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-luxury-400/20 rounded-full blur-3xl animate-pulse-soft" />

                {/* Sparkle effects */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse-soft" />
                <div className="absolute top-40 right-40 w-1 h-1 bg-white rounded-full animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />
              </div>

              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 h-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full min-h-[500px] md:min-h-[600px]">
                  {/* Text Content with stunning entrance animations */}
                  <div className={`transition-all duration-1000 ${
                    isActive
                      ? 'opacity-100 translate-x-0 translate-y-0'
                      : 'opacity-0 -translate-x-20 translate-y-10'
                  }`}
                  style={{ transitionDelay: isActive ? '200ms' : '0ms' }}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                      <span className={`block transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        {s.title}
                      </span>
                      <span className={`block text-gradient mt-2 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            style={{ transitionDelay: isActive ? '400ms' : '0ms' }}>
                        {s.subtitle}
                      </span>
                    </h1>
                    <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-xl leading-relaxed transition-all duration-700 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: isActive ? '600ms' : '0ms' }}>
                      {s.description}
                    </p>
                    <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: isActive ? '800ms' : '0ms' }}>
                      <Link
                        href={s.ctaLink}
                        className="btn-blush text-center inline-flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-2xl group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {s.cta}
                          <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </Link>
                      {s.secondaryCta && (
                        <Link
                          href={s.secondaryCtaLink}
                          className="btn-secondary text-center inline-flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          {s.secondaryCta}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Image with STUNNING parallax and 3D effects */}
                  <div className={`relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] transition-all duration-1000 ${
                    isActive
                      ? 'opacity-100 translate-x-0 scale-100'
                      : 'opacity-0 translate-x-20 scale-90'
                  }`}
                  style={{ transitionDelay: isActive ? '400ms' : '0ms' }}>
                    {/* Multiple glowing layers for depth */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-rose-400/40 via-blush-400/40 to-luxury-400/40 rounded-3xl blur-3xl animate-pulse-soft" />
                    <div className="absolute -inset-2 bg-gradient-to-br from-rose-300/30 to-blush-300/30 rounded-3xl blur-2xl transform -rotate-3" />

                    {/* Main image container with 3D transform */}
                    <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 hover:scale-105 hover:rotate-2 group">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Sophisticated overlay gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-blush-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </div>

                    {/* Floating badge */}
                    {s.featured && (
                      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-rose-500 to-luxury-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-float z-20">
                        New Collection
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - HIDDEN on mobile, shown on desktop */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl group border-2 border-rose-100 items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6 text-rose-600 group-hover:text-rose-700 group-hover:-translate-x-0.5 transition-all" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl group border-2 border-rose-100 items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6 text-rose-600 group-hover:text-rose-700 group-hover:translate-x-0.5 transition-all" />
      </button>

      {/* Modern Dots Navigation - Touch friendly on mobile */}
      <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-2.5 bg-white/40 backdrop-blur-md px-4 md:px-5 py-2.5 md:py-3 rounded-full border border-white/50 shadow-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 ease-out touch-manipulation ${
              index === currentSlide
                ? 'w-8 md:w-10 bg-gradient-to-r from-rose-500 via-blush-500 to-luxury-500 shadow-lg'
                : 'w-2 md:w-2.5 bg-white/70 hover:bg-white hover:w-3 md:hover:w-4'
            } h-2 md:h-2.5 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
