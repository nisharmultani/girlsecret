import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '../lib/airtable';
import ProductGrid from '../components/product/ProductGrid';
import { ArrowRightIcon, SparklesIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Home({ featuredProducts }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center luxury-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6">
                Discover Your
                <span className="block text-gradient">Secret Beauty</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Luxurious beauty and lifestyle products that celebrate your uniqueness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="btn-gold text-center">
                  Shop Now
                  <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
                </Link>
                <Link href="/about" className="btn-secondary text-center">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[500px] animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-300/50 to-gold-300/50 rounded-3xl transform rotate-3"></div>
              <div className="relative h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
                  alt="Luxury Beauty Products"
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-100 mb-4">
                <SparklesIcon className="w-8 h-8 text-luxury-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Carefully curated luxury products for discerning customers.</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-100 mb-4">
                <TruckIcon className="w-8 h-8 text-luxury-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Complimentary shipping on all orders over $50.</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-100 mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-luxury-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Your privacy and security are our top priorities.</p>
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
      <section className="py-20 luxury-gradient">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Join Our VIP Club
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get exclusive access to new arrivals, special offers, and beauty tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-gold">
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
          description: 'Discover premium beauty products and luxurious lifestyle essentials at GirlSecret.',
          keywords: 'luxury beauty, premium skincare, beauty products, cosmetics, lifestyle',
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
