import { findUserByVerificationToken, verifyUserEmail } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Find user by verification token
    const user = await findUserByVerificationToken(token);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
        alreadyVerified: true,
      });
    }

    // Verify the user's email
    const result = await verifyUserEmail(user.id);

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to verify email' });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Server error during email verification' });
  }
}
