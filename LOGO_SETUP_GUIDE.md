# Logo Setup Guide for GirlSecret

## Current Status

Your site currently uses a **text-based logo** with the name "GirlSecret" styled with:
- Font: Serif font family
- Size: 2xl-3xl (responsive)
- Style: `text-gradient` class (gradient text effect)

## Adding an Image Logo

### Option 1: Quick Text-to-Logo Conversion (Recommended for Now)

Since you don't have a logo file yet, here's how to continue using the text logo effectively:

**Current Implementation** (already in place):
```jsx
// Header, Footer, and Mobile Menu
<span className="text-2xl md:text-3xl font-serif font-bold text-gradient">
  GirlSecret
</span>
```

**This works well because:**
- ✅ No image loading required (faster)
- ✅ Scales perfectly on all screen sizes
- ✅ SEO-friendly text
- ✅ Gradient styling already applied
- ✅ Professional appearance

### Option 2: Add Custom Logo Image

When you have a logo file, follow these steps:

#### Step 1: Prepare Logo Files

You'll need **two versions** of your logo:

1. **Dark/Color Logo** - For white backgrounds
   - File: `public/logo.png` or `public/logo.svg`
   - Recommended size: 200x60px (or SVG for perfect scaling)
   - Background: Transparent
   - Text/design: Dark color or your brand colors

2. **White Logo** - For dark backgrounds
   - File: `public/logo-white.png` or `public/logo-white.svg`
   - Recommended size: 200x60px (or SVG)
   - Background: Transparent
   - Text/design: White

#### Step 2: Add Logo to Header

Update `/components/layout/Header.jsx`:

```jsx
import Image from 'next/image';

// Replace line 113-117 with:
<div className="flex lg:flex-1">
  <Link href="/" className="-m-1.5 p-1.5">
    <Image
      src="/logo.svg"
      alt="GirlSecret"
      width={150}
      height={45}
      priority
      className="h-8 md:h-10 w-auto"
    />
  </Link>
</div>

// Also update mobile menu logo (line 351-355):
<Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
  <Image
    src="/logo.svg"
    alt="GirlSecret"
    width={150}
    height={45}
    className="h-8 w-auto"
  />
</Link>
```

#### Step 3: Add Logo to Footer

Update `/components/layout/Footer.jsx`:

```jsx
import Image from 'next/image';

// Replace line 135-137 with:
<Image
  src="/logo-white.svg"
  alt="GirlSecret"
  width={150}
  height={45}
  className="h-10 w-auto"
/>
```

#### Step 4: Update next.config.js

