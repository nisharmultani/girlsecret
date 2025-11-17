# CORS & API Security Setup Guide

This guide explains how to implement CORS (Cross-Origin Resource Sharing) and secure your API routes.

## 📋 Table of Contents

1. [What is CORS?](#what-is-cors)
2. [Why You Need It](#why-you-need-it)
3. [Quick Start](#quick-start)
4. [Usage Examples](#usage-examples)
5. [Environment Variables](#environment-variables)
6. [Security Best Practices](#security-best-practices)

---

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature that controls which websites can access your API endpoints. Without CORS protection:

- **Any website** can call your API routes
- Malicious sites can delete data, modify orders, or steal information
- Your admin panel could be compromised from any domain

**Example of the problem:**

```javascript
// Without CORS, this works from ANY website:
fetch('https://girlsecret.co.uk/api/admin/products/delete', {
  method: 'DELETE',
  body: JSON.stringify({ id: 'rec123' })
});
```

## Why You Need It

### Current Security Issues

✅ **Before CORS (Current State):**
- ❌ Any website can call your API
- ❌ Admin endpoints accessible from anywhere
- ❌ No origin verification
- ❌ Vulnerable to CSRF attacks

✅ **After CORS (Secured):**
- ✅ Only your domain can call APIs
- ✅ Admin routes restricted to same origin
- ✅ Public routes have controlled access
- ✅ CSRF protection layer

---

## Quick Start

### 1. Install Dependencies (Optional)

For production, you may want to add a proper rate limiting library:

```bash
npm install express-rate-limit
```

### 2. Set Environment Variables

Add to your `.env.local` file:

```bash
# Your production domain
NEXT_PUBLIC_BASE_URL=https://girlsecret.co.uk

# Allowed origins (comma-separated)
ALLOWED_ORIGINS=https://girlsecret.co.uk,https://www.girlsecret.co.uk

# Admin credentials
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

### 3. Update Your API Routes

See [Usage Examples](#usage-examples) below.

---

## Usage Examples

### Example 1: Protect Admin Routes (RECOMMENDED)

**File:** `/pages/api/admin/products/delete.js`

```javascript
import { protectAdminRoute, validateMethod } from '../../../../lib/apiMiddleware';
import { deleteProduct } from '../../../../lib/airtable';

export default async function handler(req, res) {
  // Validate HTTP method
  if (!validateMethod(req, res, 'DELETE')) {
    return; // Method not allowed
  }

  // Protect admin route (CORS + Authentication)
  const admin = await protectAdminRoute(req, res);
  if (!admin) {
    return; // Blocked by CORS or authentication
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    await deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}
```

### Example 2: Public API with CORS

**File:** `/pages/api/search.js`

```javascript
import { protectPublicRoute, validateMethod } from '../../lib/apiMiddleware';
import { searchProducts } from '../../lib/airtable';

export default async function handler(req, res) {
  // Apply public CORS (allows known origins)
  if (!protectPublicRoute(req, res)) {
    return; // Blocked by CORS
  }

  // Validate method
  if (!validateMethod(req, res, 'GET')) {
    return;
  }

  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await searchProducts(query);

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
}
```

### Example 3: Webhook Route (No CORS)

**File:** `/pages/api/payment/webhook.js`

```javascript
import { protectWebhookRoute, validateMethod } from '../../../lib/apiMiddleware';
import { processStripeWebhook } from '../../../lib/stripe';

export default async function handler(req, res) {
  // Webhooks need to accept requests from Stripe's servers
  if (!protectWebhookRoute(req, res)) {
    return;
  }

  if (!validateMethod(req, res, 'POST')) {
    return;
  }

  try {
    const signature = req.headers['stripe-signature'];
    const event = await processStripeWebhook(req.body, signature);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ error: 'Webhook processing failed' });
  }
}
```

### Example 4: Rate Limited Contact Form

**File:** `/pages/api/contact.js`

```javascript
import { protectPublicRoute, validateMethod, rateLimit } from '../../lib/apiMiddleware';
import { sendContactEmail } from '../../lib/email';

export default async function handler(req, res) {
  // Apply CORS
  if (!protectPublicRoute(req, res)) {
    return;
  }

  // Validate method
  if (!validateMethod(req, res, 'POST')) {
    return;
  }

  // Apply rate limiting: 5 requests per 15 minutes
  if (!rateLimit(req, res, { maxRequests: 5, windowMs: 15 * 60 * 1000 })) {
    return; // Rate limit exceeded
  }

  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' });
    }

    await sendContactEmail({ name, email, message });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
```

### Example 5: Custom Middleware Composition

**File:** `/pages/api/admin/orders.js`

```javascript
import { runMiddleware, strictCorsMiddleware, rateLimit, validateMethod } from '../../../lib/apiMiddleware';
import { verifyAdminAuth } from '../../../lib/adminAuth';
import { getAllOrders } from '../../../lib/airtable';

export default async function handler(req, res) {
  // Run multiple middlewares in sequence
  const allowed = await runMiddleware(
    req,
    res,
    // 1. Apply strict CORS
    strictCorsMiddleware,
    // 2. Validate HTTP method
    (req, res) => validateMethod(req, res, 'GET'),
    // 3. Rate limit (10 requests per minute)
    (req, res) => rateLimit(req, res, { maxRequests: 10, windowMs: 60000 })
  );

  if (!allowed) {
    return; // One of the middlewares blocked the request
  }

  // Verify admin authentication
  const admin = await verifyAdminAuth(req, res);
  if (!admin) {
    return; // Not authenticated
  }

  try {
    const orders = await getAllOrders();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
```

---

## Environment Variables

### Required Variables

Add these to your `.env.local` file:

```bash
# Base URL (your domain)
NEXT_PUBLIC_BASE_URL=https://girlsecret.co.uk

# Allowed origins for CORS (comma-separated)
ALLOWED_ORIGINS=https://girlsecret.co.uk,https://www.girlsecret.co.uk

# Admin credentials
ADMIN_EMAIL=admin@girlsecret.co.uk
ADMIN_PASSWORD=your-secure-password-here
```

### Development vs Production

**Development (`.env.local`):**
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
ADMIN_EMAIL=dev@localhost
ADMIN_PASSWORD=dev-password-123
```

**Production (Vercel/hosting platform):**
```bash
NEXT_PUBLIC_BASE_URL=https://girlsecret.co.uk
ALLOWED_ORIGINS=https://girlsecret.co.uk,https://www.girlsecret.co.uk
ADMIN_EMAIL=admin@girlsecret.co.uk
ADMIN_PASSWORD=SecureP@ssw0rd!2024
```

---

## Security Best Practices

### 1. Use Strict CORS for Admin Routes

```javascript
// ✅ GOOD - Strict CORS for admin
const admin = await protectAdminRoute(req, res);

// ❌ BAD - No CORS protection
const products = await getAllProducts();
```

### 2. Never Allow All Origins in Production

```javascript
// ❌ DANGEROUS - Never do this
ALLOWED_ORIGINS=*

// ✅ SAFE - Explicit domains only
ALLOWED_ORIGINS=https://girlsecret.co.uk,https://www.girlsecret.co.uk
```

### 3. Implement Rate Limiting

```javascript
// ✅ GOOD - Rate limit sensitive endpoints
if (!rateLimit(req, res, { maxRequests: 5, windowMs: 60000 })) {
  return;
}
```

### 4. Validate HTTP Methods

```javascript
// ✅ GOOD - Explicit method validation
if (!validateMethod(req, res, 'DELETE')) {
  return;
}

// ❌ BAD - Accepting any method
if (req.method !== 'DELETE') {
  // Still processes OPTIONS, HEAD, etc.
}
```

### 5. Use HTTPS Only in Production

In your Next.js config:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

---

## Testing CORS

### Test from Browser Console

**1. Test Blocked Request (should fail):**

```javascript
fetch('https://girlsecret.co.uk/api/admin/products', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(console.log)
  .catch(err => console.error('Blocked by CORS:', err));
```

**2. Test Allowed Request (should work):**

Visit your own site and run the same fetch. It should succeed.

### Test with cURL

```bash
# Test CORS headers
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: DELETE" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://girlsecret.co.uk/api/admin/products
```

Should return `403 Forbidden` or no CORS headers.

---

## Troubleshooting

### Issue: "CORS policy: Origin not allowed"

**Solution:** Add your domain to `ALLOWED_ORIGINS`:

```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Issue: Webhook from Stripe fails

**Solution:** Use `protectWebhookRoute()` instead of strict CORS:

```javascript
// For webhooks that need to accept external requests
if (!protectWebhookRoute(req, res)) {
  return;
}
```

### Issue: Development requests blocked

**Solution:** Add localhost to allowed origins:

```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Issue: OPTIONS requests fail

**Solution:** CORS middleware automatically handles OPTIONS. Make sure you return early:

```javascript
if (req.method === 'OPTIONS') {
  return res.status(200).end();
}
```

---

## Migration Checklist

Apply CORS to all your API routes:

### Admin Routes (Use `protectAdminRoute`)
- [ ] `/api/admin/products.js`
- [ ] `/api/admin/products/create.js`
- [ ] `/api/admin/products/update.js`
- [ ] `/api/admin/products/delete.js`
- [ ] `/api/admin/orders.js`
- [ ] `/api/admin/orders/update.js`
- [ ] `/api/admin/referrals.jsx`

### Public Routes (Use `protectPublicRoute`)
- [ ] `/api/search.js`
- [ ] `/api/contact.js`
- [ ] `/api/newsletter/subscribe.js`
- [ ] `/api/reviews.js`
- [ ] `/api/validate-promo.js`

### Webhook Routes (Use `protectWebhookRoute`)
- [ ] `/api/payment/webhook.js`

### User Routes (Use `protectUserRoute`)
- [ ] `/api/user/orders.js`
- [ ] `/api/user/addresses.js`
- [ ] `/api/wishlist/*.js`

---

## Next Steps

1. ✅ Update all admin API routes with `protectAdminRoute()`
2. ✅ Add rate limiting to contact form and login
3. ✅ Set environment variables in production
4. ✅ Test CORS from different origins
5. ✅ Monitor rate limit headers in production
6. ✅ Consider adding Redis for distributed rate limiting

---

## Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js API Routes Security](https://nextjs.org/docs/api-routes/introduction)
- [OWASP CORS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CORS_Cheat_Sheet.html)

---

**Created:** 2025-11-17
**Author:** Claude Code
**Status:** ✅ Ready for Implementation
