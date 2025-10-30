import { findUserByEmail, updateUserProfile } from '../../../lib/airtable';
import { isValidEmail } from '../../../lib/auth';

export default async function handler(req, res) {
  // GET - Fetch user profile
  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Valid email required' });
      }

      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return user data (without password hash)
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      };

      res.status(200).json({
        success: true,
        user: userData,
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // PUT - Update user profile
  else if (req.method === 'PUT') {
    try {
      const { userId, firstName, lastName, phone } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const updates = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (phone !== undefined) updates.phone = phone;

      const result = await updateUserProfile(userId, updates);

      if (!result.success) {
        return res.status(500).json({ error: result.error || 'Failed to update profile' });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
