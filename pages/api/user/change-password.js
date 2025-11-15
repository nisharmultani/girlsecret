import { getUserById, updateUserPassword } from '../../../lib/airtable';
import { hashPassword, verifyPassword, isValidPassword } from '../../../lib/auth';
import { getSession } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session token from cookie or header
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    // Get user from session/token (simplified - in production use proper JWT)
    // For now, we'll need to get the userId from the session
    // This is a placeholder - you'll need to implement proper session validation
    const session = req.cookies.userSession ? JSON.parse(req.cookies.userSession) : null;

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const userId = session.user.id;

    // Get user from database
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    if (!verifyPassword(currentPassword, user.password)) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = hashPassword(newPassword);

    // Update password in database
    const result = await updateUserPassword(userId, hashedPassword);

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
