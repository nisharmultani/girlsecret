import Image from 'next/image';
import Link from 'next/link';
import {
  HeartIcon,
  SparklesIcon,
  UserGroupIcon,
  GlobeAltIcon,
  TrophyIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function OurStory() {
  const values = [
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'Every decision we make starts with one question: Is this best for our customers?'
    },
    {
      icon: SparklesIcon,
      title: 'Quality Without Compromise',
      description: 'We believe affordable doesn\'t mean low quality. We carefully source and test every product.'
    },
    {
      icon: UserGroupIcon,
      title: 'Inclusivity',
      description: 'Beautiful intimate apparel should be accessible to all women, regardless of budget or body type.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Sustainability',
      description: 'We\'re committed to ethical sourcing and reducing our environmental impact.'
    },
    {
      icon: TrophyIcon,
      title: 'Excellence',
      description: 'From product quality to customer service, we strive for excellence in everything we do.'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'We continuously seek new ways to improve and deliver better value to our customers.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop"
            alt="Our Story Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              The journey of creating intimate apparel that celebrates every woman
            </p>
          </div>
        </div>
      </section>

      {/* The Beginning */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                Where It All Started
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  GirlSecret was born from a simple observation: women were constantly choosing between comfort,
                  style, and affordability when it came to intimate apparel. It seemed impossible to find all three
                  in one place.
                </p>
                <p>
                  We asked ourselves a fundamental question: <strong className="text-black">Why should women have to compromise?</strong>
                </p>
                <p>
                  This question sparked a mission to create a brand that would challenge the industry norm. We envisioned
                  a company that would curate beautiful, comfortable intimate apparel at prices that respect real budgets.
                </p>
                <p className="text-black font-semibold text-xl">
                  That vision became GirlSecret.
                </p>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                alt="The Beginning"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Formula */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
              The GirlSecret Formula
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We didn&apos;t just want to sell products. We wanted to create a new standard.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xl md:text-3xl lg:text-4xl font-semibold w-full mb-8">
                <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg">Comfort</span>
                <span className="text-3xl md:text-5xl">+</span>
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg">Sexy</span>
                <span className="text-3xl md:text-5xl">+</span>
                <span className="bg-gradient-to-r from-black to-gray-700 text-white px-6 py-3 rounded-lg">On Budget</span>
                <span className="text-3xl md:text-5xl">=</span>
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 text-white px-8 py-3 rounded-lg border-2 border-gold-700 shadow-lg">
                  GirlSecret
                </span>
              </div>

              <div className="space-y-6 text-gray-700">
                <p className="text-lg">
                  <strong className="text-black">Comfort:</strong> Because you deserve to feel good all day long.
                  No itching, no pinching, just soft, breathable fabrics.
                </p>
                <p className="text-lg">
                  <strong className="text-black">Sexy:</strong> Beautiful designs and delicate details that make
                  you feel confident and amazing.
                </p>
                <p className="text-lg">
                  <strong className="text-black">On Budget:</strong> Quality intimate apparel shouldn&apos;t break the bank.
                  We make luxury accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our values guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-black text-white rounded-2xl p-8 md:p-12 text-center">
            <HeartIcon className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Our Promise to You
            </h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                We promise to never compromise on the three pillars that define us: <strong>comfort, style, and affordability</strong>.
              </p>
              <p>
                We promise to listen to your feedback and continuously improve our products and service.
              </p>
              <p>
                We promise to treat every customer with respect, care, and the attention you deserve.
              </p>
              <p className="text-2xl font-semibold pt-4">
                Because you deserve to feel beautiful—every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Community */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Be part of a growing community of women who believe in comfort, style, and smart shopping
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors text-lg"
            >
              Shop Our Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-colors text-lg"
            >
              Learn More About Us
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
        title: 'Our Story - The Journey of GirlSecret',
        description: 'Discover the story behind GirlSecret and our mission to provide comfortable, sexy, and affordable intimate apparel for every woman. Learn about our values and journey.',
        keywords: 'our story, brand story, about girlsecret, company history, brand values, mission, vision',
        path: '/our-story',
      },
    },
  };
}
