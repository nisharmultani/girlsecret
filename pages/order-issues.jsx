import Link from 'next/link';
import {
  ExclamationTriangleIcon,
  TruckIcon,
  ClockIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default function OrderIssues() {
  const issueTypes = [
    {
      icon: TruckIcon,
      title: 'Lost Package',
      description: 'Your package hasn\'t arrived after the expected delivery date',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: ExclamationTriangleIcon,
      title: 'Damaged Item',
      description: 'You received a product that is damaged or defective',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: ClockIcon,
      title: 'Delayed Delivery',
      description: 'Your package is taking longer than expected to arrive',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const steps = {
    lost: [
      {
        step: '1',
        title: 'Check Tracking',
        description: 'First, check your tracking number on our Track Order page or the courier\'s website. Sometimes packages are marked as delivered but left in a safe place.'
      },
      {
        step: '2',
        title: 'Check Safe Places',
        description: 'Look around your property - mailbox, porch, garage, or with neighbors. Delivery drivers sometimes leave packages in unexpected but secure locations.'
      },
      {
        step: '3',
        title: 'Wait 48 Hours',
        description: 'If tracking shows "delivered" but you haven\'t received it, wait 48 hours. Sometimes the status updates before actual delivery.'
      },
      {
        step: '4',
        title: 'Contact Us',
        description: 'After 48 hours, if you still haven\'t received your package, contact our customer service team. We\'ll investigate and send a replacement or refund.'
      }
    ],
    damaged: [
      {
        step: '1',
        title: 'Document the Damage',
        description: 'Take clear photos of the damaged item and packaging. Include multiple angles showing the extent of the damage.'
      },
      {
        step: '2',
        title: 'Don\'t Discard',
        description: 'Keep all packaging and the damaged item. We may need to inspect them or arrange for return/pickup by the courier.'
      },
      {
        step: '3',
        title: 'Contact Us Immediately',
        description: 'Reach out to our customer service within 48 hours of delivery. Include your order number, photos, and description of the damage.'
      },
      {
        step: '4',
        title: 'Get Resolution',
        description: 'We\'ll review your case and offer a replacement, refund, or store credit within 24 hours. Return shipping is always free for damaged items.'
      }
    ],
    delayed: [
      {
        step: '1',
        title: 'Check Estimated Delivery',
        description: 'Review your order confirmation email for the estimated delivery timeframe. Standard delivery is 3-5 business days.'
      },
      {
        step: '2',
        title: 'Track Your Package',
        description: 'Use the tracking number provided to see the current location and status of your package on the courier\'s website.'
      },
      {
        step: '3',
        title: 'Account for Delays',
        description: 'Weather, holidays, and high volume periods can cause delays. Check for any service alerts from the courier.'
      },
      {
        step: '4',
        title: 'Contact Us',
        description: 'If your package is more than 2 days past the estimated delivery date with no tracking updates, contact us for assistance.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Order Issues Help Center
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Lost, damaged, or delayed package? We're here to help make it right.
            </p>
          </div>
        </div>
      </section>

      {/* Issue Types */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              What's Your Issue?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the issue you're experiencing for specific help
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {issueTypes.map((issue, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${issue.color} p-6 text-white`}>
                  <issue.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{issue.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{issue.description}</p>
                  <a
                    href={`#${issue.title.toLowerCase().replace(' ', '-')}`}
                    className="inline-flex items-center mt-4 text-black font-semibold hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lost Package */}
      <section id="lost-package" className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TruckIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Lost Package
            </h2>
            <p className="text-lg text-gray-600">
              Follow these steps if your package hasn't arrived
            </p>
          </div>

          <div className="space-y-6">
            {steps.lost.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Damaged Item */}
      <section id="damaged-item" className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Damaged Item
            </h2>
            <p className="text-lg text-gray-600">
              What to do if you receive a damaged product
            </p>
          </div>

          <div className="space-y-6">
            {steps.damaged.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-md p-6 flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delayed Delivery */}
      <section id="delayed-delivery" className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ClockIcon className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Delayed Delivery
            </h2>
            <p className="text-lg text-gray-600">
              Steps to take when your package is delayed
            </p>
          </div>

          <div className="space-y-6">
            {steps.delayed.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Guarantee */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Our Customer Satisfaction Guarantee
              </h2>
              <div className="text-lg space-y-4 max-w-2xl mx-auto">
                <p>
                  At GirlSecret, we stand behind every order. If something goes wrong with your delivery, we'll make it right.
                </p>
                <p>
                  <strong>Our Promise:</strong>
                </p>
                <ul className="text-left space-y-2 inline-block">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Free replacement for lost or damaged items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Full refund if we can't resolve the issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Free return shipping on all damaged items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>24-hour response time on all inquiries</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our customer service team is ready to assist you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <EnvelopeIcon className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">support@girlsecret.co.uk</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <PhoneIcon className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">+44 20 1234 5678</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9am-6pm GMT</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <TruckIcon className="w-12 h-12 text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Track Order</h3>
              <Link href="/track-order" className="text-black font-semibold hover:underline">
                Track your package →
              </Link>
              <p className="text-sm text-gray-500 mt-4">Real-time tracking updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit our help center for more information about shipping, returns, and customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
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
        title: 'Order Issues - Lost, Damaged, or Delayed Packages | GirlSecret',
        description: 'Help center for lost, damaged, or delayed packages. Learn how we can help resolve your shipping issues quickly with replacements or refunds.',
        keywords: 'lost package, damaged delivery, delayed shipping, order problems, shipping issues, package help',
        path: '/order-issues',
      },
    },
  };
}
