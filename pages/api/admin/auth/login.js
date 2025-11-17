import { hashPassword, verifyPassword, generateToken } from '../../../../lib/auth';
import { strictCorsMiddleware, validateMethod, rateLimit } from '../../../../lib/apiMiddleware';
import crypto from 'crypto';

// Hash the admin password on first use
let adminPasswordHash = null;
function getAdminPasswordHash() {
  if (!adminPasswordHash) {
    // Check if custom admin password hash is provided in env
    if (process.env.ADMIN_PASSWORD_HASH) {
      adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    } else if (process.env.ADMIN_PASSWORD) {
      // Hash the password from environment
      adminPasswordHash = hashPassword(process.env.ADMIN_PASSWORD);
    } else {
      throw new Error('ADMIN_PASSWORD or ADMIN_PASSWORD_HASH must be set in environment variables');
    }
  }
  return adminPasswordHash;
}

function getAdminEmail() {
  if (!process.env.ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL must be set in environment variables');
  }
  return process.env.ADMIN_EMAIL;
}

export default async function handler(req, res) {
  // Apply strict CORS (same origin only)
  if (!strictCorsMiddleware(req, res)) {
    return; // Blocked by CORS
  }

  // Validate HTTP method
  if (!validateMethod(req, res, 'POST')) {
    return; // Method not allowed
  }

  // Apply rate limiting: 5 login attempts per 15 minutes per IP
  // This prevents brute force attacks
  if (!rateLimit(req, res, { maxRequests: 5, windowMs: 15 * 60 * 1000 })) {
    return; // Rate limit exceeded
  }

  try {
    const { email, password, remember } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if email matches admin email
    const adminEmail = getAdminEmail();
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      // Use generic error to prevent email enumeration
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const adminHash = getAdminPasswordHash();
    const isValidPassword = verifyPassword(password, adminHash);

    if (!isValidPassword) {
      // Failed login attempt - rate limiting already applied above
      // TODO: Implement proper audit logging for security events
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate session token
    const token = generateToken();

    // TODO: Implement proper audit logging for successful admin logins

    // Return success with token and admin info
    return res.status(200).json({
      success: true,
      token,
      admin: {
        email: adminEmail,
        name: 'Admin',
        role: 'admin',
      },
      message: 'Login successful',
    });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred during login' });
  }
}
