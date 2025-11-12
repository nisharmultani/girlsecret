import Link from 'next/link';
import { useState } from 'react';
import { getAllProducts, getAllReviewStats } from '../lib/airtable';
import ProductGrid from '../components/product/ProductGrid';
import HeroCarousel from '../components/home/HeroCarousel';
import ShopByCategory from '../components/home/ShopByCategory';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import Banner from '../components/ui/Banner';
import SectionDivider from '../components/ui/SectionDivider';
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

      {/* Promotional Banner */}
      <Banner
        imageSrc="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=400&fit=crop"
        imageAlt="New Collection Banner"
        title="New Collection"
        subtitle="Discover Timeless Elegance"
        buttonText="Explore Now"
        buttonLink="/shop"
        height="h-80 md:h-96"
      />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Decorative Divider */}
      <SectionDivider variant="pattern" />

      {/* Featured Products Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked selections just for you
            </p>
          </div>

          <ProductGrid products={featuredProducts} columns="three" />

          <div className="text-center mt-12">
            <Link href="/shop" className="btn-primary inline-flex items-center">
              View All Products
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <SectionDivider variant="dots" />

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
                className="hidden sm:inline-flex items-center text-black hover:text-neutral-700 font-semibold transition-colors"
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

      {/* Decorative Divider */}
      <SectionDivider variant="simple" />

      {/* Value Proposition / Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose GirlSecret?</h2>
            <p className="section-subtitle">We&apos;re committed to your comfort and confidence</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <SparklesIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Perfect Fit Guarantee</h3>
              <p className="text-gray-600 text-sm md:text-base">Free exchanges and expert fit guidance to ensure your comfort</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <TruckIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Discreet Delivery</h3>
              <p className="text-gray-600 text-sm md:text-base">Free shipping over £50 in plain, unmarked packaging</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm md:text-base">Soft fabrics, delicate lace, and exceptional craftsmanship</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <HeartIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Made with Love</h3>
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
                className="hidden sm:inline-flex items-center text-black hover:text-neutral-700 font-semibold transition-colors"
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

      {/* Decorative Divider */}
      <SectionDivider variant="pattern" />

      {/* Customer Testimonials */}
      <TestimonialsCarousel />

      {/* Decorative Divider */}
      <SectionDivider variant="dots" />

      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Join Our Inner Circle
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Get exclusive access to new collections, size guides, fit tips, and special offers.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="btn-blush disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {message.text && (
            <p
              className={`mt-4 text-sm font-medium ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message.text}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-4">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
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
