// Authentication utilities using built-in crypto
import crypto from 'crypto';

// Hash password using crypto (built-in Node.js)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify password
export function verifyPassword(password, hashedPassword) {
  const [salt, originalHash] = hashedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// Generate session token
export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate password reset token
export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate reset token expiry (1 hour from now)
export function getResetTokenExpiry() {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);
  return expiry.toISOString();
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

// Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export function isValidPassword(password) {
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

// Session management (browser-side)
export const getSession = () => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  }
  return null;
};

export const saveSession = (user, token) => {
  if (typeof window !== 'undefined') {
    const session = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      token,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('userSession', JSON.stringify(session));
    window.dispatchEvent(new Event('authChanged'));
  }
};

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession');
    window.dispatchEvent(new Event('authChanged'));
  }
};

export const isAuthenticated = () => {
  return getSession() !== null;
};

export const getCurrentUser = () => {
  const session = getSession();
  return session ? session.user : null;
};
