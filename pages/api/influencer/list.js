import { getAllInfluencerReferrals } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const referrals = await getAllInfluencerReferrals();

    return res.status(200).json({
      success: true,
      referrals,
    });
  } catch (error) {
    console.error('Error fetching influencer referrals:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