Ensure images are configured correctly:

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['dl.airtable.com', 'v5.airtableusercontent.com'],
  },
}
```

## Logo File Recommendations

### Format
- **SVG** (Recommended): Perfect scaling, small file size
- **PNG**: Good quality, transparent background, 2x resolution for retina

### Dimensions
- **Width**: 150-200px
- **Height**: 40-60px
- **Aspect Ratio**: ~3:1 (horizontal logo works best in headers)

### Design Guidelines

**For Dark Logo** (white background):
```
- Primary brand color
- Clear, readable at small sizes
- Transparent background
- High contrast
```

**For White Logo** (dark background):
```
- Pure white (#FFFFFF) or off-white
- Same design as dark logo, just inverted colors
- Transparent background
- Visible against dark gray (#1F2937) and black (#000000)
```

## Where Logos Appear

### Current Text Logo Locations:
1. ✅ Header (desktop & mobile) - `/components/layout/Header.jsx:114`
2. ✅ Mobile menu - `/components/layout/Header.jsx:352`
3. ✅ Footer - `/components/layout/Footer.jsx:135`

### Additional Places to Consider Adding Logo:

4. **Email Templates** - `/lib/email.js`
   ```html
   <img src="https://yourdomain.com/logo.png" alt="GirlSecret" style="height: 50px;" />
   ```

5. **Invoice/Receipt PDFs** (future feature)

6. **Social Media Sharing** - Meta tags in `/pages/_document.jsx`
   ```html
   <meta property="og:image" content="https://yourdomain.com/logo-social.png" />
   ```

7. **Favicon** - Already handled by Next.js
   - Add `public/favicon.ico` (16x16, 32x32, 48x48)
   - Add `public/apple-touch-icon.png` (180x180)

## Creating Logo Files

### DIY Options (Free):

**1. Canva** (Easiest)
- Go to [canva.com](https://canva.com)
- Search templates: "Luxury logo" or "Lingerie brand logo"
- Customize with "GirlSecret" text
- Download as PNG (transparent) or SVG

**2. Figma** (More Control)
- Free design tool
- Create logo from scratch
- Export as SVG for perfect quality

**3. Font-Based Logo**
- Use elegant fonts like: Playfair Display, Bodoni, Didot
- Add simple icon/flourish
- Export from any design tool

### Professional Options ($):

**1. Fiverr** ($5-$50)
- Search: "luxury lingerie logo"
- Turnaround: 1-3 days
- Get source files (AI, SVG, PNG)

**2. 99designs** ($200+)
- Logo design contest
- Multiple designers compete
- Choose best design

**3. Professional Designer** ($500+)
- Full brand identity
- Multiple variations
- Brand guidelines

## Quick Fix: Create Simple Logo Now

If you need a logo immediately, here's a 5-minute solution:

1. **Open Canva**
2. **Create design** → Custom size: 600x180px
3. **Add text**: "GirlSecret"
   - Font: Playfair Display Bold
   - Color: #000000
4. **Optional**: Add simple accent (heart, diamond, flourish)
5. **Download**:
   - PNG with transparent background
   - Also download with white text for dark backgrounds
6. **Save as**:
   - `public/logo.png` (dark version)
   - `public/logo-white.png` (white version)

## Testing Your Logo

After adding logo files:

```bash
# 1. Start development server
npm run dev

# 2. Visit these pages and check logo:
http://localhost:3000          # Header (light logo)
http://localhost:3000/shop     # Header on all pages
# Scroll down to footer         # Footer (white logo)
# Open mobile menu              # Mobile logo

# 3. Test different screen sizes:
# - Desktop (1920px)
# - Tablet (768px)
# - Mobile (375px)
```

### Logo Checklist:
- [ ] Visible at all screen sizes
- [ ] Crisp and clear (not pixelated)
- [ ] Loads quickly
- [ ] Works on white background (header)
- [ ] Works on dark background (footer)
- [ ] Mobile-friendly
- [ ] Clickable and links to homepage

## Current Gradient Text Effect

Your current `text-gradient` class likely applies this styling:

```css
/* Check your tailwind.config.js or globals.css */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

This creates a beautiful gradient effect. If you love this look, you can:
1. Keep it as is (no logo file needed)
2. Recreate it in your image logo design
3. Use it as inspiration for your brand colors

## Favicon Setup

While setting up your logo, also create a favicon:

```
public/
  ├── favicon.ico           # 16x16, 32x32, 48x48
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  ├── apple-touch-icon.png  # 180x180
  └── android-chrome-192x192.png
```

**Quick Favicon Creation:**
1. Use your logo design
2. Go to [favicon.io](https://favicon.io)
3. Upload logo or create text-based favicon
4. Download package
5. Extract to `public/` folder

## Summary & Next Steps

**Current Status**: ✅ Text logo working perfectly

**If you want to add image logo:**
1. Create logo files (dark + white versions)
2. Save to `public/logo.svg` and `public/logo-white.svg`
3. Update Header.jsx (3 places)
4. Update Footer.jsx (1 place)
5. Test on all devices
6. Create favicon files

**Recommendation**:
- For immediate launch (Nov 26), your current text logo is professional and works well
- Add image logo post-launch when you have time to design it properly
- The gradient text effect is actually quite nice and modern!

Need help with anything else? The implementation is ready whenever you have logo files! 🎨
