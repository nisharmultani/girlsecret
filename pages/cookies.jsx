import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, Cog6ToothIcon, ChartBarIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

export default function CookiesPolicy() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const cookieTypes = [
    {
      icon: ShieldCheckIcon,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly',
      color: 'from-green-500 to-green-600',
      examples: [
        'Session cookies for shopping cart',
        'Authentication cookies for logged-in users',
        'Security cookies to prevent fraud',
        'Load balancing cookies'
      ],
      canDisable: false
    },
    {
      icon: Cog6ToothIcon,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization',
      color: 'from-blue-500 to-blue-600',
      examples: [
        'Remember your preferences and settings',
        'Store your language preference',
        'Remember items in your wishlist',
        'Chat support functionality'
      ],
      canDisable: true
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors use our website',
      color: 'from-purple-500 to-purple-600',
      examples: [
        'Google Analytics for website traffic',
        'Page view and navigation tracking',
        'User behavior analysis',
        'Performance monitoring'
      ],
      canDisable: true
    },
    {
      icon: MegaphoneIcon,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements',
      color: 'from-pink-500 to-pink-600',
      examples: [
        'Facebook Pixel for ad targeting',
        'Retargeting cookies',
        'Social media sharing features',
        'Email campaign tracking'
      ],
      canDisable: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Cog6ToothIcon className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn about how we use cookies and similar technologies on our website
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last Updated: November 2024
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What Are Cookies?</h2>
            <p className="text-gray-700 mb-6">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website.
              They are widely used to make websites work more efficiently and provide a better user experience.
            </p>
            <p className="text-gray-700 mb-6">
              At GirlSecret, we use cookies and similar technologies to enhance your shopping experience, analyze website
              traffic, and deliver personalized content and advertisements.
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Types of Cookies We Use
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We use different types of cookies for different purposes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {cookieTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${type.color} p-6 text-white`}>
                  <type.icon className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                  <p className="text-sm opacity-90">{type.description}</p>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-3">Examples:</h4>
                  <ul className="space-y-2 mb-4">
                    {type.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-black font-bold mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    {type.canDisable ? (
                      <span className="text-sm text-green-600 font-semibold">✓ Can be disabled</span>
                    ) : (
                      <span className="text-sm text-gray-500 font-semibold">Required for website function</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Detailed Cookie Information</h2>

          <div className="space-y-4">
            {/* First Party Cookies */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('first-party')}
                className="w-full px-6 py-4 bg-gray-50 text-left font-semibold text-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                First-Party Cookies
                <span className="text-2xl">{expandedSection === 'first-party' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'first-party' && (
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4">
                    First-party cookies are set directly by our website (girlsecret.co.uk). These cookies allow us to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Remember items in your shopping cart</li>
                    <li>Keep you logged in as you navigate between pages</li>
                    <li>Store your preferences and settings</li>
                    <li>Provide secure checkout functionality</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Third Party Cookies */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('third-party')}
                className="w-full px-6 py-4 bg-gray-50 text-left font-semibold text-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                Third-Party Cookies
                <span className="text-2xl">{expandedSection === 'third-party' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'third-party' && (
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4">
                    Third-party cookies are set by external services we use on our website:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Google Analytics</h4>
                      <p className="text-gray-700 text-sm">
                        Helps us understand how visitors interact with our website by collecting anonymous information.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Facebook Pixel</h4>
                      <p className="text-gray-700 text-sm">
                        Enables us to measure advertising effectiveness and show you relevant ads on Facebook and Instagram.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Payment Processors</h4>
                      <p className="text-gray-700 text-sm">
                        Stripe and other payment gateways use cookies to process secure payments.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Session vs Persistent */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('session')}
                className="w-full px-6 py-4 bg-gray-50 text-left font-semibold text-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                Session vs. Persistent Cookies
                <span className="text-2xl">{expandedSection === 'session' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'session' && (
                <div className="p-6 bg-white">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Session Cookies</h4>
                      <p className="text-gray-700 text-sm">
                        Temporary cookies that are deleted when you close your browser. Used for shopping cart functionality
                        and authentication during your browsing session.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Persistent Cookies</h4>
                      <p className="text-gray-700 text-sm">
                        Remain on your device for a set period or until you delete them. Used to remember your preferences
                        and provide a personalized experience on return visits.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Managing Your Cookie Preferences</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies only</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>View and delete individual cookies</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Common Browser Links</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-semibold">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-semibold">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-semibold">Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-semibold">Microsoft Edge</a></li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Important Note</h3>
                <p className="text-gray-700">
                  Please note that blocking or deleting cookies may impact your experience on our website. Some features
                  may not function properly, and you may not be able to complete purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Updates to Policy */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal,
              regulatory, or operational reasons. We encourage you to review this page periodically.
            </p>
            <p className="text-gray-700">
              The &quot;Last Updated&quot; date at the top of this page indicates when the policy was last revised.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Cookies?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            If you have any questions about our use of cookies, please don&apos;t hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              Privacy Policy
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
        title: 'Cookie Policy - How We Use Cookies | GirlSecret',
        description: 'Learn about how GirlSecret uses cookies and similar technologies on our website. Understand what cookies we use and how to manage your preferences.',
        keywords: 'cookie policy, cookies, privacy, tracking, website cookies, cookie preferences',
        path: '/cookies',
      },
    },
  };
}
