import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from "next/link";



const faqs = [
  {
    category: 'Sizing & Fit',
    questions: [
      {
        q: 'How do I find my bra size?',
        a: 'Use our comprehensive size guide with step-by-step measuring instructions. Measure your band size (underbust) and bust size to determine your cup size. If you\'re between sizes, we recommend sizing up for comfort. Our customer service team is also available for personalized fit assistance.',
      },
      {
        q: 'What if I order the wrong size?',
        a: 'No worries! We offer free exchanges within 30 days. Simply contact us and we\'ll send you the correct size. Your comfort and fit are our top priorities.',
      },
      {
        q: 'Do your bras run true to size?',
        a: 'Yes, our sizing is consistent with standard US sizing. Each product page includes detailed fit notes and customer reviews to help you choose the right size.',
      },
      {
        q: 'How should my bra fit?',
        a: 'A properly fitted bra should sit flat against your ribcage, with the band providing most of the support. The straps should stay in place without digging in, and the cups should fully contain your breast tissue without spillage or gaps.',
      },
    ],
  },
  {
    category: 'Privacy & Packaging',
    questions: [
      {
        q: 'Is my order shipped in discreet packaging?',
        a: 'Yes! All orders are shipped in plain, unmarked boxes with no indication of the contents. Your privacy is important to us.',
      },
      {
        q: 'Will the sender name appear on the package?',
        a: 'The package will only show "GirlSecret" as the sender, with no mention of intimate apparel or product details.',
      },
      {
        q: 'Is my personal information secure?',
        a: 'Absolutely. We use industry-standard SSL encryption for all transactions. We never share your personal information with third parties.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders over £50. Orders under £50 have a flat shipping rate of £10.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping typically takes 3-5 business days. Express shipping (2-3 business days) is also available at checkout.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order ships, you\'ll receive a tracking number via email so you can monitor your delivery.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy for intimate apparel?',
        a: 'We accept returns and exchanges within 30 days of delivery. For hygiene reasons, all items must be unworn, unwashed, and have original tags attached. Panties must have the hygienic liner intact.',
      },
      {
        q: 'How do I exchange for a different size?',
        a: 'Contact our customer service team with your order number. We\'ll send you a prepaid shipping label and ship out your new size as soon as we receive your return.',
      },
      {
        q: 'Do you charge for returns or exchanges?',
        a: 'Exchanges are always free! For returns, we provide a prepaid shipping label and deduct £6 from your refund to cover return shipping costs.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Product Care',
    questions: [
      {
        q: 'How should I wash my bras?',
        a: 'Hand washing in cold water is best for extending the life of your bras. If using a machine, place bras in a mesh laundry bag and use the delicate cycle. Never put bras in the dryer—air dry them flat or hanging.',
      },
      {
        q: 'How do I care for delicate lace items?',
        a: 'Hand wash lace items in cold water with gentle detergent. Avoid wringing or twisting. Lay flat to dry away from direct sunlight.',
      },
      {
        q: 'How long should a bra last?',
        a: 'With proper care, a quality bra should last 6-12 months with regular wear. We recommend having at least 3 bras in rotation to extend their lifespan.',
      },
    ],
  },
  {
    category: 'Payment & Orders',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, absolutely. We use industry-standard SSL encryption and PCI compliance to protect your payment information.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can modify or cancel your order within 1 hour of placing it. Please contact our customer support team immediately for assistance.',
      },
    ],
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left hover:text-rose-600 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="intimate-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title">Frequently Asked Questions</h1>
            <p className="section-subtitle">
              Find answers to common questions about sizing, fit, privacy, and intimate apparel care
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {faqs.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                {category.category}
              </h2>
              <div className="space-y-2">
                {category.questions.map((faq, qIdx) => (
                  <FAQItem key={qIdx} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-rose-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our fit specialists are here to help you find your perfect fit
          </p>
          <Link href="/contact" className="btn-primary inline-block">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'FAQ - Frequently Asked Questions',
        description: 'Find answers to common questions about GirlSecret products, shipping, returns, and more.',
        keywords: 'faq, frequently asked questions, shipping info, returns policy, product questions',
        path: '/faq',
      },
    },
  };
}
