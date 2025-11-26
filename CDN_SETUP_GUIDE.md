# CDN Setup Guide for GirlSecret

This guide explains how to set up a Content Delivery Network (CDN) for your static assets to improve performance and reduce load times globally.

## Why Use a CDN?

### Benefits
- **Faster Load Times**: Assets are served from servers closer to your users
- **Reduced Server Load**: Static files are offloaded from your main server
- **Better Performance**: Cached assets load instantly on repeat visits
- **Global Reach**: Fast delivery worldwide
- **Cost Savings**: Reduced bandwidth usage on your main server
- **DDoS Protection**: Most CDNs include security features

## Recommended CDN Solutions

### 1. **Cloudflare (Recommended for Beginners)**

✅ **Best For**: Complete beginners, automatic setup
📊 **Pricing**: Free tier available (generous limits)
🚀 **Setup Time**: 5-10 minutes

#### Setup Steps:
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update your domain's nameservers (provided by Cloudflare)
4. Enable "Auto Minify" for HTML, CSS, JS
5. Enable "Brotli" compression
6. Set caching rules for static assets

#### Configuration:
```javascript
// In next.config.js - Cloudflare automatically handles this
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
}
```

**Pros**: Free, easy setup, includes security features, no code changes needed
**Cons**: Less control over caching behavior

---

### 2. **Vercel Edge Network (Recommended for Next.js)**

✅ **Best For**: Next.js projects (this project!)
📊 **Pricing**: Free for hobby projects, scales with usage
🚀 **Setup Time**: Instant (automatic)

#### Setup Steps:
1. Deploy to Vercel: `vercel deploy`
2. That's it! CDN is automatic

#### Why It's Perfect for GirlSecret:
- Zero configuration
- Optimized for Next.js
- Automatic image optimization
- Edge functions support
- Built-in analytics

**Pros**: Zero setup, optimal for Next.js, free tier
**Cons**: Tied to Vercel hosting

---

### 3. **AWS CloudFront + S3**

✅ **Best For**: Advanced users, maximum control
📊 **Pricing**: Pay-as-you-go (very affordable for small sites)
🚀 **Setup Time**: 30-60 minutes

#### Setup Steps:

**Step 1: Create S3 Bucket**
```bash
# Install AWS CLI
npm install -g aws-cli

# Configure AWS credentials
aws configure

# Create bucket for static assets
aws s3 mb s3://girlsecret-static
```

**Step 2: Upload Static Assets**
```bash
# Sync public folder to S3
aws s3 sync ./public s3://girlsecret-static/public --acl public-read

# Sync Next.js static files after build
npm run build
aws s3 sync ./.next/static s3://girlsecret-static/_next/static --acl public-read
```

**Step 3: Create CloudFront Distribution**
```javascript
// Use AWS Console or CloudFormation
{
  "Origins": [
    {
      "DomainName": "girlsecret-static.s3.amazonaws.com",
      "Id": "S3-girlsecret-static"
    }
  ],
  "CacheBehaviors": [
    {
      "PathPattern": "*.jpg",
      "TargetOriginId": "S3-girlsecret-static",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "DefaultTTL": 86400
    }
  ]
}
```

**Step 4: Update Environment Variables**
```bash
# .env.production
NEXT_PUBLIC_CDN_URL=https://d1234567890.cloudfront.net
```

**Step 5: Update next.config.js**
```javascript
module.exports = {
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
  images: {
    domains: ['d1234567890.cloudfront.net'],
  },
}
```

**Pros**: Maximum control, highly scalable, great pricing
**Cons**: Complex setup, requires AWS knowledge

---

### 4. **Bunny CDN**

✅ **Best For**: Best price/performance ratio
📊 **Pricing**: $1/month (1TB bandwidth), pay-as-you-go after
🚀 **Setup Time**: 15-20 minutes

