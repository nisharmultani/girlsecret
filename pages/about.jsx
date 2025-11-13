import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon, SparklesIcon, HeartIcon, CurrencyPoundIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Brand Equation */}
      <section className="relative bg-black text-white py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1920&h=800&fit=crop"
            alt="GirlSecret Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-8">
              About GirlSecret
            </h1>

            {/* Brand Equation */}
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xl md:text-3xl lg:text-4xl font-semibold">
                <span className="bg-white text-black px-6 py-3 rounded-lg">Comfort</span>
                <span className="text-3xl md:text-5xl">+</span>
                <span className="bg-white text-black px-6 py-3 rounded-lg">Sexy</span>
                <span className="text-3xl md:text-5xl">+</span>
                <span className="bg-white text-black px-6 py-3 rounded-lg">On Budget</span>
                <span className="text-3xl md:text-5xl">=</span>
                <span className="bg-gradient-to-r from-gray-700 to-black text-white px-8 py-3 rounded-lg border-2 border-white">
                  GirlSecret
                </span>
              </div>

              <p className="mt-8 text-lg md:text-xl text-gray-300">
                The perfect balance of comfort, style, and affordability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  GirlSecret was born from a simple belief: <strong>every woman deserves to feel confident and beautiful</strong>,
                  without breaking the bank.
                </p>
                <p>
                  We noticed a gap in the market—intimate apparel was either <em>comfortable but boring</em>,
                  or <em>sexy but uncomfortable</em>, or <em>beautiful but expensive</em>. We asked ourselves:
                  <strong>Why not all three?</strong>
                </p>
                <p>
                  That&apos;s how GirlSecret was created. We carefully curate and design each piece to deliver
                  the trifecta: <strong>comfort for everyday wear</strong>, <strong>style that makes you feel amazing</strong>,
                  and <strong>prices that respect your budget</strong>.
                </p>
                <p className="text-black font-semibold">
                  Because feeling beautiful shouldn&apos;t be a luxury—it should be your everyday reality.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
                alt="Beautiful Intimate Apparel"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The GirlSecret Formula */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              The GirlSecret Formula
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What makes us different? It&apos;s our commitment to the perfect balance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Comfort */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <SparklesIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Comfort First</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Soft, breathable fabrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>All-day wearability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Perfect fit guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>No itching, no pinching</span>
                </li>
              </ul>
            </div>

            {/* Sexy */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <HeartIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sexy Style</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Beautiful designs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Delicate lace details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Flattering cuts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Makes you feel confident</span>
                </li>
              </ul>
            </div>

            {/* On Budget */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <CurrencyPoundIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">On Budget</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Affordable pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Regular sales & offers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>No compromise on quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span>Value that lasts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GirlSecret */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Why Choose GirlSecret?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We go beyond just selling intimates—we&apos;re here to make you feel amazing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600">Premium fabrics and construction</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <TruckIcon className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-bold mb-2">Discreet Shipping</h3>
              <p className="text-sm text-gray-600">Plain packaging for your privacy</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day hassle-free returns</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick dispatch on all orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Our Promise to You
          </h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              At GirlSecret, we promise to always put <strong className="text-white">you first</strong>.
              We&apos;re committed to offering intimate apparel that makes you feel confident,
              comfortable, and beautiful—every single day.
            </p>
            <p>
              Whether you&apos;re looking for everyday essentials or something special, we&apos;ve got you covered.
              Our team carefully selects each piece to ensure it meets our high standards for
              <strong className="text-white"> comfort, style, and value</strong>.
            </p>
            <p className="text-xl font-semibold text-white pt-4">
              Because you deserve to feel amazing—and you shouldn&apos;t have to choose between comfort, style, and budget.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Shop Our Collection
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'About Us - Comfort + Sexy + On Budget = GirlSecret',
        description: 'Discover the GirlSecret formula: beautiful intimate apparel that combines comfort, style, and affordability. Learn about our mission to make every woman feel confident.',
        keywords: 'about girlsecret, our story, affordable lingerie, comfortable intimates, sexy and comfortable, budget lingerie brand',
        path: '/about',
      },
    },
  };
}
