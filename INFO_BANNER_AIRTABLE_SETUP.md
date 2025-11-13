# Info Banner Airtable Integration Setup Guide

This guide explains how to set up the **InfoBanners** table in Airtable to dynamically manage promotional banners that appear at the top of your website.

---

## Table of Contents
1. [Overview](#overview)
2. [Airtable Table Setup](#airtable-table-setup)
3. [Field Descriptions](#field-descriptions)
4. [How It Works](#how-it-works)
5. [Examples](#examples)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The Info Banner system allows you to:
- **Dynamically update** promotional messages without code changes
- **Schedule** different banners by toggling the Active status
- **Prioritize** which banner to show when multiple are active
- **Customize** colors, links, and dismissibility
- **Track** user dismissals with unique storage keys

---

## Airtable Table Setup

### Step 1: Create the Table

1. Open your GirlSecret Airtable base
2. Create a new table called **`InfoBanners`** (exact name, case-sensitive)
3. Add the following fields:

### Step 2: Field Configuration

| Field Name | Field Type | Description | Required |
|------------|-----------|-------------|----------|
| **Message** | Single line text | The promotional message to display | ✅ Yes |
| **Link** | Single line text | URL to navigate when clicking the CTA | ❌ No |
| **LinkText** | Single line text | Text for the clickable link (e.g., "Shop Now") | ❌ No |
| **BackgroundColor** | Single line text | Tailwind CSS class (e.g., `bg-black`, `bg-red-600`) | ❌ No |
| **TextColor** | Single line text | Tailwind CSS class (e.g., `text-white`, `text-gray-900`) | ❌ No |
| **Dismissible** | Checkbox | Whether users can dismiss the banner | ❌ No |
| **StorageKey** | Single line text | Unique identifier for localStorage (e.g., `sale2024Banner`) | ❌ No |
| **Priority** | Number | Higher numbers = higher priority (shown first) | ❌ No |
| **Active** | Checkbox | Whether this banner should be displayed | ✅ Yes |

---

## Field Descriptions

### Message (Required)
The main promotional text displayed in the banner.

**Examples:**
- `Free Shipping on Orders Over £50`
- `20% Off First Order - Use Code: FIRST20`
- `Summer Sale - Up to 50% Off Selected Items`
- `New Collection Launched - Shop Now`

### Link (Optional)
The URL users navigate to when clicking the CTA button. Leave blank for no link.

**Examples:**
- `/shop` - Shop page
- `/shop?category=Bras` - Specific category
- `/shop?sort=sale` - Sale items
- `https://external-site.com` - External link

### LinkText (Optional)
The clickable text for the CTA. Only shown if Link is provided.

**Examples:**
- `Shop Now`
- `View Sale`
- `Get 20% Off`
- `Learn More`
- `Explore Collection`

### BackgroundColor (Optional)
Tailwind CSS background color class. Defaults to `bg-black` if not specified.

**Common Options:**
- `bg-black` - Black background (default)
- `bg-white` - White background
- `bg-gray-900` - Dark gray
- `bg-red-600` - Red (for urgent/sale messages)
- `bg-green-600` - Green (for eco/sustainability)
- `bg-blue-600` - Blue

### TextColor (Optional)
Tailwind CSS text color class. Defaults to `text-white` if not specified.

**Common Options:**
- `text-white` - White text (default, good for dark backgrounds)
- `text-black` - Black text (good for light backgrounds)
- `text-gray-900` - Dark gray text

**⚠️ Important:** Ensure good contrast between BackgroundColor and TextColor for readability.

### Dismissible (Optional)
Checkbox field. If checked (TRUE), users can close the banner with an X button.

**Default:** TRUE (dismissible)

**Use Cases:**
- ✅ Dismissible: Promotional sales, shipping info (users can close if not interested)
- ❌ Not Dismissible: Critical announcements, system maintenance notices

### StorageKey (Optional)
Unique identifier saved in browser localStorage to remember if user dismissed this banner.

**Format:** Use descriptive, unique keys like:
- `summerSale2024Banner`
- `freeShippingPromo`
- `blackFridaySale2024`
- `newCollectionLaunch`

**Default:** If not provided, defaults to `infoBanner_{recordId}`

**⚠️ Important:**
- Use different StorageKeys for different promotions
- Same StorageKey = users who dismissed once won't see it again
- Change StorageKey to show the banner again to users who previously dismissed it

### Priority (Optional)
Number field. When multiple banners are active, the one with the highest priority is shown.

**Examples:**
- `100` - Critical/urgent announcements
- `50` - Sales and promotions
- `10` - General shipping/info
- `0` - Default priority

**Default:** 0

### Active (Required)
Checkbox field. Only banners with Active = TRUE are displayed on the website.

**Usage:**
- ✅ Check this to activate a banner
- ❌ Uncheck to deactivate (hide from website)

---

## How It Works

### Backend Flow

1. **Airtable Function** (`lib/airtable.js`):
   - `getActiveInfoBanners()` queries the InfoBanners table
   - Filters for records where `Active = TRUE`
   - Sorts by Priority (descending, highest first)

2. **API Endpoint** (`/api/info-banners`):
   - Exposes banner data as JSON
   - Called by frontend on page load

3. **Header Component** (`components/layout/Header.jsx`):
   - Fetches banners on component mount
   - Uses the highest priority active banner
   - Passes data to InfoBanner component

4. **InfoBanner Component** (`components/ui/InfoBanner.jsx`):
   - Renders the banner with Airtable data
   - Handles dismissal and localStorage

### Frontend Flow

```
Page Load → Header Component → Fetch /api/info-banners
→ Get Active Banners (sorted by priority) → Display Highest Priority Banner
→ User Dismisses → Save to localStorage → Hide Banner
```

---

## Examples

### Example 1: Free Shipping Banner

| Field | Value |
|-------|-------|
| Message | `Free Shipping on Orders Over £50` |
| Link | `/shop` |
| LinkText | `Shop Now` |
| BackgroundColor | `bg-black` |
| TextColor | `text-white` |
| Dismissible | ✅ Checked |
| StorageKey | `freeShippingBanner2024` |
| Priority | `10` |
| Active | ✅ Checked |

**Result:** Black banner with white text, dismissible, links to shop page.

---

### Example 2: Limited Time Sale

| Field | Value |
|-------|-------|
| Message | `Flash Sale: 50% Off Everything - Ends Tonight!` |
| Link | `/shop?sort=sale` |
| LinkText | `Shop Sale` |
| BackgroundColor | `bg-red-600` |
| TextColor | `text-white` |
| Dismissible | ✅ Checked |
| StorageKey | `flashSale_Nov2024` |
| Priority | `100` |
| Active | ✅ Checked |

**Result:** Red urgent banner with high priority, shows sale items.

---

### Example 3: New Collection Announcement

| Field | Value |
|-------|-------|
| Message | `New Winter Collection Just Dropped` |
| Link | `/shop?category=New` |
| LinkText | `Explore Now` |
| BackgroundColor | `bg-black` |
| TextColor | `text-white` |
| Dismissible | ✅ Checked |
| StorageKey | `winterCollection2024` |
| Priority | `50` |
| Active | ✅ Checked |

**Result:** Black banner announcing new arrivals.

---

### Example 4: Important Announcement (Non-Dismissible)

| Field | Value |
|-------|-------|
| Message | `Scheduled Maintenance: Site will be down Dec 15, 2-4 AM` |
| Link | *(leave blank)* |
| LinkText | *(leave blank)* |
| BackgroundColor | `bg-yellow-500` |
| TextColor | `text-black` |
| Dismissible | ❌ Unchecked |
| StorageKey | `maintenance_Dec2024` |
| Priority | `200` |
| Active | ✅ Checked |

**Result:** Yellow banner, can't be dismissed, no link.

---

## Usage Tips

### Multiple Active Banners
- ✅ **Allowed:** You can have multiple banners with Active = TRUE
- 🎯 **Display Logic:** Only the **highest priority** banner is shown
- 💡 **Strategy:** Set different priorities for different message types

**Example Priorities:**
```
Priority 200: System maintenance (critical)
Priority 100: Flash sales (urgent)
Priority 50: New arrivals (important)
Priority 10: Free shipping (general info)
```

### Rotating Banners
To change which banner is shown:

**Option 1: Toggle Active Status**
- Deactivate current banner (uncheck Active)
- Activate new banner (check Active)

**Option 2: Change Priority**
- Keep both active
- Set new banner's priority higher

### Banner Dismissal
- Users can dismiss banners (if Dismissible = TRUE)
- Dismissal is stored in browser localStorage with StorageKey
- To show banner again: Change StorageKey in Airtable

### Best Practices

1. **Use Clear Messages:**
   - Keep messages short and actionable
   - Focus on user benefits (e.g., "Save 20%" not "We're having a sale")

2. **Set Appropriate Priorities:**
   - Reserve high priorities (100+) for urgent/time-sensitive messages
   - Use low priorities (0-20) for evergreen content

3. **Test Colors:**
   - Ensure good contrast between background and text
   - Black/white combo is always safe
   - Test on both desktop and mobile

4. **Update StorageKeys:**
   - Change StorageKey when updating an existing promotion
   - Otherwise, users who dismissed the old version won't see the new one

5. **Link Strategy:**
   - Always provide a relevant link when possible
   - Use descriptive LinkText (avoid generic "Click Here")

---

## Troubleshooting

### Banner Not Showing

**Possible Causes:**
1. ❌ Active checkbox is not checked
2. ❌ Airtable base ID or API key incorrect in `.env`
3. ❌ Table name is not exactly `InfoBanners` (case-sensitive)
4. ❌ User previously dismissed this banner (check StorageKey)
5. ❌ Another banner has higher priority

**Solutions:**
- Verify Active = TRUE in Airtable
- Check environment variables in `.env` file
- Ensure table name matches exactly
- Try new StorageKey or clear browser localStorage
- Check Priority values

### Banner Shows Default Instead of Airtable Content

**Possible Causes:**
1. ❌ API endpoint `/api/info-banners` returning error
2. ❌ Network error fetching data
3. ❌ Airtable credentials invalid

**Solutions:**
- Check browser console for errors
- Test API endpoint directly: `yoursite.com/api/info-banners`
- Verify Airtable API key and base ID

### Colors Not Working

**Possible Causes:**
1. ❌ Invalid Tailwind class name
2. ❌ Missing `bg-` or `text-` prefix

**Solutions:**
- Use valid Tailwind classes: `bg-black`, `text-white`
- Check Tailwind documentation for valid color classes
- Ensure classes are built in Tailwind config

### Link Not Working

**Possible Causes:**
1. ❌ Missing leading slash for internal links
2. ❌ LinkText provided but no Link

**Solutions:**
- Internal links: use `/shop` (with slash)
- External links: use full URL `https://example.com`
- Ensure both Link and LinkText are filled

---

## Testing Your Setup

### Step-by-Step Test:

1. **Create Test Banner in Airtable:**
   ```
   Message: "Test Banner - Please Ignore"
   Link: "/shop"
   LinkText: "Test Link"
   Active: TRUE
   Priority: 999
   ```

2. **Refresh Website:**
   - Banner should appear at the top

3. **Test Dismissal:**
   - Click X button
   - Refresh page
   - Banner should stay hidden

4. **Change Message:**
   - Update Message in Airtable
   - Wait 10-30 seconds (Airtable API cache)
   - Hard refresh website (Ctrl+F5 / Cmd+Shift+R)
   - New message should appear

5. **Deactivate:**
   - Uncheck Active in Airtable
   - Refresh website
   - Banner should disappear

---

## API Endpoint Reference

### GET `/api/info-banners`

**Response Format:**
```json
{
  "success": true,
  "banners": [
    {
      "id": "rec123abc",
      "message": "Free Shipping on Orders Over £50",
      "link": "/shop",
      "linkText": "Shop Now",
      "backgroundColor": "bg-black",
      "textColor": "text-white",
      "dismissible": true,
      "storageKey": "freeShippingBanner",
      "priority": 10,
      "active": true
    }
  ]
}
```

**Test Command:**
```bash
curl https://yourdomain.com/api/info-banners
```

---

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify Airtable table structure matches this guide
3. Test API endpoint directly
4. Check `.env` file configuration
5. Clear browser cache and localStorage

---

## Quick Reference

**Airtable Table Name:** `InfoBanners` (case-sensitive)

**Required Fields:**
- Message (text)
- Active (checkbox)

**Optional but Recommended:**
- Link, LinkText (for CTA)
- BackgroundColor, TextColor (for branding)
- StorageKey (for dismissal tracking)
- Priority (for multiple banners)

**Tailwind Color Examples:**
- `bg-black` / `text-white`
- `bg-white` / `text-black`
- `bg-red-600` / `text-white`
- `bg-green-600` / `text-white`
- `bg-blue-600` / `text-white`

---

**Last Updated:** November 2024
**Version:** 1.0
