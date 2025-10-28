import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    category: 'Ordering & Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can modify or cancel your order within 1 hour of placing it. Please contact our customer support team immediately for assistance.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders over $50. Orders under $50 have a flat shipping rate of $10.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping typically takes 3-5 business days. Express shipping (2-3 business days) and overnight shipping options are also available at checkout.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your package on our website or the carrier\'s website.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy. If you\'re not completely satisfied with your purchase, you can return it for a full refund or exchange within 30 days of delivery.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our customer support team with your order number, and they will provide you with return instructions and a prepaid shipping label.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method.',
      },
      {
        q: 'Are there any items that cannot be returned?',
        a: 'For hygiene reasons, opened beauty products and personal care items cannot be returned unless they are defective.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Are your products authentic?',
        a: 'Yes, 100%! We source all our products directly from authorized distributors and brands. We guarantee the authenticity of every product we sell.',
      },
      {
        q: 'Do you test your products on animals?',
        a: 'We are committed to cruelty-free beauty. We only work with brands that do not test on animals.',
      },
      {
        q: 'How do I know which products are right for me?',
        a: 'Each product page includes detailed descriptions, ingredients, and customer reviews. If you need personalized recommendations, please contact our customer support team.',
      },
    ],
  },
  {
    category: 'Account & Rewards',
    questions: [
      {
        q: 'Do I need an account to place an order?',
        a: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, and earn rewards points.',
      },
      {
        q: 'How does your referral program work?',
        a: 'Share your unique referral link with friends. When they make their first purchase, you both receive a special discount!',
      },
      {
        q: 'Do you have a loyalty program?',
        a: 'Yes! Earn points with every purchase and redeem them for discounts on future orders. Sign up for our newsletter to join.',
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
        className="w-full py-4 flex justify-between items-center text-left hover:text-luxury-600 transition-colors"
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
      <div className="luxury-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title">Frequently Asked Questions</h1>
            <p className="section-subtitle">
              Find answers to common questions about our products and services
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
        <div className="mt-16 bg-luxury-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Us
          </a>
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
