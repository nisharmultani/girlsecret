import { getReferralByCode } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Referral code is required',
      });
    }

    const referral = await getReferralByCode(code);

    if (!referral) {
      return res.status(404).json({
        success: false,
        error: 'Referral code not found',
      });
    }

    if (!referral.isActive) {
      return res.status(403).json({
        success: false,
        error: 'This referral code is inactive',
      });
    }

    return res.status(200).json({
      success: true,
      referral: {
        referralCode: referral.referralCode,
        influencerName: referral.influencerName,
        promoCode: referral.promoCode,
        totalClicks: referral.totalClicks,
        totalConversions: referral.totalConversions,
        totalRevenue: referral.totalRevenue,
        totalCommission: referral.totalCommission,
        commissionRate: referral.commissionRate,
      },
    });
  } catch (error) {
    console.error('Error fetching referral:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
