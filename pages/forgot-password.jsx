import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { EnvelopeIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devResetLink, setDevResetLink] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email.toLowerCase().trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        // In development, show the reset link
        if (result.resetUrl) {
          setDevResetLink(result.resetUrl);
        }
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <EnvelopeIcon className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!submitted ? (
            <>
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="input-field"
                    placeholder="your@email.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black font-medium"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-green-900 mb-1">
                      Email Sent Successfully!
                    </h3>
                    <p className="text-sm text-green-800">
                      If an account exists with this email, you&apos;ll receive a password reset link shortly. Please check your inbox and spam folder.
                    </p>
                  </div>
                </div>
              </div>

              {devResetLink && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        Development Mode
                      </h3>
                      <p className="text-sm text-blue-800 mb-2">
                        Email service is not configured. Click the link below to reset your password:
                      </p>
                      <Link
                        href={devResetLink}
                        className="inline-block btn-primary text-sm"
                      >
                        Reset Password Now
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black font-medium"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Didn&apos;t receive the email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'Reset Password',
        description: 'Reset your GirlSecret UK account password.',
        path: '/forgot-password',
      },
    },
  };
}
