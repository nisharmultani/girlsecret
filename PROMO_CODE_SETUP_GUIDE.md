# Promo Code Setup Guide

## Overview
Your promo code system is fully functional and ready to use. You just need to add promo codes to your Airtable database.

## Airtable Table Structure

### PromoCodes Table
Create or verify you have a table named **"PromoCodes"** with the following fields:

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Code | Single line text | The promo code (case-insensitive) | `WELCOME10` |
| DiscountType | Single select | Type of discount | `percentage` or `fixed` |
| DiscountValue | Number | Discount amount | `10` (for 10% or £10) |
| MinPurchase | Number | Minimum order value required | `0` or `50` |
| MaxDiscount | Number | Maximum discount cap (for percentage) | `20` (max £20 off) |
| Active | Checkbox | Whether code is currently active | ✓ (checked) |
| ValidFrom | Date | When code becomes valid | `2025-11-20` |
| ValidUntil | Date | When code expires | `2025-12-31` |
| Description | Long text | Internal notes | `Welcome offer for new customers` |
| UsageLimit | Number | Max total uses (optional) | `100` |
| UsageCount | Number | Times code has been used | `0` |

## Creating Test Promo Codes

### Example 1: Percentage Discount
```
Code: WELCOME10
DiscountType: percentage
DiscountValue: 10
MinPurchase: 0
MaxDiscount: 20
Active: ✓
ValidFrom: 2025-11-01
ValidUntil: 2026-01-31
Description: 10% off for new customers (max £20)
```

### Example 2: Fixed Amount Discount
```
Code: SAVE5
DiscountType: fixed
DiscountValue: 5
MinPurchase: 25
Active: ✓
ValidFrom: 2025-11-01
ValidUntil: 2026-01-31
Description: £5 off orders over £25
```

### Example 3: Black Friday Sale
```
Code: BLACKFRIDAY
DiscountType: percentage
DiscountValue: 25
MinPurchase: 0
MaxDiscount: 50
Active: ✓
ValidFrom: 2025-11-29
ValidUntil: 2025-12-02
Description: Black Friday 25% off (max £50)
```

### Example 4: Influencer Code
```
Code: INFLUENCER15
DiscountType: percentage
DiscountValue: 15
MinPurchase: 0
MaxDiscount: 30
Active: ✓
ValidFrom: 2025-11-01
ValidUntil: 2026-12-31
Description: Influencer code - 15% off (max £30)
```

## Quick Setup Steps

1. **Open Airtable**
   - Go to your GirlSecret base
   - Find or create the "PromoCodes" table

2. **Add Fields** (if they don't exist)
   - Use the exact field names listed above
   - Set the correct field types

3. **Add Test Codes**
   - Copy the examples above
   - Make sure "Active" is checked (✓)
   - Set valid date ranges

4. **Test on Your Site**
   ```bash
   # Go to your cart page
   # Add items to cart
   # Enter promo code (e.g., "WELCOME10")
   # Click "Apply"
   # Should see discount applied!
   ```

## How It Works

### User Flow
1. User adds items to cart
2. User enters promo code in cart
3. System validates code against Airtable
4. If valid: discount applied automatically
5. Discount shown in order summary
6. Order processed with discounted price

### Technical Flow
```javascript
// User submits promo code
POST /api/validate-promo
{
  code: "WELCOME10",
  subtotal: 50.00
}

// System checks Airtable PromoCodes table
// Filter: Code = 'WELCOME10' AND Active = TRUE

// If found and valid:
{
  valid: true,
  discount: 5.00,  // 10% of £50
  message: "Promo code applied!"
}

// If not found or invalid:
{
  valid: false,
  message: "Invalid or expired promo code"
}
```

## Referral/Influencer Integration

Promo codes automatically work with the referral system:

```
# User visits with referral link
https://girlsecret.co.uk/?ref=INFLUENCER15

# System auto-applies "INFLUENCER15" code in cart
# Influencer gets credit for the sale
```

## Common Issues & Solutions

### Issue: "Invalid or expired promo code"

**Possible Causes:**
1. Code doesn't exist in Airtable
2. "Active" checkbox is unchecked
3. Code has wrong case (though system is case-insensitive)
4. ValidFrom date is in the future
5. ValidUntil date has passed
6. MinPurchase requirement not met

**Solution:**
```bash
# Check in Airtable:
1. Code exists in PromoCodes table
2. Active = ✓ (checked)
3. ValidFrom ≤ today
4. ValidUntil ≥ today
5. Subtotal ≥ MinPurchase
```

### Issue: Discount amount is wrong

**Check:**
```javascript
// For percentage discount:
discount = (subtotal * discountValue) / 100
if (discount > maxDiscount) discount = maxDiscount

// For fixed discount:
discount = discountValue
```

### Issue: Promo code not working with referral link

**Solution:**
1. Make sure promo code exists in PromoCodes table
2. Code must match referral parameter
3. Active must be checked

## Managing Promo Codes

### Deactivating a Code
```
# In Airtable, uncheck "Active"
# Users can no longer apply this code
```

### Creating Limited-Time Codes
```
# Set ValidFrom and ValidUntil dates
# Code automatically activates/deactivates
```

### Tracking Usage
```
# Add formula field in Airtable to count usage
# Create views to see active/inactive codes
# Monitor which codes are most used
```

## Best Practices

### Naming Codes
- **Short & Memorable**: `SAVE10`, `WELCOME`, `SUMMER25`
- **Clear Purpose**: `FIRSTORDER`, `BLACKFRIDAY`, `VIP15`
- **Avoid Confusion**: Don't use 0 (zero) and O (letter O)

### Setting Discounts
- **Percentage**: Good for all order sizes (10%, 15%, 20%)
- **Fixed**: Better for minimum purchase ($5 off $25, $10 off $50)
- **Max Discount**: Always set for percentage codes to prevent abuse

### Minimum Purchase
```
No minimum: MinPurchase = 0
Encourage larger orders: MinPurchase = 25, 50, 100
```

### Expiration Dates
```
Short-term (1 week): Flash sales, limited offers
Medium-term (1-3 months): Seasonal campaigns
Long-term (1 year): Influencer codes, partnerships
No expiration: Set far future date (2030-12-31)
```

## Quick Start - Add Your First Code Now!

1. Open your Airtable base
2. Go to PromoCodes table (create if doesn't exist)
3. Add this test code:

```
Code: LAUNCH25
DiscountType: percentage
DiscountValue: 25
MinPurchase: 0
MaxDiscount: 50
Active: ✓
ValidFrom: 2025-11-26
ValidUntil: 2025-12-26
Description: Launch day special - 25% off everything!
```

4. Test on your site right away!

## Need Help?

If promo codes still aren't working after following this guide:

1. **Check Airtable Connection**
   ```bash
   # Verify these environment variables are set:
   NEXT_PUBLIC_AIRTABLE_API_KEY=your_key
   NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id
   ```

2. **Check Browser Console**
   ```bash
   # Open browser developer tools (F12)
   # Look for errors when applying code
   ```

3. **Check Server Logs**
   ```bash
   # Look for API errors
   # Check if Airtable queries are working
   ```

Your promo code system is **production-ready**! Just add codes to Airtable and they'll work immediately. 🚀
