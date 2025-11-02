import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Unsubscribe() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(''); // 'success' or 'error'
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from our newsletter.');
        setEmail('');

        // Redirect to homepage after 5 seconds
        setTimeout(() => {
          router.push('/');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to unsubscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Unsubscribed Successfully
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <p className="text-sm text-gray-500">
            You will be redirected to the homepage shortly...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
              Unsubscribe from Newsletter
            </h1>
            <p className="text-gray-600">
              We&apos;re sorry to see you go. Enter your email below to unsubscribe from our newsletter.
            </p>
          </div>

          <form onSubmit={handleUnsubscribe} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Changed your mind?{' '}
              <Link href="/" className="text-luxury-600 hover:text-luxury-700 font-medium">
                Return to homepage
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Before you go...
          </h3>
          <p className="text-sm text-blue-800">
            Did you know you can update your email preferences instead of unsubscribing completely?
            Consider adjusting your preferences to receive only the emails you want.
          </p>
        </div>
      </div>
    </div>
  );
}
