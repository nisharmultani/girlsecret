import { findUserByEmail } from '../../../lib/airtable';
import { verifyPassword, generateToken } from '../../../lib/auth';
import { protectPublicRoute, validateMethod, rateLimit } from '../../../lib/apiMiddleware';

export default async function handler(req, res) {
  // Apply CORS protection
  if (!protectPublicRoute(req, res)) {
    return; // Blocked by CORS
  }

  // Validate HTTP method
  if (!validateMethod(req, res, 'POST')) {
    return; // Method not allowed
  }

  // Apply rate limiting: 10 login attempts per 15 minutes per IP
  if (!rateLimit(req, res, { maxRequests: 10, windowMs: 15 * 60 * 1000 })) {
    return; // Rate limit exceeded
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
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.active) {
      return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
    }

    // Verify password
    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
    res.status(500).json({ error: 'Server error during login' });
  }
}
