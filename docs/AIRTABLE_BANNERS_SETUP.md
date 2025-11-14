# Airtable Dynamic Banners Setup Guide

This guide will help you set up dynamic hero header and promotional banners in Airtable for your GirlSecret website.

## Overview

The home page now supports dynamic banners that you can manage through Airtable:
- **Hero Banners**: Main carousel slides at the top of the home page
- **Promotional Banners**: Additional banner sections below the hero carousel

## Table Structures

### 1. HeroBanners Table

Create a new table in your Airtable base called `HeroBanners` with the following fields:

| Field Name | Field Type | Description | Example |
|------------|------------|-------------|---------|
| **Title** | Single line text | Main heading text | "Elegance Redefined" |
| **Subtitle** | Single line text | Subheading text | "Timeless Beauty" |
| **Description** | Long text | Supporting description | "Discover intimate apparel designed for confidence and comfort." |
| **CTAText** | Single line text | Button text | "Shop Collection" |
| **CTALink** | URL | Button destination | "/shop" or "https://..." |
| **Image** | Attachment | Hero image (recommended: 1920x1080px) | Upload image file |
| **Order** | Number | Display order (lower numbers first) | 1, 2, 3, 4... |
| **Active** | Checkbox | Enable/disable this banner | ✓ |

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

**Record 1:**
- Title: "Elegance Redefined"
- Subtitle: "Timeless Beauty"
- Description: "Discover intimate apparel designed for confidence and comfort."
- CTAText: "Shop Collection"
- CTALink: "/shop"
- Image: Upload a high-quality lifestyle image (1920x1080px)
- Order: 1
- Active: ✓

**Record 2:**
- Title: "Modern Luxury"
- Subtitle: "Premium Collection"
- Description: "Experience the perfect blend of sophistication and comfort."
- CTAText: "Explore Now"
- CTALink: "/shop?category=Lingerie"
- Image: Upload another lifestyle image
- Order: 2
- Active: ✓

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
