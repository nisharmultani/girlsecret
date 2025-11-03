import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

export default function ReferralsAdmin() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchReferrals();
  }, []);

  async function fetchReferrals() {
    try {
      const response = await fetch('/api/influencer/list');
      const data = await response.json();

      if (data.success) {
        setReferrals(data.referrals);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    setCreating(true);

    try {
      const response = await fetch('/api/influencer/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: data.referralCode,
          influencerName: data.influencerName,
          influencerEmail: data.influencerEmail,
          promoCode: data.promoCode || '',
          commissionRate: parseFloat(data.commissionRate) || 10,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Influencer referral created successfully!');
        reset();
        setShowCreateForm(false);
        fetchReferrals();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating referral:', error);
      alert('Failed to create referral. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const copyReferralLink = (code) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const referralLink = `${baseUrl}?ref=${code}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const copyDashboardLink = (code) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const dashboardLink = `${baseUrl}/influencer/${code}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(dashboardLink);
      alert('Dashboard link copied to clipboard!');
    }
  };

  // Calculate totals
  const totalClicks = referrals.reduce((sum, r) => sum + r.totalClicks, 0);
  const totalConversions = referrals.reduce((sum, r) => sum + r.totalConversions, 0);
  const totalRevenue = referrals.reduce((sum, r) => sum + r.totalRevenue, 0);
  const totalCommission = referrals.reduce((sum, r) => sum + r.totalCommission, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Influencer Referrals
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your influencer partnerships and track performance
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Referral
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
              <UserGroupIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Conversions</h3>
              <ChartBarIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">£{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Commissions</h3>
              <span className="text-2xl">💳</span>
            </div>
            <p className="text-2xl font-bold text-luxury-600">£{totalCommission.toFixed(2)}</p>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Influencer Referral</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code * (uppercase, no spaces)
                  </label>
                  <input
                    type="text"
                    {...register('referralCode', {
                      required: 'Referral code is required',
                      pattern: {
                        value: /^[A-Z0-9]+$/,
                        message: 'Only uppercase letters and numbers allowed',
                      },
                    })}
                    placeholder="INFLUENCER123"
                    className="input-field"
                  />
                  {errors.referralCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.referralCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Influencer Name *
                  </label>
                  <input
                    type="text"
                    {...register('influencerName', { required: 'Name is required' })}
                    placeholder="Jane Doe"
                    className="input-field"
                  />
                  {errors.influencerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.influencerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Influencer Email *
                  </label>
                  <input
                    type="email"
                    {...register('influencerEmail', { required: 'Email is required' })}
                    placeholder="jane@example.com"
                    className="input-field"
                  />
                  {errors.influencerEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.influencerEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code (optional)
                  </label>
                  <input
                    type="text"
                    {...register('promoCode')}
                    placeholder="SAVE10"
                    className="input-field"
                  />
                  <p className="mt-1 text-xs text-gray-500">Must exist in PromoCodes table</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('commissionRate')}
                    defaultValue="10"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Referral'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    reset();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Referrals List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Active Referrals ({referrals.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No referrals yet. Create your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Influencer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Promo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Conversions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referrals.map((referral) => {
                    const conversionRate = referral.totalClicks > 0
                      ? ((referral.totalConversions / referral.totalClicks) * 100).toFixed(1)
                      : '0.0';

                    return (
                      <tr key={referral.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {referral.influencerName}
                            </div>
                            <div className="text-sm text-gray-500">{referral.influencerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-luxury-100 text-luxury-800">
                            {referral.referralCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {referral.promoCode || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {referral.totalClicks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{referral.totalConversions}</div>
                          <div className="text-xs text-gray-500">{conversionRate}% rate</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          £{referral.totalRevenue.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-luxury-600">
                            £{referral.totalCommission.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">{referral.commissionRate}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyReferralLink(referral.referralCode)}
                              className="text-luxury-600 hover:text-luxury-700"
                              title="Copy referral link"
                            >
                              {copiedCode === referral.referralCode ? (
                                <CheckIcon className="w-5 h-5" />
                              ) : (
                                <ClipboardDocumentIcon className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => copyDashboardLink(referral.referralCode)}
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                              title="Copy dashboard link"
                            >
                              Dashboard
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
