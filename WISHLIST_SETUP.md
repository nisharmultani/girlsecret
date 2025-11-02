# Wishlist Feature Setup Guide

## Airtable Configuration

To complete the wishlist feature setup, you need to create a new table in your Airtable base.

### Create Wishlists Table

1. Go to your Airtable base (the same base used for Products, Users, Orders, etc.)
2. Create a new table named **`Wishlists`**
3. Add the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `UserId` | Single line text | ID of the user (links to Users table) |
| `ProductId` | Single line text | ID of the product (links to Products table) |
| `AddedAt` | Date & time | When the item was added to wishlist |

### Field Configuration Details

**UserId**
- Type: Single line text (or Link to Users table if you want automatic linking)
- Required: Yes
- Description: Stores the Airtable record ID of the user

**ProductId**
- Type: Single line text (or Link to Products table if you want automatic linking)
- Required: Yes
- Description: Stores the Airtable record ID of the product

**AddedAt**
- Type: Date & time
- Include time: Yes
- GMT: Yes
- Description: Timestamp when item was added

### Optional: Create Linked Records

For better data visualization in Airtable:

1. Change `UserId` field type to "Link to another record"
   - Link to: `Users` table
   - Allow linking to multiple records: No

2. Change `ProductId` field type to "Link to another record"
   - Link to: `Products` table
   - Allow linking to multiple records: No

This will allow you to see user and product details directly in the Wishlists table.

### Add Unique Constraint (Recommended)

To prevent duplicate wishlist entries:

1. Create a formula field named `UniqueKey`:
   ```
   {UserId} & "-" & {ProductId}
   ```

2. In your Airtable base settings, you can manually check for duplicates using this key.

Note: Airtable doesn't have built-in unique constraints, but the API code prevents duplicates.

## Feature Overview

### What's Been Implemented

✅ **Backend:**
- Airtable functions for wishlist CRUD operations
- API endpoints: `/api/wishlist` (GET), `/api/wishlist/add` (POST), `/api/wishlist/remove` (POST)
- User-specific wishlist management

✅ **Frontend:**
- WishlistContext for global state management
- localStorage fallback for guest users
- Automatic merge when guest logs in

✅ **UI Components:**
- Heart icon on ProductCard (hover to see)
- Wishlist badge counter in header navigation
- Dedicated wishlist page at `/account/wishlist`
- Wishlist links in user menu dropdowns
- Mobile-responsive design

✅ **Features:**
- Add/remove products from wishlist
- View all wishlist items
- Add items from wishlist to cart
- "Add All to Cart" functionality
- Guest wishlist support (localStorage)
- Cross-device sync for registered users

### How It Works

**For Guest Users:**
- Wishlist stored in browser localStorage
- Persists until browser data is cleared
- Works without login

**For Registered Users:**
- Wishlist stored in Airtable database
- Syncs across all devices
- Persists permanently

**When Guest Logs In:**
- Guest wishlist automatically merges with account wishlist
- No items are lost
- Duplicates are prevented

## Testing the Feature

### 1. Test as Guest User
```bash
# 1. Go to /shop page
# 2. Hover over any product card
# 3. Click the heart icon (should fill with color)
# 4. Check header - wishlist badge should show count
# 5. Click wishlist badge/link in header
# 6. View your wishlist page
# 7. Try "Add to Cart" and "Remove" buttons
```

### 2. Test as Registered User
```bash
# 1. Create account or login
# 2. Add products to wishlist
# 3. Logout and login from another browser/device
# 4. Wishlist should persist (if Airtable is configured)
```

### 3. Test Guest-to-User Merge
```bash
# 1. As guest, add 3 products to wishlist
# 2. Login to your account
# 3. Wishlist should now show all items
# 4. Guest wishlist should be cleared from localStorage
```

## Troubleshooting

### Wishlist not saving for registered users?
- Check that Wishlists table is created in Airtable
- Verify table name is exactly `Wishlists` (case-sensitive)
- Check Airtable API key has write permissions

### Guest wishlist not working?
- Check browser console for localStorage errors
- Verify localStorage is enabled in browser
- Try clearing browser cache

### Wishlist count not updating?
- Refresh the page
- Check browser console for errors
- Verify WishlistProvider is wrapping the app in `_app.jsx`

## Next Steps (Optional Enhancements)

- [ ] Add wishlist sharing (generate shareable link)
- [ ] Email notifications for price drops on wishlisted items
- [ ] Wishlist analytics (most wishlisted products)
- [ ] Move items between multiple wishlists
- [ ] Add notes to wishlist items

## Files Modified/Created

### New Files:
- `/lib/wishlist.js` - localStorage utilities
- `/context/WishlistContext.js` - Wishlist state management
- `/pages/api/wishlist/index.js` - Get wishlist API
- `/pages/api/wishlist/add.js` - Add to wishlist API
- `/pages/api/wishlist/remove.js` - Remove from wishlist API
- `/pages/account/wishlist.jsx` - Wishlist page

### Modified Files:
- `/lib/airtable.js` - Added wishlist functions
- `/lib/auth.js` - Added token validation helpers
- `/pages/_app.jsx` - Added WishlistProvider
- `/components/layout/Header.jsx` - Added wishlist badge and links
- `/components/product/ProductCard.jsx` - Connected to wishlist context

## Support

If you encounter any issues, please check:
1. Airtable configuration is correct
2. Environment variables are set
3. Browser console for error messages
4. Network tab for API call failures

Happy wishlisting! 💝
