import { hashPassword, verifyPassword, generateToken } from '../../../../lib/auth';
import crypto from 'crypto';

// Default admin credentials
const DEFAULT_ADMIN_EMAIL = 'girlsecretuk@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'Abcd@3303';

// Hash the admin password on first use
let adminPasswordHash = null;
function getAdminPasswordHash() {
  if (!adminPasswordHash) {
    // Use environment variable if set, otherwise use default
    const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
    adminPasswordHash = hashPassword(password);
  }
  return adminPasswordHash;
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate session token
    const token = generateToken();

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
