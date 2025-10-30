import { createUser, findUserByEmail } from '../../../lib/airtable';
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password and create user
    const passwordHash = hashPassword(password);
    const result = await createUser(email, passwordHash, firstName, lastName, phone);

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to create user' });
    }

    // Generate session token
    const token = generateToken();

    res.status(201).json({
      success: true,
      user: result.user,
      token,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
}
