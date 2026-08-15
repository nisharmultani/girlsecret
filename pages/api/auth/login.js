import { findUserByEmail } from '../../../lib/db';
import { verifyPassword, generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'No account found with this email address',
        suggestion: 'Please register first or check your email spelling',
        action: 'register'
      });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
    }

    // Verify password
    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        error: 'Incorrect password',
        suggestion: 'Please check your password or use "Forgot Password" to reset it',
        action: 'wrong_password'
      });
    }

    // Generate session token
    const token = generateToken();

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
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
}
