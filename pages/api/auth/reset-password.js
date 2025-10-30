import { findUserByResetToken, updateUserPassword } from '../../../lib/airtable';
import { hashPassword, isValidPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
      });
    }

    // Find user by reset token
    const user = await findUserByResetToken(token);

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset token',
      });
    }

    // Hash new password
    const newPasswordHash = hashPassword(password);

    // Update password and clear reset token
    const result = await updateUserPassword(user.id, newPasswordHash);

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
