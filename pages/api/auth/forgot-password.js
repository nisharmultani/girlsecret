import { findUserByEmail, storeResetToken } from '../../../lib/airtable';
import { generateResetToken, getResetTokenExpiry, isValidEmail } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user
    const user = await findUserByEmail(email);

    // Always return success to prevent email enumeration attacks
    // Don't reveal whether the email exists or not
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Check if account is active
    if (!user.active) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const expiry = getResetTokenExpiry();

    // Store token in database
    const result = await storeResetToken(user.id, resetToken, expiry);

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to generate reset token' });
    }

    // In production, send email here
    // For now, return token in development mode
    // TODO: Integrate email service (SendGrid, AWS SES, etc.)

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // In production, remove the token from response and only send via email
    const isDevelopment = process.env.NODE_ENV === 'development';

    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      ...(isDevelopment && {
        devNote: 'Email not configured. Use this link to reset password:',
        resetUrl: resetUrl,
        resetToken: resetToken,
      }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
