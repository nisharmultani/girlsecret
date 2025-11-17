import { useState } from 'react';
import Link from 'next/link';
import {
  GiftIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function GiftCards() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const amounts = [25, 50, 75, 100, 150, 200];

  const features = [
    {
      icon: EnvelopeIcon,
      title: 'Instant Delivery',
      description: 'Gift cards are delivered instantly via email'
    },
    {
      icon: ClockIcon,
      title: 'Never Expire',
      description: 'Our gift cards have no expiration date'
    },
    {
      icon: CreditCardIcon,
      title: 'Easy to Use',
      description: 'Simple redemption process at checkout'
    },
    {
      icon: SparklesIcon,
      title: 'Perfect Gift',
      description: 'Let them choose what they love'
    }
  ];

  const faqs = [
    {
      question: 'How are gift cards delivered?',
      answer: 'Gift cards are delivered instantly via email to the recipient\'s email address you provide. The email includes the gift card code and instructions for redemption.'
    },
    {
      question: 'Do gift cards expire?',
      answer: 'No! GirlSecret gift cards never expire. They can be used whenever the recipient is ready to shop.'
    },
    {
      question: 'Can I use a gift card with other discounts?',
      answer: 'Yes! Gift cards can be combined with promotional codes, sales, and other discounts for maximum savings.'
    },
    {
      question: 'What if I lose my gift card code?',
      answer: 'Don\'t worry! Contact our customer service team with your purchase details, and we\'ll help you recover your gift card code.'
    },
    {
      question: 'Can I check my gift card balance?',
      answer: 'Yes, you can check your gift card balance at checkout by entering the gift card code, or contact our customer service team.'
    },
    {
      question: 'Can gift cards be refunded?',
      answer: 'Gift cards are non-refundable. However, if you have any issues, please contact our customer service team and we\'ll do our best to help.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GiftIcon className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Gift Cards
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-8">
              Give the gift of choice with a GirlSecret gift card
            </p>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Perfect for birthdays, holidays, or just because. Let your loved ones choose their favorite intimate apparel!
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Choose GirlSecret Gift Cards?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Card Purchase Form */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Purchase a Gift Card
            </h2>
            <p className="text-lg text-gray-600">
              Choose an amount and send it to someone special
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form className="space-y-8">
              {/* Amount Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                        selectedAmount === amount && !customAmount
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      £{amount}
                    </button>
                  ))}
                </div>
                <div>
                  <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter a custom amount (£10 - £500)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">£</span>
                    <input
                      type="number"
                      id="custom-amount"
                      min="10"
                      max="500"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg"
                      placeholder="Custom amount"
                    />
                  </div>
                </div>
              </div>

              {/* Display Selected Amount */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 text-center">
                <p className="text-gray-700 mb-2">Gift Card Value</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  £{customAmount || selectedAmount || '0'}
                </p>
              </div>

              {/* Recipient Email */}
              <div>
                <label htmlFor="recipient-email" className="block text-lg font-semibold text-gray-900 mb-2">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  id="recipient-email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="recipient@email.com"
                />
                <p className="text-sm text-gray-500 mt-2">
                  The gift card will be sent to this email address
                </p>
              </div>

              {/* Personal Message */}
              <div>
                <label htmlFor="message" className="block text-lg font-semibold text-gray-900 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Add a personal message to make it extra special..."
                  maxLength={250}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {message.length}/250 characters
                </p>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Coming Soon!</p>
                    <p>Gift cards are currently being set up. Check back soon or contact us for more information.</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg opacity-50 cursor-not-allowed text-lg"
              >
                Coming Soon - Purchase Gift Card
              </button>

              <p className="text-center text-sm text-gray-500">
                In the meantime, please <Link href="/contact" className="text-purple-600 hover:underline font-semibold">contact us</Link> if you&apos;d like to purchase a gift card.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              How to Redeem
            </h2>
            <p className="text-lg text-gray-600">
              Using your GirlSecret gift card is easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Shop Your Favorites</h3>
              <p className="text-gray-600 text-sm">
                Browse our collection and add items to your cart
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Enter Your Code</h3>
              <p className="text-gray-600 text-sm">
                Apply your gift card code at checkout
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Complete Purchase</h3>
              <p className="text-gray-600 text-sm">
                The gift card value will be deducted from your total
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Have questions about gift cards? Our customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              View FAQ
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
        title: 'Gift Cards - Give the Perfect Gift | GirlSecret',
        description: 'Give the gift of choice with GirlSecret gift cards. Instant delivery, never expire, and perfect for any occasion. Let them choose their favorite intimate apparel!',
        keywords: 'gift cards, gift vouchers, e-gift cards, presents, gifts, birthday gifts, holiday gifts',
        path: '/gift-cards',
      },
    },
  };
}
