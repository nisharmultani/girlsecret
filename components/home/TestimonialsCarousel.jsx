import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    comment: 'The quality is absolutely amazing! The fit is perfect and the fabric feels luxurious. I\'ve never felt more confident.',
    product: 'Lace Balconette Bra',
    verified: true,
  },
  {
    id: 2,
    name: 'Emma L.',
    rating: 5,
    comment: 'Finally found bras that actually fit! The sizing guide was spot on and customer service helped me find my perfect size.',
    product: 'Everyday Comfort Bra',
    verified: true,
  },
  {
    id: 3,
    name: 'Jessica T.',
    rating: 5,
    comment: 'Beautiful lingerie that makes me feel special. The attention to detail is incredible and shipping was super fast!',
    product: 'Silk & Lace Set',
    verified: true,
  },
  {
    id: 4,
    name: 'Rachel K.',
    rating: 5,
    comment: 'Love the discreet packaging and the quality of the products. Everything arrived perfectly and fits like a dream.',
    product: 'Cotton Comfort Pack',
    verified: true,
  },
  {
    id: 5,
    name: 'Amanda P.',
    rating: 5,
    comment: 'Best intimate apparel shopping experience! Great prices, beautiful products, and the fit guarantee gives me peace of mind.',
    product: 'Push-up Plunge Bra',
    verified: true,
  },
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Show 3 testimonials on desktop, 1 on mobile
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Loved by Customers</h2>
          <p className="section-subtitle">See what our customers are saying</p>
        </div>

        <div className="relative">
          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Mobile: Show only current testimonial */}
            <div className="md:hidden">
              <TestimonialCard testimonial={visibleTestimonials[0]} />
            </div>

            {/* Desktop: Show 3 testimonials */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 md:col-span-3">
              {visibleTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-all hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-900" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-rose-500'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  } h-2 rounded-full`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-all hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.comment}</p>

      {/* Product */}
      <p className="text-sm text-rose-600 font-medium mb-4">{testimonial.product}</p>

      {/* Author */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          {testimonial.verified && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Purchase
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
