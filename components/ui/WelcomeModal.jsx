import { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, TagIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if modal has been shown before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

    if (!hasSeenWelcome) {
      // Show modal after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Submit to newsletter API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden pointer-events-auto transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5 text-gray-700" />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Left Side - Image */}
            <div className="relative h-48 md:h-auto bg-gradient-to-br from-gray-900 to-gray-700">
              <Image
                src="https://images.unsplash.com/photo-1559582930-2e3ec4f325fd?w=800&h=800&fit=crop"
                alt="Welcome to GirlSecret"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Welcome to GirlSecret
                </h3>
                <p className="text-gray-200 text-sm">
                  Your destination for intimate elegance
                </p>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="p-8 md:p-10">
              {!submitted ? (
                <>
                  {/* Offer Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-6">
                    <TagIcon className="w-4 h-4" />
                    <span>15% OFF First Order</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">
                    Join Our Inner Circle
                  </h2>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Subscribe to our newsletter and unlock exclusive offers, early access to new collections, and styling tips.
                  </p>

                  {/* Newsletter Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all text-base"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Get My 15% Off'}
                    </button>
                  </form>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                    You&apos;re In!
                  </h3>
                  <p className="text-gray-600">
                    Check your inbox for your exclusive 15% discount code.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
