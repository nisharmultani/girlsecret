import Image from 'next/image';
import Link from 'next/link';

/**
 * BrandStory - Visual brand narrative section
 * Tells your brand story with beautiful imagery
 * Inspired by Victoria's Secret and Bluebella brand storytelling
 */
export default function BrandStory() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-black rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Images Grid */}
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 relative aspect-[16/10] overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1583033117486-c930de1eb982?w=1200&h=750&fit=crop"
                  alt="Our Story"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
              </div>

              {/* Two smaller images */}
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop"
                  alt="Quality Craftsmanship"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  quality={85}
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop"
                  alt="Designed with Love"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  quality={85}
                />
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-100 rounded-full blur-2xl opacity-50 -z-10" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full blur-2xl opacity-50 -z-10" />
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Our Story
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Designed for{' '}
              <span className="italic text-gray-600">Confidence</span>
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
              <p>
                At GirlSecret, we believe that confidence begins with comfort.
                Every piece in our collection is thoughtfully designed to make you feel
                beautiful, empowered, and absolutely yourself.
              </p>

              <p>
                From delicate lace to everyday essentials, we craft intimate apparel
                that celebrates your unique beauty. Our commitment to quality, fit,
                and sustainability means you can feel good about what you&apos;re wearing—inside and out.
              </p>

              <p className="font-semibold text-gray-900">
                Because when you feel confident in what you wear,
                you can conquer anything.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10 py-8 border-y border-gray-200">
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1">
                  10K+
                </div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1">
                  4.8★
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/our-story"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Read Our Full Story
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold border-2 border-black hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
