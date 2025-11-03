import { createInfluencerReferral } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { referralCode, influencerName, influencerEmail, promoCode, commissionRate } = req.body;

    // Validation
    if (!referralCode || !influencerName || !influencerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: referralCode, influencerName, influencerEmail',
      });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(influencerEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate referral code format (alphanumeric, no spaces)
    const codeRegex = /^[A-Z0-9]+$/i;
    if (!codeRegex.test(referralCode)) {
      return res.status(400).json({
        success: false,
        error: 'Referral code must be alphanumeric with no spaces',
      });
    }

    const result = await createInfluencerReferral({
      referralCode,
      influencerName,
      influencerEmail,
      promoCode: promoCode || '',
      commissionRate: commissionRate || 10,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Influencer referral created successfully',
        referral: result.referral,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error creating influencer referral:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
