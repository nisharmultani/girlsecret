import { getBase } from '../../../lib/airtable';

const AMBASSADORS_TABLE = 'Ambassadors';

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

    const base = getBase();
    if (!base) {
      console.error('Airtable not configured');
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Generate unique referral code
    const referralCode = generateReferralCode(name);

    // Create ambassador record
    const record = await base(AMBASSADORS_TABLE).create({
      Name: name,
      Email: email,
      Phone: phone,
      City: city,
      University: university || '',
      WhyYou: whyYou,
      Experience: experience,
      Status: 'Pending',
      ReferralCode: referralCode,
      AppliedDate: new Date().toISOString(),
      TotalClicks: 0,
      TotalSales: 0,
      TotalRevenue: 0,
      CommissionEarned: 0,
      CommissionRate: 10, // Default 10% for ambassadors
    });

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
