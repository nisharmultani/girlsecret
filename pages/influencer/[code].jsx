import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ChartBarIcon,
  CurrencyPoundIcon,
  UserGroupIcon,
  CursorArrowRaysIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function InfluencerDashboard() {
  const router = useRouter();
  const { code } = router.query;
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;

    async function fetchReferralData() {
      try {
        const response = await fetch(`/api/influencer/${code}`);
        const data = await response.json();

        if (data.success) {
          setReferralData(data.referral);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load referral data');
      } finally {
        setLoading(false);
      }
    }

    fetchReferralData();
  }, [code]);

  const copyReferralLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const referralLink = `${baseUrl}?ref=${code}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const referralLink = `${baseUrl}?ref=${code}`;
  const conversionRate = referralData.totalClicks > 0
    ? ((referralData.totalConversions / referralData.totalClicks) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Welcome, {referralData.influencerName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Track your referral performance and earnings
          </p>
        </div>

        {/* Referral Link Box */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="input-field flex-1 bg-gray-50"
            />
            <button
              onClick={copyReferralLink}
              className="btn-primary flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-5 h-5" />
                  Copy
                </>
              )}
            </button>
          </div>
          {referralData.promoCode && (
            <p className="mt-3 text-sm text-gray-600">
              Your customers get the promo code <span className="font-semibold text-luxury-600">{referralData.promoCode}</span> automatically applied
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Clicks */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
              <CursorArrowRaysIcon className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{referralData.totalClicks}</p>
            <p className="mt-2 text-xs text-gray-500">People who clicked your link</p>
          </div>

          {/* Total Conversions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Conversions</h3>
              <UserGroupIcon className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{referralData.totalConversions}</p>
            <p className="mt-2 text-xs text-gray-500">
              Conversion rate: {conversionRate}%
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <ChartBarIcon className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              £{referralData.totalRevenue.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-gray-500">From your referrals</p>
          </div>

          {/* Total Commission */}
          <div className="bg-white rounded-lg shadow-sm p-6 bg-gradient-to-br from-luxury-50 to-luxury-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-luxury-900">Your Earnings</h3>
              <CurrencyPoundIcon className="w-8 h-8 text-luxury-600" />
            </div>
            <p className="text-3xl font-bold text-luxury-900">
              £{referralData.totalCommission.toFixed(2)}
            </p>
            <p className="mt-2 text-xs text-luxury-700">
              {referralData.commissionRate}% commission rate
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-luxury-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Share your unique referral link with your audience on social media, blog, or website
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-luxury-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">They Get a Discount</h3>
              <p className="text-sm text-gray-600">
                Your followers get a special discount code automatically applied when they shop
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-luxury-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Commission</h3>
              <p className="text-sm text-gray-600">
                You earn {referralData.commissionRate}% commission on every purchase made through your link
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Questions? Contact us at{' '}
            <a href="mailto:support@girlsecret.com" className="text-luxury-600 hover:text-luxury-700">
              support@girlsecret.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
