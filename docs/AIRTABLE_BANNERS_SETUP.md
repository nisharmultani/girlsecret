# Airtable Dynamic Banners Setup Guide

This guide will help you set up dynamic hero header and promotional banners in Airtable for your GirlSecret website.

## Overview

The home page now supports dynamic banners that you can manage through Airtable:
- **Hero Banners**: Main carousel slides at the top of the home page
- **Promotional Banners**: Additional banner sections below the hero carousel

## Table Structures

### 1. HeroBanners Table

Create a new table in your Airtable base called `HeroBanners` with the following fields:

| Field Name | Field Type | Description | Required | Example |
|------------|------------|-------------|----------|---------|
| **Title** | Single line text | Main heading text | Optional | "Elegance Redefined" |
| **Subtitle** | Single line text | Subheading text | Optional | "Timeless Beauty" |
| **Description** | Long text | Supporting description | Optional | "Discover intimate apparel designed for confidence and comfort." |
| **CTAText** | Single line text | Button text | Optional | "Shop Collection" |
| **CTALink** | URL | Button destination | Optional | "/shop" or "https://..." |
| **Image** | Attachment | Hero image (recommended: 1920x1080px) | **Required** | Upload image file |
| **Order** | Number | Display order (lower numbers first) | **Required** | 1, 2, 3, 4... |
| **Active** | Checkbox | Enable/disable this banner | **Required** | ✓ |

**Note:** All text fields (Title, Subtitle, Description, CTAText, CTALink) are **optional**. This allows you to create:
- **Image-only slides** - Just upload an image without any text
- **Partial text slides** - Include only the fields you want (e.g., just title and button)
- **Full content slides** - Use all text fields for rich storytelling

The dark overlay is automatically hidden when no text is present, ensuring your images display with full vibrancy.

### 2. PromoBanners Table

Create a new table in your Airtable base called `PromoBanners` with the following fields:

| Field Name | Field Type | Description | Example |
|------------|------------|-------------|---------|
| **Title** | Single line text | Banner title | "New Collection" |
| **Subtitle** | Single line text | Banner subtitle | "Discover Timeless Elegance" |
| **ButtonText** | Single line text | Button label | "Explore Now" |
| **ButtonLink** | URL | Button destination | "/shop" or specific URL |
| **Image** | Attachment | Banner image (recommended: 1920x400px) | Upload image file |
| **ImageAlt** | Single line text | Image alt text for SEO | "New Collection Banner" |
| **Height** | Single line text | Tailwind CSS height class | "h-80 md:h-96" |
| **Order** | Number | Display order | 1, 2, 3... |
| **Active** | Checkbox | Enable/disable this banner | ✓ |

## Setup Instructions

### Step 1: Create the Tables

1. Log in to your Airtable account
2. Open your GirlSecret base
3. Create two new tables: `HeroBanners` and `PromoBanners`
4. Add the fields listed above to each respective table

### Step 2: Add Sample Data

#### HeroBanners Sample Records:

**Record 1 - Full Content Slide:**
- Title: "Elegance Redefined"
- Subtitle: "Timeless Beauty"
- Description: "Discover intimate apparel designed for confidence and comfort."
- CTAText: "Shop Collection"
- CTALink: "/shop"
- Image: Upload a high-quality lifestyle image (1920x1080px)
- Order: 1
- Active: ✓

**Record 2 - Image Only Slide (No Text):**
- Title: *(leave empty)*
- Subtitle: *(leave empty)*
- Description: *(leave empty)*
- CTAText: *(leave empty)*
- CTALink: *(leave empty)*
- Image: Upload a beautiful product or lifestyle image
- Order: 2
- Active: ✓
*Perfect for showcasing stunning photography without distractions*

**Record 3 - Title & Button Only:**
- Title: "New Collection"
- Subtitle: *(leave empty)*
- Description: *(leave empty)*
- CTAText: "Shop Now"
- CTALink: "/shop?tag=new"
- Image: Upload promotional image
- Order: 3
- Active: ✓
*Minimal text with clear call-to-action*

**Record 4 - Title Only (No Button):**
- Title: "Valentine's Day Special"
- Subtitle: *(leave empty)*
- Description: *(leave empty)*
- CTAText: *(leave empty)*
- CTALink: *(leave empty)*
- Image: Upload Valentine's themed image
- Order: 4
- Active: ✓
*Great for announcements without requiring immediate action*

#### PromoBanners Sample Record:

**Record 1:**
- Title: "New Collection"
- Subtitle: "Discover Timeless Elegance"
- ButtonText: "Explore Now"
- ButtonLink: "/shop"
- Image: Upload a promotional banner image (1920x400px)
- ImageAlt: "New Collection Banner"
- Height: "h-80 md:h-96"
- Order: 1
- Active: ✓

### Step 3: Image Guidelines

**Hero Banners:**
- Recommended size: 1920x1080px (16:9 aspect ratio)
- Format: JPG or PNG
- Max file size: 2MB for optimal loading
- Style: High-quality lifestyle photography
- Content: Ensure text overlay areas have good contrast

**Promotional Banners:**
- Recommended size: 1920x400px (wide banner)
- Format: JPG or PNG
- Max file size: 1MB
- Style: Clear, promotional-focused imagery
- Content: Leave space for text overlay

