import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'already-verified'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.alreadyVerified) {
            setStatus('already-verified');
            setMessage('Your email has already been verified. You can now sign in to your account.');
          } else {
            setStatus('success');
            setMessage('Your email has been verified successfully! You can now enjoy all features of your account.');
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email. The link may be invalid or expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again later.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Email Verification
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {status === 'verifying' && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-600 mb-4"></div>
              <p className="text-gray-700 text-lg">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Email Verified!
              </h2>
              <p className="text-gray-700 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-block btn-primary"
              >
                Sign In to Your Account
              </Link>
            </div>
          )}

          {status === 'already-verified' && (
            <div className="text-center py-4">
              <CheckCircleIcon className="w-20 h-20 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Already Verified
              </h2>
              <p className="text-gray-700 mb-6">{message}</p>
              <Link
                href="/login"
                className="inline-block btn-primary"
              >
                Sign In to Your Account
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verification Failed
              </h2>
              <p className="text-gray-700 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="block btn-primary"
                >
                  Contact Support
                </Link>
                <Link
                  href="/login"
                  className="block btn-secondary"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Need help? Contact us at support@girlsecretuk.com
        </p>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'Verify Email',
        description: 'Verify your email address to complete your GirlSecret UK account registration.',
        path: '/verify-email',
      },
    },
  };
}
