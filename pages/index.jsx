import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '../lib/airtable';
import ProductGrid from '../components/product/ProductGrid';
import { ArrowRightIcon, SparklesIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import coverImage from "../images/coverImage.avif"

export default function Home({ featuredProducts }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center intimate-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6">
                Feel Beautiful
                <span className="block text-gradient">From Within</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Discover intimate apparel designed for comfort, confidence, and your unique beauty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="btn-blush text-center">
                  Shop Now
                  <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
                </Link>
                <Link href="/about" className="btn-secondary text-center">
                  Find Your Fit
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-rose-500" />
                  <span>Discreet Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-rose-500" />
                  <span>Free Shipping $50+</span>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[500px] animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/50 to-blush-200/50 rounded-3xl transform rotate-3"></div>
              <div className="relative h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src={coverImage}
                  alt="Beautiful Intimate Apparel"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <SparklesIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Fit Guarantee</h3>
              <p className="text-gray-600">Free exchanges and expert fit guidance to ensure your comfort.</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <TruckIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discreet Delivery</h3>
              <p className="text-gray-600">Free shipping over $50 in plain, unmarked packaging for your privacy.</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Soft fabrics, delicate lace, and exceptional craftsmanship.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
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

      {/* Newsletter Section */}
      <section className="py-20 intimate-gradient">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Join Our Inner Circle
          </h2>
          <p className="text-lg text-gray-600 mb-8">
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
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  try {
    const allProducts = await getAllProducts();
    const featuredProducts = allProducts.filter(p => p.featured).slice(0, 8);

    return {
      props: {
        featuredProducts,
        seo: {
          title: 'Home',
          description: 'Discover beautiful intimate apparel, bras, panties, and lingerie designed for comfort and confidence at GirlSecret.',
          keywords: 'intimate apparel, bras, panties, lingerie, underwear, women\'s intimates, comfortable bras',
          path: '/',
        },
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        featuredProducts: [],
        seo: {
          title: 'Home',
          path: '/',
        },
      },
      revalidate: 60,
    };
  }
}
