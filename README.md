# GirlSecret - Luxury E-Commerce Website

A professional, fully-featured e-commerce website built with Next.js, React, Tailwind CSS, and Airtable.

## Features

### 🛍️ E-Commerce Features
- **Product Catalog** - Browse all products with filtering and sorting
- **Product Details** - Detailed product pages with image gallery, reviews, and social sharing
- **Shopping Cart** - Add products, update quantities, remove items
- **Checkout** - Complete checkout flow with form validation
- **Promo Codes** - Apply discount codes at checkout
- **Referral System** - Share referral links and track referrals

### 📱 User Experience
- **Responsive Design** - Mobile-first design that works on all devices
- **Luxury UI** - Beautiful, premium design with smooth animations
- **Fast Performance** - Optimized images with Next.js Image component
- **Accessible** - WCAG compliant with proper ARIA labels

### 🔧 Technical Features
- **Airtable Backend** - Easy product management through Airtable
- **SEO Optimized** - Meta tags, Open Graph, structured data, and sitemaps
- **Google Tag Manager** - Integrated analytics and tracking
- **Google AdSense** - Monetization support
- **Social Sharing** - Share products on Facebook, Twitter, WhatsApp, Pinterest
- **Product Reviews** - Customer review and rating system

### 📄 Pages
- Home page with hero section and featured products
- Shop page with filtering and sorting
- Product detail pages with reviews
- Shopping cart
- Checkout with form validation
- About Us
- Contact Us
- FAQ
- Privacy Policy
- Terms of Service

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Forms**: React Hook Form
- **UI Components**: Headless UI
- **Database**: Airtable
- **Image Optimization**: Next/Image
- **Routing**: Next/Link

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- An Airtable account
- npm or yarn package manager

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Airtable

Create an Airtable base with the following tables:

#### Products Table
Fields:
- `Name` (Single line text)
- `Description` (Long text)
- `Price` (Number)
- `SalePrice` (Number) - Optional
- `Category` (Single line text)
- `Images` (Attachment) - Multiple images
- `InStock` (Checkbox)
- `Featured` (Checkbox)
- `Keywords` (Long text) - For SEO
- `Slug` (Single line text) - URL-friendly product name

#### Reviews Table
Fields:
- `ProductId` (Single line text) - Links to Products
- `Name` (Single line text)
- `Email` (Email)
- `Rating` (Number, 1-5)
- `Comment` (Long text)
- `CreatedAt` (Date)
- `Approved` (Checkbox)

#### PromoCodes Table
Fields:
- `Code` (Single line text)
- `DiscountType` (Single select: percentage, fixed)
- `DiscountValue` (Number)
- `MinPurchase` (Number)
- `MaxDiscount` (Number) - Optional
- `ExpiryDate` (Date)
- `Active` (Checkbox)

#### Referrals Table
Fields:
- `ReferrerEmail` (Email)
- `ReferredEmail` (Email)
- `CreatedAt` (Date)
- `Status` (Single select: Pending, Completed)

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
# Airtable Configuration
NEXT_PUBLIC_AIRTABLE_API_KEY=your_airtable_api_key
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_airtable_base_id
NEXT_PUBLIC_AIRTABLE_TABLE_NAME=Products

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=GirlSecret
NEXT_PUBLIC_SITE_DESCRIPTION=Luxury beauty and lifestyle products
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## SEO Keywords

The website is optimized for the following keywords:
- Luxury beauty products
- Premium skincare
- Women's beauty essentials
- Luxury cosmetics
- Beauty lifestyle products
- High-end beauty brands
- Exclusive beauty products
- Professional beauty care

## Customization

### Colors

Update colors in `tailwind.config.js`:

```js
colors: {
  luxury: { /* Your brand colors */ },
  gold: { /* Your accent colors */ }
}
```

### Fonts

Update fonts in `tailwind.config.js` and import them in `styles/globals.css`.

### Logo

Add your logo to `/public/logo.png` and update references in components.

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@girlsecret.com

## License

Copyright © 2024 GirlSecret. All rights reserved.

## Features Checklist

- ✅ Product catalog with Airtable integration
- ✅ Shopping cart functionality
- ✅ Promo code system
- ✅ Referral link system
- ✅ Social media sharing
- ✅ Product reviews and ratings
- ✅ SEO optimization (meta tags, structured data)
- ✅ Google Tag Manager integration
- ✅ Google AdSense integration
- ✅ Responsive design
- ✅ Form validation with react-hook-form
- ✅ Mobile menu with Headless UI
- ✅ Image optimization with Next/Image
- ✅ Luxury design theme
- ✅ All required pages (Home, Shop, Product, Cart, Checkout, About, Contact, FAQ, Privacy, Terms)

## Next Steps

1. Add your products to Airtable
2. Customize the design to match your brand
3. Set up payment processing (Stripe, PayPal, etc.)
4. Configure email notifications
5. Set up analytics and tracking
6. Add your domain and SSL certificate
7. Launch and promote!
