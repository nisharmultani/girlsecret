import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    name: 'Bras',
    href: '/shop?category=Bras',
    description: 'Perfect Support & Comfort',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=1000&fit=crop',
    subtitle: 'Everyday to Special Occasions',
  },
  {
    name: 'Panties',
    href: '/shop?category=Panties',
    description: 'Everyday Essentials',
    image: 'https://images.unsplash.com/photo-1583033117486-c930de1eb982?w=800&h=1000&fit=crop',
    subtitle: 'Comfort Meets Style',
  },
  {
    name: 'Lingerie',
    href: '/shop?category=Lingerie',
    description: 'Luxe & Romantic',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop',
    subtitle: 'Feel Beautiful',
  },
  {
    name: 'Sleepwear',
    href: '/shop?category=Sleepwear',
    description: 'Cozy Comfort',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1000&fit=crop',
    subtitle: 'Sweet Dreams',
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            Discover Our Collections
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Find exactly what you&apos;re looking for in our curated collections
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-80 md:h-96 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Subtitle */}
                  <p className="text-white/80 text-xs uppercase tracking-wider mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {category.subtitle}
                  </p>

                  {/* Category Name */}
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 text-sm md:text-base mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {category.description}
                  </p>

                  {/* Shop Now Button */}
                  <div className="flex items-center gap-2 text-white font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    <span className="text-sm uppercase tracking-wider">Shop Now</span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>

                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <span className="text-white font-bold text-lg">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-black rounded-xl hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            View All Products
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
