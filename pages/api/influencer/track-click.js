import { incrementReferralClicks } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({
        success: false,
        error: 'Referral code is required',
      });
    }

    const result = await incrementReferralClicks(referralCode);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Click tracked successfully',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error tracking click:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
