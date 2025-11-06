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
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden bg-black">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
            }`}
          >
            {/* Enhanced gradient overlay with depth */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient} opacity-95`} />

            {/* Animated decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 right-10 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-10 left-10 w-96 h-96 bg-blush-300/20 rounded-full blur-3xl animate-pulse-soft" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 h-full relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                {/* Text Content with enhanced animations */}
                <div className={`transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10'
                }`}>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                    {s.title}
                    <span className="block text-gradient mt-2 animate-scale-in">{s.subtitle}</span>
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-xl leading-relaxed">
                    {s.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={s.ctaLink}
                      className="btn-blush text-center inline-flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                    >
                      {s.cta}
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
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

                {/* Image with parallax effect and border glow */}
                <div className={`relative h-[300px] md:h-[400px] lg:h-[500px] hidden lg:block transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-10 scale-95'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400/30 to-blush-400/30 rounded-3xl blur-2xl transform -rotate-6" />
                  <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105 hover:rotate-1">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    {/* Elegant overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Navigation Arrows with modern design */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl group border-2 border-rose-100"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6 text-rose-600 group-hover:text-rose-700 transition-colors" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white p-3 md:p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl group border-2 border-rose-100"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 text-rose-600 group-hover:text-rose-700 transition-colors" />
      </button>

      {/* Modern Dots Navigation with elegant animations */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/30 backdrop-blur-md px-4 py-3 rounded-full border border-white/40">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 ease-out ${
              index === currentSlide
                ? 'w-10 bg-gradient-to-r from-rose-500 to-blush-500 shadow-lg'
                : 'w-2.5 bg-white/70 hover:bg-white hover:w-4'
            } h-2.5 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
