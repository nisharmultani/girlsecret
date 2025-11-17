/**
 * API Middleware Helper
 *
 * Provides utilities for composing multiple middlewares and protecting API routes
 */

import { strictCorsMiddleware, publicCorsMiddleware, webhookCorsMiddleware } from './cors';
import { verifyAdminAuth } from './adminAuth';

/**
 * Run multiple middlewares in sequence
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @param {Function[]} middlewares - Array of middleware functions
 * @returns {Promise<boolean>} - Returns true if all middlewares pass
 */
export async function runMiddleware(req, res, ...middlewares) {
  for (const middleware of middlewares) {
    const result = await middleware(req, res);

    // If middleware returns false, stop execution
    if (result === false) {
      return false;
    }
  }

  return true;
}

/**
 * Protect admin routes with CORS and authentication
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<Object|null>} - Returns admin user if authenticated, null otherwise
 */
export async function protectAdminRoute(req, res) {
  // Apply strict CORS (same origin only)
  const corsAllowed = strictCorsMiddleware(req, res);
  if (!corsAllowed) {
    return null; // CORS blocked the request
  }

  // Verify admin authentication
  const admin = await verifyAdminAuth(req, res);
  if (!admin) {
    return null; // Authentication failed
  }

  return admin;
}

/**
 * Protect user routes with CORS and authentication
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<Object|null>} - Returns user if authenticated, null otherwise
 */
export async function protectUserRoute(req, res) {
  // Apply public CORS
  const corsAllowed = publicCorsMiddleware(req, res);
  if (!corsAllowed) {
    return null; // CORS blocked the request
  }

  // Verify user authentication
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return null;
  }

  // TODO: Implement user token verification
  // For now, returning null - implement based on your auth system
  return null;
}

/**
 * Apply CORS to public API routes
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {boolean} - Returns true if CORS passed
 */
export function protectPublicRoute(req, res) {
  return publicCorsMiddleware(req, res);
}

/**
 * Apply webhook CORS (accepts any origin) - use for Stripe webhooks, etc.
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {boolean} - Returns true
 */
export function protectWebhookRoute(req, res) {
  return webhookCorsMiddleware(req, res);
}

/**
 * Validate HTTP method
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @param {string|string[]} allowedMethods - Allowed HTTP methods
 * @returns {boolean} - Returns true if method is allowed
 */
export function validateMethod(req, res, allowedMethods) {
  const methods = Array.isArray(allowedMethods) ? allowedMethods : [allowedMethods];

  if (!methods.includes(req.method)) {
    res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: methods,
    });
    return false;
  }

  return true;
}

/**
 * Simple rate limiting (in-memory)
 * WARNING: This is a basic implementation. For production, use Redis or a proper rate limiting service.
 *
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @param {Object} options - Rate limit options
 * @returns {boolean} - Returns true if under rate limit
 */
const rateLimitStore = new Map();

export function rateLimit(req, res, options = {}) {
  const { maxRequests = 10, windowMs = 60000, identifier = 'ip' } = options;

  // Get identifier (IP address or user ID)
  const key =
    identifier === 'ip'
      ? req.headers['x-forwarded-for'] || req.connection.remoteAddress
      : req.headers.authorization || req.cookies?.token;

  if (!key) {
    // Can't identify, allow request (or you could deny it)
    return true;
  }

  const now = Date.now();
  const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  // Increment count
  record.count++;
  rateLimitStore.set(key, record);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
  res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

  // Check if over limit
  if (record.count > maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: retryAfter,
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    });
    return false;
  }

  return true;
}

/**
 * Clean up old rate limit records (run periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
