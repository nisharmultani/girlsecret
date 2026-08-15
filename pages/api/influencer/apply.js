import { createInfluencerApplication } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, instagram, followers, niche, message } = req.body;

    // Validate required fields
    if (!name || !email || !instagram || !followers || !niche || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate unique referral code
    const referralCode = generateReferralCode(name);

    const result = await createInfluencerApplication({
      name,
      email,
      instagram,
      followers,
      niche,
      message,
      referralCode,
    });

    if (!result.success) {
      console.error('Error creating influencer application:', result.error);
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Also send to contact messages for notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: 'New Influencer Application',
          message: `New influencer application from ${name}\n\nInstagram: ${instagram}\nFollowers: ${followers}\nNiche: ${niche}\n\nMessage: ${message}`,
          type: 'influencer',
        }),
      });
    } catch (notifyError) {
      console.error('Failed to send notification:', notifyError);
      // Don't fail the application if notification fails
    }

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully!',
      referralCode: referralCode,
    });
  } catch (error) {
    console.error('Influencer application error:', error);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
}

function generateReferralCode(name) {
  // Create code from name + random string
  const cleanName = name
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .substring(0, 8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${random}`;
}
