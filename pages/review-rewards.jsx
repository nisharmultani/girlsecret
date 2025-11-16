import Link from 'next/link';
import { StarIcon, GiftIcon, TrophyIcon, SparklesIcon, CurrencyPoundIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function ReviewRewards() {
  const tiers = [
    {
      name: 'Bronze Reviewer',
      reviews: '1-5 Reviews',
      reward: '5% Off Next Purchase',
      icon: StarIcon,
      color: 'from-orange-400 to-orange-600'
    },
    {
      name: 'Silver Reviewer',
      reviews: '6-15 Reviews',
      reward: '10% Off Next Purchase',
      icon: StarIcon,
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Gold Reviewer',
      reviews: '16-30 Reviews',
      reward: '15% Off + Free Product',
      icon: TrophyIcon,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      name: 'Platinum Reviewer',
      reviews: '31+ Reviews',
      reward: '20% Off + VIP Status',
      icon: SparklesIcon,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const benefits = [
    {
      title: 'Earn Points',
      description: 'Get reward points for every quality review you write',
      icon: StarIconSolid
    },
    {
      title: 'Exclusive Discounts',
      description: 'Unlock increasing discount levels as you write more reviews',
      icon: CurrencyPoundIcon
    },
    {
      title: 'Free Products',
      description: 'Top reviewers receive free products to test and review',
      icon: GiftIcon
    },
    {
      title: 'VIP Access',
      description: 'Early access to sales and new product launches',
      icon: TrophyIcon
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Make a Purchase',
      description: 'Buy any product from GirlSecret'
    },
    {
      step: 2,
      title: 'Receive Your Order',
      description: 'Try out your new products'
    },
    {
      step: 3,
      title: 'Write a Review',
      description: 'Share your honest experience on the product page'
    },
    {
      step: 4,
      title: 'Get Rewarded',
      description: 'Receive your discount code via email within 24 hours'
    }
  ];

  const reviewGuidelines = [
    'Reviews must be at least 50 characters long',
    'Include specific details about the product (fit, quality, comfort, etc.)',
    'Photos of the product are encouraged and earn bonus points',
    'Reviews must be honest and constructive',
    'Only verified purchases are eligible for rewards',
    'Spam or fake reviews will result in disqualification'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <StarIconSolid className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Review Rewards Program
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-8">
              Share your thoughts, help others shop confidently, and earn amazing rewards!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Start Shopping & Reviewing
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Write Reviews?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your reviews help other shoppers make informed decisions, and you get rewarded for it!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Reward Tiers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The more reviews you write, the better rewards you unlock
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform">
                <div className={`bg-gradient-to-r ${tier.color} p-6 text-white text-center`}>
                  <tier.icon className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm opacity-90">{tier.reviews}</p>
                </div>
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {tier.reward.split(' ')[0]}
                  </div>
                  <p className="text-gray-600">
                    {tier.reward.split(' ').slice(1).join(' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting rewarded for your reviews is simple
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500" />
                )}
                <div className="relative bg-white text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto relative z-10">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Guidelines */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Review Guidelines
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these guidelines to ensure your reviews are eligible for rewards
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {reviewGuidelines.map((guideline, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-gray-700">{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bonus Opportunities */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Bonus Opportunities
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-xl border-2 border-yellow-200">
              <h3 className="text-2xl font-bold mb-3">Photo Reviews</h3>
              <p className="text-gray-700 mb-4">
                Add photos to your review and earn an extra 50 reward points!
              </p>
              <div className="text-3xl font-bold text-orange-600">+50 Points</div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-xl border-2 border-pink-200">
              <h3 className="text-2xl font-bold mb-3">Video Reviews</h3>
              <p className="text-gray-700 mb-4">
                Create a video review and earn triple points plus a special gift!
              </p>
              <div className="text-3xl font-bold text-pink-600">+150 Points</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-3">Featured Reviews</h3>
              <p className="text-gray-700 mb-4">
                Get featured on our homepage and social media for bonus rewards!
              </p>
              <div className="text-3xl font-bold text-purple-600">VIP Status</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">How long does it take to receive my reward?</h3>
              <p className="text-gray-600">
                Rewards are typically sent via email within 24 hours of your review being approved.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Can I write multiple reviews for the same product?</h3>
              <p className="text-gray-600">
                You can only write one review per product. However, you can update your review at any time.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Do my rewards expire?</h3>
              <p className="text-gray-600">
                Discount codes are valid for 90 days from the date they are issued. Points never expire.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Can I combine my review rewards with other discounts?</h3>
              <p className="text-gray-600">
                Yes! Review reward discounts can be combined with most other promotions and sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Shop now and share your experience to unlock exclusive rewards!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              View My Orders
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
        title: 'Review Rewards Program - Earn Rewards for Your Reviews | GirlSecret',
        description: 'Write product reviews and earn exclusive discounts, free products, and VIP status. Join our review rewards program today and get rewarded for sharing your experience.',
        keywords: 'review rewards, product reviews, earn rewards, customer reviews, discount rewards, loyalty program',
        path: '/review-rewards',
      },
    },
  };
}
