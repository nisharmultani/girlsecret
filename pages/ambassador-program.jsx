import { useState } from 'react';
import Link from 'next/link';
import {
  StarIcon,
  GiftIcon,
  UserGroupIcon,
  HeartIcon,
  TrophyIcon,
  CheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function AmbassadorProgram() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    university: '',
    whyYou: '',
    experience: ''
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
          subject: 'Brand Ambassador Application',
          type: 'ambassador',
          message: `Why You: ${formData.whyYou}\nExperience: ${formData.experience}\nCity: ${formData.city}\nUniversity: ${formData.university}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage({
          type: 'success',
          text: 'Thank you for applying! We\'ll review your application and contact you within 5 business days.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          university: '',
          whyYou: '',
          experience: ''
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
      title: 'Exclusive Products',
      description: 'Be the first to receive and showcase our newest collections'
    },
    {
      icon: StarIcon,
      title: 'Special Discount',
      description: 'Enjoy 30% off all purchases as a brand ambassador'
    },
    {
      icon: TrophyIcon,
      title: 'Recognition',
      description: 'Featured on our website and social media channels'
    },
    {
      icon: UserGroupIcon,
      title: 'Ambassador Network',
      description: 'Connect with other ambassadors in our exclusive community'
    },
    {
      icon: HeartIcon,
      title: 'Event Access',
      description: 'VIP invitations to brand events, launches, and meetups'
    },
    {
      icon: SparklesIcon,
      title: 'Earning Potential',
      description: 'Earn commission through your unique referral code'
    }
  ];

  const responsibilities = [
    'Represent GirlSecret brand values with authenticity and enthusiasm',
    'Share content featuring our products on your social media (minimum 2-3 posts per month)',
    'Engage with your audience about GirlSecret products and experiences',
    'Provide honest feedback on products and collections',
    'Participate in ambassador community events and activities',
    'Help spread brand awareness in your local community or campus'
  ];

  const requirements = [
    'Age 18 or older',
    'Active on at least one social media platform (Instagram, TikTok, or Facebook)',
    'Passionate about fashion, beauty, or lifestyle',
    'Excellent communication skills',
    'Reliable and professional attitude',
    'Genuine love for the GirlSecret brand'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-pink-900 to-black text-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Become a GirlSecret Ambassador
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join our exclusive ambassador program and represent a brand that empowers women everywhere
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

      {/* What is a Brand Ambassador */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
              What is a Brand Ambassador?
            </h2>
            <div className="text-lg text-gray-700 space-y-4 text-left">
              <p>
                A GirlSecret Brand Ambassador is more than just a representative—you&apos;re a valued member of our community who genuinely loves and believes in our products.
              </p>
              <p>
                As an ambassador, you&apos;ll help us spread the word about GirlSecret&apos;s mission to provide comfortable, sexy, and affordable intimate apparel. Whether you&apos;re a student, working professional, or content creator, if you&apos;re passionate about our brand, we want you on our team!
              </p>
              <p className="font-semibold text-black">
                This is perfect for students, campus influencers, and anyone who loves building communities and sharing great products!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Ambassador Perks
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enjoy exclusive benefits as part of our ambassador community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
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

      {/* Responsibilities */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              What We Expect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here&apos;s what you&apos;ll do as a GirlSecret ambassador
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Who Can Apply?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re looking for passionate individuals who align with our brand values
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <ul className="space-y-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              How to Join
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started as an ambassador is simple
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Apply Online</h3>
              <p className="text-gray-600 text-sm">
                Complete the application form below with your information
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Get Reviewed</h3>
              <p className="text-gray-600 text-sm">
                Our team reviews all applications carefully
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Onboarding</h3>
              <p className="text-gray-600 text-sm">
                Accepted ambassadors receive a welcome kit and training
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Start Sharing</h3>
              <p className="text-gray-600 text-sm">
                Begin representing GirlSecret and earning perks!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Apply Now
            </h2>
            <p className="text-lg text-gray-600">
              Ready to become a GirlSecret ambassador? Fill out the form below
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City/Location *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Where are you based?"
                />
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  University/College (if applicable)
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your school name"
                />
              </div>

              <div>
                <label htmlFor="whyYou" className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to be a GirlSecret ambassador? *
                </label>
                <textarea
                  id="whyYou"
                  name="whyYou"
                  required
                  rows={5}
                  value={formData.whyYou}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Tell us why you'd be a great ambassador for our brand..."
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Do you have any experience with brand representation or social media? *
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  required
                  rows={4}
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Share your relevant experience and social media handles..."
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-900 via-pink-900 to-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Want to learn more about our ambassador program? We&apos;re here to help!
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
        title: 'Brand Ambassador Program - Join the GirlSecret Team',
        description: 'Become a GirlSecret brand ambassador and enjoy exclusive perks, discounts, and the opportunity to represent an empowering lingerie brand. Apply today!',
        keywords: 'brand ambassador, campus ambassador, student ambassador, brand representative, ambassador program, earn perks',
        path: '/ambassador-program',
      },
    },
  };
}
