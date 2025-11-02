import Link from 'next/link';
import { SparklesIcon, HeartIcon, MoonIcon, HomeIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    name: 'Bras',
    href: '/shop?category=Bras',
    icon: SparklesIcon,
    description: 'Perfect support & comfort',
    gradient: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50',
  },
  {
    name: 'Panties',
    href: '/shop?category=Panties',
    icon: HeartIcon,
    description: 'Everyday essentials',
    gradient: 'from-pink-400 to-purple-500',
    bgColor: 'bg-pink-50',
  },
  {
    name: 'Lingerie',
    href: '/shop?category=Lingerie',
    icon: SparklesIcon,
    description: 'Luxe & romantic',
    gradient: 'from-purple-400 to-rose-500',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Sleepwear',
    href: '/shop?category=Sleepwear',
    icon: MoonIcon,
    description: 'Cozy comfort',
    gradient: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you&apos;re looking for</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`${category.bgColor} p-6 md:p-8 h-full flex flex-col items-center justify-center text-center min-h-[200px] md:min-h-[240px]`}>
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    {category.description}
                  </p>

                  {/* Shop Now Link */}
                  <span className="text-sm font-semibold text-rose-600 group-hover:text-rose-700 flex items-center gap-1">
                    Shop Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
