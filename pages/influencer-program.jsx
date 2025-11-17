import { useState } from 'react';
import Link from 'next/link';
import {
  SparklesIcon,
  GiftIcon,
  CurrencyPoundIcon,
  UserGroupIcon,
  HeartIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function InfluencerProgram() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    followers: '',
    niche: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: 'Influencer Program Application',
          type: 'influencer'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Thank you for your application! We\'ll review it and get back to you within 48 hours.',
        });
        setFormData({
          name: '',
          email: '',
          instagram: '',
          followers: '',
          niche: '',
          message: ''
        });
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Failed to submit application. Please try again.',
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const benefits = [
    {
      icon: GiftIcon,
      title: 'Free Products',
      description: 'Receive our latest collections to feature in your content'
    },
    {
      icon: CurrencyPoundIcon,
      title: 'Commission',
      description: 'Earn up to 15% commission on every sale through your unique link'
    },
    {
      icon: SparklesIcon,
      title: 'Exclusive Access',
      description: 'Early access to new releases and exclusive influencer-only discounts'
    },
    {
      icon: UserGroupIcon,
      title: 'Community',
      description: 'Join our community of like-minded influencers and creators'
    },
    {
      icon: HeartIcon,
      title: 'Dedicated Support',
      description: 'Personal account manager to support your content creation'
    },
    {
      icon: CheckIcon,
      title: 'Bonus Opportunities',
      description: 'Special campaigns and bonus earning opportunities throughout the year'
    }
  ];

  const requirements = [
    'Active Instagram, TikTok, or YouTube account',
    'Minimum 5,000 engaged followers',
    'Content aligned with fashion, lifestyle, or beauty',
    'High-quality photos and authentic engagement',
    'Professional and reliable communication',
    'Genuine passion for our brand values'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Join Our Influencer Program
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Partner with GirlSecret and earn while sharing products you love with your audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#apply"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                Apply Now
              </a>
              <a
                href="#benefits"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              What You&apos;ll Get
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              As a GirlSecret influencer, you&apos;ll enjoy exclusive perks and earning opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
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

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy! Here&apos;s how our program works
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Apply</h3>
              <p className="text-gray-600 text-sm">
                Fill out our application form with your details and social media links
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Get Approved</h3>
              <p className="text-gray-600 text-sm">
                Our team reviews applications and responds within 48 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Create Content</h3>
              <p className="text-gray-600 text-sm">
                Receive products and your unique tracking link to start creating
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Earn Rewards</h3>
              <p className="text-gray-600 text-sm">
                Earn commission on sales and enjoy exclusive perks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Who We&apos;re Looking For
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We partner with influencers who share our values and passion for quality intimate apparel
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Apply to Join
            </h2>
            <p className="text-lg text-gray-600">
              Ready to partner with GirlSecret? Fill out the form below to get started
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle (or main social platform) *
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  required
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="@yourusername"
                />
              </div>

              <div>
                <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-2">
                  Follower Count *
                </label>
                <select
                  id="followers"
                  name="followers"
                  required
                  value={formData.followers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select follower range</option>
                  <option value="5k-10k">5,000 - 10,000</option>
                  <option value="10k-50k">10,000 - 50,000</option>
                  <option value="50k-100k">50,000 - 100,000</option>
                  <option value="100k+">100,000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-2">
                  Content Niche *
                </label>
                <select
                  id="niche"
                  name="niche"
                  required
                  value={formData.niche}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select your niche</option>
                  <option value="fashion">Fashion</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="beauty">Beauty</option>
                  <option value="fitness">Fitness</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to partner with GirlSecret? *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Tell us about yourself and why you'd be a great fit for our influencer program..."
                />
              </div>

              {submitMessage.text && (
                <div
                  className={`p-4 rounded-lg ${
                    submitMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-4 px-8 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Program?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Contact our partnership team for more information.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'Influencer Program - Partner with GirlSecret',
        description: 'Join the GirlSecret influencer program and earn commission while sharing quality intimate apparel with your audience. Free products, exclusive perks, and dedicated support.',
        keywords: 'influencer program, brand partnership, affiliate program, content creator, influencer collaboration, earn commission',
        path: '/influencer-program',
      },
    },
  };
}
