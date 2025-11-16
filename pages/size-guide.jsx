import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const sizingGuides = {
  bras: {
    title: 'Bra Size Guide',
    description: 'Find your perfect fit with our comprehensive bra sizing chart',
    measurements: [
      {
        size: '32A',
        bust: '32-33"',
        under: '28-29"',
        uk: '32A',
        eu: '70A',
        fr: '85A'
      },
      {
        size: '32B',
        bust: '33-34"',
        under: '28-29"',
        uk: '32B',
        eu: '70B',
        fr: '85B'
      },
      {
        size: '32C',
        bust: '34-35"',
        under: '28-29"',
        uk: '32C',
        eu: '70C',
        fr: '85C'
      },
      {
        size: '34A',
        bust: '34-35"',
        under: '30-31"',
        uk: '34A',
        eu: '75A',
        fr: '90A'
      },
      {
        size: '34B',
        bust: '35-36"',
        under: '30-31"',
        uk: '34B',
        eu: '75B',
        fr: '90B'
      },
      {
        size: '34C',
        bust: '36-37"',
        under: '30-31"',
        uk: '34C',
        eu: '75C',
        fr: '90C'
      },
      {
        size: '34D',
        bust: '37-38"',
        under: '30-31"',
        uk: '34D',
        eu: '75D',
        fr: '90D'
      },
      {
        size: '36B',
        bust: '37-38"',
        under: '32-33"',
        uk: '36B',
        eu: '80B',
        fr: '95B'
      },
      {
        size: '36C',
        bust: '38-39"',
        under: '32-33"',
        uk: '36C',
        eu: '80C',
        fr: '95C'
      },
      {
        size: '36D',
        bust: '39-40"',
        under: '32-33"',
        uk: '36D',
        eu: '80D',
        fr: '95D'
      },
      {
        size: '38C',
        bust: '40-41"',
        under: '34-35"',
        uk: '38C',
        eu: '85C',
        fr: '100C'
      },
      {
        size: '38D',
        bust: '41-42"',
        under: '34-35"',
        uk: '38D',
        eu: '85D',
        fr: '100D'
      }
    ]
  },
  panties: {
    title: 'Panty Size Guide',
    description: 'Choose the right size for ultimate comfort',
    measurements: [
      {
        size: 'XS',
        waist: '24-26"',
        hips: '34-36"',
        uk: '6',
        us: '2',
        eu: '34'
      },
      {
        size: 'S',
        waist: '26-28"',
        hips: '36-38"',
        uk: '8',
        us: '4',
        eu: '36'
      },
      {
        size: 'M',
        waist: '28-30"',
        hips: '38-40"',
        uk: '10',
        us: '6',
        eu: '38'
      },
      {
        size: 'L',
        waist: '30-32"',
        hips: '40-42"',
        uk: '12',
        us: '8',
        eu: '40'
      },
      {
        size: 'XL',
        waist: '32-34"',
        hips: '42-44"',
        uk: '14',
        us: '10',
        eu: '42'
      },
      {
        size: 'XXL',
        waist: '34-36"',
        hips: '44-46"',
        uk: '16',
        us: '12',
        eu: '44'
      }
    ]
  },
  sleepwear: {
    title: 'Sleepwear & Loungewear Size Guide',
    description: 'Find your comfortable fit for relaxation',
    measurements: [
      {
        size: 'XS',
        bust: '32-34"',
        waist: '24-26"',
        hips: '34-36"',
        uk: '6-8'
      },
      {
        size: 'S',
        bust: '34-36"',
        waist: '26-28"',
        hips: '36-38"',
        uk: '8-10'
      },
      {
        size: 'M',
        bust: '36-38"',
        waist: '28-30"',
        hips: '38-40"',
        uk: '10-12'
      },
      {
        size: 'L',
        bust: '38-40"',
        waist: '30-32"',
        hips: '40-42"',
        uk: '12-14'
      },
      {
        size: 'XL',
        bust: '40-42"',
        waist: '32-34"',
        hips: '42-44"',
        uk: '14-16'
      }
    ]
  }
};

const faqs = [
  {
    question: 'How do I measure my bra size?',
    answer: 'To measure your bra size: 1) Measure under your bust for the band size. 2) Measure around the fullest part of your bust. 3) Subtract the band measurement from the bust measurement. Each inch difference represents a cup size (1"=A, 2"=B, 3"=C, etc.).'
  },
  {
    question: 'What if I\'m between sizes?',
    answer: 'If you\'re between sizes, we recommend sizing up for bras and choosing based on your usual preference for panties and sleepwear. Comfortable fit is key!'
  },
  {
    question: 'Do your products run true to size?',
    answer: 'Yes, our products generally run true to size. However, each product page includes specific fit notes to help you choose the best size for that particular item.'
  },
  {
    question: 'Can I exchange if the size doesn\'t fit?',
    answer: 'Absolutely! We offer free size exchanges within 30 days of purchase. Just contact our customer service team to arrange an exchange.'
  }
];

function FAQ({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState('bras');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
              Size Guide
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive sizing charts
            </p>
          </div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Take Your Measurements
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Bust Measurement</h3>
              <p className="text-gray-600 text-sm">
                Measure around the fullest part of your bust, keeping the tape parallel to the ground.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Waist Measurement</h3>
              <p className="text-gray-600 text-sm">
                Measure around your natural waistline, which is typically the narrowest part of your torso.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Hip Measurement</h3>
              <p className="text-gray-600 text-sm">
                Measure around the fullest part of your hips, keeping the tape parallel to the ground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Charts */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {Object.keys(sizingGuides).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`${
                    activeTab === key
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  {sizingGuides[key].title}
                </button>
              ))}
            </nav>
          </div>

          {/* Active Tab Content */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {sizingGuides[activeTab].title}
            </h3>
            <p className="text-gray-600 mb-8">
              {sizingGuides[activeTab].description}
            </p>

            {/* Size Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    {activeTab === 'bras' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bust
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Under Bust
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          UK
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FR
                        </th>
                      </>
                    )}
                    {activeTab === 'panties' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hips
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          UK
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          US
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EU
                        </th>
                      </>
                    )}
                    {activeTab === 'sleepwear' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bust
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hips
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          UK
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sizingGuides[activeTab].measurements.map((measurement, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {measurement.size}
                      </td>
                      {activeTab === 'bras' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.bust}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.under}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.uk}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.eu}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.fr}
                          </td>
                        </>
                      )}
                      {activeTab === 'panties' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.waist}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.hips}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.uk}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.us}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.eu}
                          </td>
                        </>
                      )}
                      {activeTab === 'sleepwear' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.bust}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.waist}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.hips}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {measurement.uk}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Sizing FAQs
          </h2>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-200 px-6">
              {faqs.map((faq, index) => (
                <FAQ key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to help you find the perfect fit. Contact us anytime!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              Shop Now
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
        title: 'Size Guide - Find Your Perfect Fit | GirlSecret',
        description: 'Use our comprehensive size guide to find your perfect fit for bras, panties, and sleepwear. Includes measurement tips and international size conversions.',
        keywords: 'lingerie size guide, bra size chart, panty size guide, how to measure bra size, intimate apparel sizing',
        path: '/size-guide',
      },
    },
  };
}
