import { createReferral } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { referrerEmail, referredEmail } = req.body;

    if (!referrerEmail || !referredEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(referrerEmail) || !emailRegex.test(referredEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    if (referrerEmail === referredEmail) {
      return res.status(400).json({
        success: false,
        message: 'Cannot refer yourself',
      });
    }

    const result = await createReferral(referrerEmail, referredEmail);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Referral created successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to create referral',
      });
    }
  } catch (error) {
    console.error('Error creating referral:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
