import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '../lib/airtable';
import ProductGrid from '../components/product/ProductGrid';
import HeroCarousel from '../components/home/HeroCarousel';
import ShopByCategory from '../components/home/ShopByCategory';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import { ArrowRightIcon, SparklesIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Home({ featuredProducts, newArrivals, bestSellers }) {
  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Featured Products Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked selections just for you
            </p>
          </div>

          <ProductGrid products={featuredProducts} />

          <div className="text-center mt-12">
            <Link href="/shop" className="btn-primary inline-flex items-center">
              View All Products
              <ArrowRightIcon className="w-5 h-5 ml-2" />
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

            <ProductGrid products={newArrivals} />

            <div className="text-center mt-8 sm:hidden">
              <Link href="/shop?sort=newest" className="btn-secondary inline-flex items-center">
                View All New Arrivals
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Value Proposition / Why Choose Us */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose GirlSecret?</h2>
            <p className="section-subtitle">We're committed to your comfort and confidence</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <SparklesIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Perfect Fit Guarantee</h3>
              <p className="text-gray-600 text-sm md:text-base">Free exchanges and expert fit guidance to ensure your comfort</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <TruckIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Discreet Delivery</h3>
              <p className="text-gray-600 text-sm md:text-base">Free shipping over £50 in plain, unmarked packaging</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm md:text-base">Soft fabrics, delicate lace, and exceptional craftsmanship</p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <HeartIcon className="w-8 h-8 text-rose-600" />
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
                  Customer favorites you'll love
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

            <ProductGrid products={bestSellers} />

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

      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-purple-50 via-rose-50 to-pink-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Join Our Inner Circle
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Get exclusive access to new collections, size guides, fit tips, and special offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-blush">
              Subscribe
            </button>
          </form>
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

    // Featured Products
    const featuredProducts = allProducts.filter(p => p.featured).slice(0, 8);

    // New Arrivals - Most recent products
    const newArrivals = allProducts
      .sort((a, b) => {
        const dateA = new Date(a.createdTime || 0);
        const dateB = new Date(b.createdTime || 0);
        return dateB - dateA;
      })
      .slice(0, 4);

    // Best Sellers - Featured products that aren't in featuredProducts
    const bestSellers = allProducts
      .filter(p => p.featured && !featuredProducts.includes(p))
      .slice(0, 4);

    // If not enough best sellers, fill with random products
    if (bestSellers.length < 4) {
      const additionalProducts = allProducts
        .filter(p => !featuredProducts.includes(p) && !bestSellers.includes(p))
        .slice(0, 4 - bestSellers.length);
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