### Step 4: Configure Tailwind Height Classes

For the `Height` field in PromoBanners, you can use any valid Tailwind CSS height classes:

- `h-64 md:h-80` - Smaller banner (256px mobile, 320px desktop)
- `h-80 md:h-96` - Medium banner (320px mobile, 384px desktop)
- `h-96 md:h-[500px]` - Large banner (384px mobile, 500px desktop)

## Banner Content Strategies

### Different Banner Types

**1. Image-Only Banners (No Text)**
- **Use for:** Brand storytelling, mood photography, product showcases
- **Best for:** High-quality lifestyle images that speak for themselves
- **Tip:** No dark overlay is applied, so your images display at full brightness

**2. Title + Button Banners**
- **Use for:** Direct calls-to-action, sales announcements, new arrivals
- **Best for:** Clear, focused messaging with immediate action
- **Example:** "Sale" title with "Shop Now" button

**3. Full Content Banners**
- **Use for:** Product launches, detailed promotions, storytelling
- **Best for:** When you need to explain value proposition or build emotion
- **Includes:** Subtitle, title, description, and button

**4. Title-Only Banners (No Button)**
- **Use for:** Announcements, event notifications, brand messaging
- **Best for:** Information you want visible but doesn't require immediate action
- **Example:** "Coming Soon" or seasonal greetings

### Content Flexibility Tips

- **Mix and match:** Alternate between text-heavy and image-only slides for visual variety
- **Mobile consideration:** Less text often works better on mobile devices
- **A/B Testing:** Try the same image with and without text to see what performs better
- **Seasonal rotation:** Use image-only slides during slower periods, add text during sales

## Event & Festival Management

### Creating Seasonal Banners

1. **Plan Ahead**: Create banners for upcoming events/festivals in advance
2. **Deactivate**: Uncheck "Active" on current banners
3. **Activate**: Check "Active" on new event-specific banners
4. **Schedule**: Remember banners update automatically on page revalidation (60 seconds)

### Example Seasonal Campaigns:

**Valentine's Day:**
- Title: "Love & Luxury"
- Subtitle: "Valentine's Day Collection"
- Description: "Make every moment special with our romantic collection."
- CTAText: "Shop Valentine's"
- CTALink: "/shop?tag=valentines"

**Christmas:**
- Title: "Holiday Glamour"
- Subtitle: "Christmas Gift Guide"
- Description: "Find the perfect gift wrapped in elegance."
- CTAText: "Shop Gifts"
- CTALink: "/shop?tag=gifts"

**Black Friday:**
- Title: "Exclusive Sale"
- Subtitle: "Black Friday Deals"
- Description: "Up to 50% off select styles. Limited time only."
- CTAText: "Shop Sale"
- CTALink: "/shop?sale=true"

## Managing Banners

### To Add a New Banner:
1. Create a new record in the appropriate table
2. Fill in all required fields
3. Upload an image
4. Set Order number
5. Check "Active" checkbox
6. Save the record

### To Update a Banner:
1. Find the record in Airtable
2. Edit the fields you want to change
3. Upload a new image if needed
4. Save changes
5. Changes appear on website within 60 seconds (ISR revalidation)

### To Remove a Banner:
1. Uncheck the "Active" checkbox (recommended)
   - OR -
2. Delete the record entirely

### To Reorder Banners:
1. Update the "Order" field numbers
2. Lower numbers appear first
3. Save changes

## Best Practices

1. **Image Optimization**: Compress images before uploading to Airtable
2. **Content Testing**: Preview banners on different devices
3. **A/B Testing**: Create multiple versions and rotate by changing Active status
4. **Accessibility**: Always provide meaningful ImageAlt text
5. **Link Testing**: Verify all CTALink and ButtonLink URLs work correctly
6. **Backup**: Keep a backup record of successful campaigns for reuse

## Troubleshooting

### Banners Not Appearing?
1. Check if "Active" checkbox is enabled
2. Verify image field has an attachment
3. Confirm Airtable credentials in `.env` are correct
4. Check browser console for errors
5. Wait 60 seconds for ISR revalidation

### Images Not Loading?
1. Ensure images are uploaded to Airtable (not just linked)
2. Verify image file size is under 2MB
3. Check Airtable attachment permissions
4. Confirm image URLs are accessible

### Fallback Behavior
If Airtable is not configured or returns no data:
- Hero carousel will display default hardcoded slides
- Promotional banners will be hidden
- Website continues to function normally

## Technical Details

### Data Flow:
1. Airtable stores banner data and images
2. `lib/airtable.js` fetches active banners
3. `pages/index.jsx` receives data via `getStaticProps`
4. Components render banners dynamically
5. Page revalidates every 60 seconds (ISR)

### API Functions:
- `getActiveHeroBanners()` - Fetches hero carousel slides
- `getActivePromoBanners()` - Fetches promotional banners

### Files Modified:
- `/lib/airtable.js` - Added banner fetch functions
- `/pages/index.jsx` - Updated to use dynamic banner data
- `/components/home/HeroCarousel.jsx` - Accepts slides as props

## Support

For issues or questions:
1. Check Airtable base permissions
2. Verify environment variables in `.env`
3. Review browser console for errors
4. Contact your development team

---

**Happy Banner Management! 🎉**
