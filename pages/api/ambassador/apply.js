import { createAmbassadorApplication } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, city, university, whyYou, experience } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !city || !whyYou || !experience) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Generate unique referral code
    const referralCode = generateReferralCode(name);

    const result = await createAmbassadorApplication({
      name,
      email,
      phone,
      city,
      university,
      whyYou,
      experience,
      referralCode,
    });

    if (!result.success) {
      console.error('Error creating ambassador application:', result.error);
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
          phone,
          subject: 'New Ambassador Application',
          message: `New ambassador application from ${name}\n\nCity: ${city}\nUniversity: ${university || 'N/A'}\n\nWhy: ${whyYou}\n\nExperience: ${experience}`,
          type: 'ambassador',
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
    console.error('Ambassador application error:', error);
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
  return `AMB${cleanName}${random}`;
}
