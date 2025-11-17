/**
 * CORS (Cross-Origin Resource Sharing) Middleware
 *
 * Protects API routes by restricting which domains can access them.
 * This prevents unauthorized websites from calling your API endpoints.
 */

/**
 * CORS middleware for Next.js API routes
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @param {Object} options - CORS configuration options
 * @returns {boolean} - Returns true if origin is allowed, false otherwise
 */
export function corsMiddleware(req, res, options = {}) {
  // Get allowed origins from environment or use defaults
  const allowedOrigins = options.allowedOrigins || getAllowedOrigins();

  // Get the origin of the incoming request
  const origin = req.headers.origin;

  // Check if origin is in allowed list
  const isAllowedOrigin = allowedOrigins.includes(origin) || allowedOrigins.includes('*');

  // Set CORS headers if origin is allowed
  if (isAllowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (allowedOrigins.includes('*')) {
    // Allow all origins if * is in the list (not recommended for production)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Set allowed methods
  const allowedMethods = options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));

  // Set allowed headers
  const allowedHeaders = options.headers || [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ];
  res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));

  // Set credentials (cookies, authorization headers)
  const allowCredentials = options.credentials !== false;
  if (allowCredentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Set max age for preflight cache (24 hours)
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false; // Stop execution, preflight handled
  }

  // Check if origin is allowed
  if (!isAllowedOrigin && !allowedOrigins.includes('*')) {
    res.status(403).json({
      error: 'CORS policy: Origin not allowed',
      origin: origin,
    });
    return false;
  }

  return true; // Origin is allowed, continue
}

/**
 * Get allowed origins from environment variables
 * @returns {string[]} - Array of allowed origins
 */
function getAllowedOrigins() {
  const envOrigins = process.env.ALLOWED_ORIGINS;

  if (envOrigins) {
    // Parse comma-separated list from environment
    return envOrigins.split(',').map(origin => origin.trim());
  }

  // Default allowed origins
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return [
    baseUrl,
    'http://localhost:3000',
    'http://localhost:3001',
    // Add your production domain
    'https://girlsecret.co.uk',
    'https://www.girlsecret.co.uk',
  ];
}

/**
 * Strict CORS for admin routes - only allow same origin
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {boolean} - Returns true if allowed, false otherwise
 */
export function strictCorsMiddleware(req, res) {
  return corsMiddleware(req, res, {
    allowedOrigins: [
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  });
}

/**
 * Public CORS for public API routes (still restricts to known origins)
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {boolean} - Returns true if allowed, false otherwise
 */
export function publicCorsMiddleware(req, res) {
  return corsMiddleware(req, res, {
    allowedOrigins: getAllowedOrigins(),
    methods: ['GET', 'POST'],
    credentials: false,
  });
}

/**
 * No CORS restrictions (for webhooks and trusted external services)
 * WARNING: Only use for specific endpoints that need to accept requests from any origin
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {boolean} - Always returns true
 */
export function webhookCorsMiddleware(req, res) {
  return corsMiddleware(req, res, {
    allowedOrigins: ['*'],
    methods: ['POST'],
    credentials: false,
  });
}