#### Setup Steps:
1. Sign up at [bunny.net](https://bunny.net)
2. Create a Pull Zone
3. Point it to your domain
4. Configure caching rules

**Pros**: Excellent performance, very affordable, simple pricing
**Cons**: Requires some configuration

---

## Implementation for GirlSecret

### Quick Start: Use Vercel (Easiest)

Since your project is built with Next.js, the fastest way to get CDN benefits is to deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Done!** Your static assets are now served from Vercel's global Edge Network automatically.

---

### Alternative: Cloudflare (Free & Easy)

If you're hosting elsewhere (like on your own VPS), add Cloudflare:

1. **Sign up**: https://dash.cloudflare.com/sign-up
2. **Add your domain**: `girlsecret.com`
3. **Update nameservers** at your domain registrar:
   ```
   NS 1: etta.ns.cloudflare.com
   NS 2: sid.ns.cloudflare.com
   ```
4. **Enable optimizations** in Cloudflare dashboard:
   - Speed → Optimization → Auto Minify (check all)
   - Speed → Optimization → Brotli (ON)
   - Caching → Configuration → Caching Level (Standard)

5. **Page Rules** for static assets:
   ```
   URL Pattern: *girlsecret.com/images/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 month
   Browser Cache TTL: 1 month
   ```

   ```
   URL Pattern: *girlsecret.com/_next/static/*
   Cache Level: Cache Everything
   Edge Cache TTL: 1 year
   Browser Cache TTL: 1 year
   ```

---

## Asset Optimization Best Practices

### 1. Image Optimization

```javascript
// Use Next.js Image component (already implemented)
import Image from 'next/image';

<Image
  src="/images/product.jpg"
  alt="Product"
  width={800}
  height={600}
  priority={false} // Only true for above-fold images
  quality={85} // Good balance
/>
```

### 2. Font Optimization

```javascript
// pages/_document.jsx - already implemented
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

### 3. Static File Caching Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 4. Compress Images Before Upload

```bash
# Install image optimization tool
npm install -g sharp-cli

# Optimize all images
npx sharp -i public/images/* -o public/images/optimized/ --quality 85

# Or use online tools:
# - TinyPNG.com
# - Squoosh.app (from Google)
# - ImageOptim (Mac)
```

---

## Monitoring CDN Performance

### Google PageSpeed Insights
Check your site: https://pagespeed.web.dev/

**Target Scores**:
- Performance: 90+
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s

### Cloudflare Analytics
If using Cloudflare, check:
- Dashboard → Analytics
- Cached vs. Uncached requests (aim for 80%+ cached)
- Bandwidth savings

### Real User Monitoring
Add to your GTM for real user data:
```javascript
// Track page load time
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'pageLoadTime',
    loadTime: loadTime,
  });
});
```

---

## Cost Comparison (for ~100GB/month traffic)

| Provider | Monthly Cost | Setup Complexity | Features |
|----------|--------------|------------------|----------|
| **Vercel** | Free (hobby) | ⭐ Easy | Excellent |
| **Cloudflare** | Free | ⭐⭐ Easy | Great |
| **AWS CloudFront** | ~$8.50 | ⭐⭐⭐⭐ Complex | Maximum |
| **Bunny CDN** | ~$1 | ⭐⭐⭐ Medium | Great |

---

## Recommended Setup for GirlSecret

### For Launch (Nov 26):
1. **Deploy to Vercel** - Instant CDN, zero config
2. **Add Cloudflare** (optional) - Extra security layer

### After Launch:
1. Monitor traffic and costs
2. If traffic grows significantly, consider AWS CloudFront for better pricing
3. Optimize images regularly
4. Set up monitoring in Google Analytics

---

## Quick Wins (Do These Now)

### 1. Add Caching Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 2. Enable Compression
```bash
# Already handled by Vercel/Cloudflare automatically
# If self-hosting, enable gzip/brotli in nginx/apache
```

### 3. Lazy Load Images
```javascript
// Already implemented with Next.js Image component
// Just ensure loading="lazy" for below-fold images
<Image loading="lazy" ... />
```

---

## Troubleshooting

### Images not loading from CDN
- Check domain is allowed in `next.config.js`
- Verify CORS headers on S3/CDN
- Clear browser cache

### Stale content showing
- Purge CDN cache (Cloudflare: Cache → Purge Everything)
- Check cache headers are correct
- Ensure versioned URLs for changed assets

### Slow load times despite CDN
- Run PageSpeed Insights
- Check if assets are actually being cached
- Optimize image sizes (often the #1 issue)

---

## Summary

**For GirlSecret, I recommend:**

1. **Primary**: Deploy to Vercel (easiest, zero config, perfect for Next.js)
2. **Bonus**: Add Cloudflare DNS (free tier) for extra security and analytics
3. **Future**: Consider AWS CloudFront if you exceed Vercel's free tier

This gives you world-class CDN performance with minimal effort and zero cost to start.

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Cloudflare Docs: https://developers.cloudflare.com/
- Next.js Image Optimization: https://nextjs.org/docs/basic-features/image-optimization

All these solutions are production-ready and used by major companies. Choose based on your comfort level with the technology.
