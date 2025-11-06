import Link from 'next/link';
import { useState } from 'react';
import { getAllProducts, getAllReviewStats } from '../lib/airtable';
import ProductGrid from '../components/product/ProductGrid';
import HeroCarousel from '../components/home/HeroCarousel';
import ShopByCategory from '../components/home/ShopByCategory';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import { ArrowRightIcon, SparklesIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Home({ featuredProducts, newArrivals, bestSellers }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.alreadySubscribed
            ? 'You are already subscribed!'
            : 'Thank you for subscribing! Check your email for a welcome message.',
        });
        setEmail('');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Featured Products Section with enhanced animations */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-rose-50/30 to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked selections just for you
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 via-blush-400 to-luxury-500 mx-auto rounded-full" />
          </div>

          <ProductGrid products={featuredProducts} columns="three" />

          <div className="text-center mt-12">
            <Link href="/shop" className="btn-primary inline-flex items-center group">
              View All Products
              <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title text-left">New Arrivals</h2>
                <p className="section-subtitle text-left">
                  Fresh styles just added
                </p>
              </div>
              <Link
                href="/shop?sort=newest"
                className="hidden sm:inline-flex items-center text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                View All
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <ProductGrid products={newArrivals} columns="three" />

            <div className="text-center mt-8 sm:hidden">
              <Link href="/shop?sort=newest" className="btn-secondary inline-flex items-center">
                View All New Arrivals
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Value Proposition / Why Choose Us - Enhanced */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-rose-50 via-blush-50 to-lavender-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blush-200/20 rounded-full blur-3xl animate-pulse-soft" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose GirlSecret?</h2>
            <p className="section-subtitle">We&apos;re committed to your comfort and confidence</p>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 via-blush-400 to-luxury-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-100 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-blush-100 mb-4 group-hover:scale-110 transition-transform duration-500">
                <SparklesIcon className="w-8 h-8 text-rose-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-rose-600 transition-colors">Perfect Fit Guarantee</h3>
              <p className="text-gray-600 text-sm md:text-base">Free exchanges and expert fit guidance to ensure your comfort</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-100 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-blush-100 mb-4 group-hover:scale-110 transition-transform duration-500">
                <TruckIcon className="w-8 h-8 text-rose-600 group-hover:translate-x-1 transition-transform duration-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-rose-600 transition-colors">Discreet Delivery</h3>
              <p className="text-gray-600 text-sm md:text-base">Free shipping over £50 in plain, unmarked packaging</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-100 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-blush-100 mb-4 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheckIcon className="w-8 h-8 text-rose-600 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-rose-600 transition-colors">Premium Quality</h3>
              <p className="text-gray-600 text-sm md:text-base">Soft fabrics, delicate lace, and exceptional craftsmanship</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-100 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-blush-100 mb-4 group-hover:scale-110 transition-transform duration-500">
                <HeartIcon className="w-8 h-8 text-rose-600 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-rose-600 transition-colors">Made with Love</h3>
              <p className="text-gray-600 text-sm md:text-base">Every piece designed to make you feel beautiful</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title text-left">Best Sellers</h2>
                <p className="section-subtitle text-left">
                  Customer favorites you&apos;ll love
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                View All
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <ProductGrid products={bestSellers} columns="three" />

            <div className="text-center mt-8 sm:hidden">
              <Link href="/shop" className="btn-secondary inline-flex items-center">
                View All Products
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials */}
      <TestimonialsCarousel />

      {/* Newsletter Section - Enhanced Modern Design */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-luxury-50 via-rose-50 to-blush-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blush-300/20 rounded-full blur-3xl animate-float" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 border border-rose-100">
            <SparklesIcon className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-float" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              Join Our Inner Circle
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get exclusive access to new collections, size guides, fit tips, and special offers delivered to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input-field flex-1 border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="btn-blush disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transform hover:scale-105 transition-transform"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </form>

            {message.text && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                } animate-slide-up`}
              >
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-rose-500" />
                <span>Spam-free</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-rose-500" />
                <span>Exclusive offers</span>
              </div>
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-rose-500" />
                <span>VIP access</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  try {
    const allProducts = await getAllProducts();
    const reviewStats = await getAllReviewStats();

    // Merge review stats with products
    const productsWithReviews = allProducts.map(product => ({
      ...product,
      averageRating: reviewStats[product.id]?.averageRating || 0,
      reviewCount: reviewStats[product.id]?.count || 0,
    }));

    // Featured Products - Show 6 for 3-column grid
    const featuredProducts = productsWithReviews.filter(p => p.featured).slice(0, 6);

    // New Arrivals - Most recent products (3 for cleaner grid)
    const newArrivals = productsWithReviews
      .sort((a, b) => {
        const dateA = new Date(a.createdTime || 0);
        const dateB = new Date(b.createdTime || 0);
        return dateB - dateA;
      })
      .slice(0, 3);

    // Best Sellers - Featured products that aren't in featuredProducts (3 for cleaner grid)
    const bestSellers = productsWithReviews
      .filter(p => p.featured && !featuredProducts.includes(p))
      .slice(0, 3);

    // If not enough best sellers, fill with random products
    if (bestSellers.length < 3) {
      const additionalProducts = productsWithReviews
        .filter(p => !featuredProducts.includes(p) && !bestSellers.includes(p))
        .slice(0, 3 - bestSellers.length);
      bestSellers.push(...additionalProducts);
    }

    return {
      props: {
        featuredProducts,
        newArrivals,
        bestSellers,
        seo: {
          title: 'Home',
          description: 'Discover beautiful intimate apparel, bras, panties, and lingerie designed for comfort and confidence at GirlSecret.',
          keywords: 'intimate apparel, bras, panties, lingerie, underwear, women\'s intimates, comfortable bras',
          path: '/',
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        featuredProducts: [],
        newArrivals: [],
        bestSellers: [],
        seo: {
          title: 'Home',
          path: '/',
        },
      },
      revalidate: 60,
    };
  }
}
