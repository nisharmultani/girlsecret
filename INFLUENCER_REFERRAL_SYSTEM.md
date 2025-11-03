# Influencer Referral System Documentation

## Overview

The GirlSecret Influencer Referral System is a complete solution for managing influencer partnerships, tracking referral performance, and calculating commissions. It allows you to:

- Create unique referral codes for each influencer
- Automatically track clicks and conversions
- Apply promo codes automatically when customers use referral links
- Calculate commissions based on sales
- Provide influencers with a dashboard to view their stats

---

## 🗄️ Airtable Schema Setup

### Referrals Table

You need to add the following fields to your **Referrals** table in Airtable:

| Field Name | Type | Description | Required |
|---|---|---|---|
| `ReferralCode` | Single line text | Unique code for the influencer (e.g., "JANE123") | Yes |
| `InfluencerName` | Single line text | Full name of the influencer | Yes |
| `InfluencerEmail` | Email | Contact email for the influencer | Yes |
| `PromoCode` | Single line text | Associated promo code from PromoCodes table | No |
| `CommissionRate` | Number | Percentage commission (e.g., 10 for 10%) | Yes |
| `TotalClicks` | Number | Total times referral link was clicked | Auto |
| `TotalConversions` | Number | Total orders completed through this referral | Auto |
| `TotalRevenue` | Currency (£) | Total order value from referrals | Auto |
| `TotalCommission` | Currency (£) | Total commission earned | Auto |
| `IsActive` | Checkbox | Whether the referral code is active | Yes |
| `Type` | Single select | "Influencer" or "Customer" | Yes |
| `Created_At` | Date | When the referral was created | Yes |
| `ReferrerEmail` | Email | (Legacy - for customer referrals) | No |
| `ReferredEmail` | Email | (Legacy - for customer referrals) | No |
| `Status` | Single line text | (Legacy - for customer referrals) | No |

### Orders Table

Add this field to your **Orders** table:

| Field Name | Type | Description |
|---|---|---|
| `ReferralCode` | Single line text | Which referral code was used for this order |

---

## 🚀 How It Works

### 1. Creating an Influencer Referral

**Via Admin Interface:**
1. Go to `/admin/referrals`
2. Click "Create New Referral"
3. Fill in:
   - Referral Code (e.g., "SARAH123" - uppercase, no spaces)
   - Influencer Name
   - Influencer Email
   - Promo Code (optional - must exist in PromoCodes table)
   - Commission Rate (default 10%)
4. Click "Create Referral"

**Programmatically:**
```javascript
await fetch('/api/influencer/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    referralCode: 'SARAH123',
    influencerName: 'Sarah Johnson',
    influencerEmail: 'sarah@example.com',
    promoCode: 'SAVE10',
    commissionRate: 10,
  }),
});
```

### 2. Sharing the Referral Link

Once created, the influencer gets:
- **Referral Link:** `https://yourdomain.com?ref=SARAH123`
- **Dashboard Link:** `https://yourdomain.com/influencer/SARAH123`

The influencer shares their referral link on social media, blog, or website.

### 3. Customer Journey

1. Customer clicks referral link: `https://yourdomain.com?ref=SARAH123`
2. System:
   - Detects `?ref=SARAH123` parameter
   - Stores code in localStorage (valid for 30 days)
   - Increments click count in Airtable
   - Auto-applies associated promo code (if any)
3. Customer browses products
4. At checkout, referral code is included in order
5. Order is created with `ReferralCode: "SARAH123"`
6. System automatically:
   - Increments conversion count
   - Adds order total to revenue
   - Calculates and adds commission

### 4. Commission Calculation

Formula: `Commission = Order Total × (Commission Rate / 100)`

Example:
- Order Total: £100
- Commission Rate: 10%
- Commission: £100 × 0.10 = £10

---

## 📊 Tracking & Analytics

### Admin Dashboard

**URL:** `/admin/referrals`

View all influencer referrals with:
- Total clicks, conversions, revenue, commissions (aggregate)
- Individual stats per influencer
- Conversion rates
- Quick actions: Copy referral link, copy dashboard link

### Influencer Dashboard

**URL:** `/influencer/{CODE}`

Each influencer can view their own stats:
- Total clicks on their link
- Total conversions (orders)
- Conversion rate
- Total revenue generated
- Total commission earned
- Commission rate
- Copy referral link button
- How it works guide

---

## 🔧 Technical Implementation

### API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/influencer/create` | POST | Create new influencer referral |
| `/api/influencer/[code]` | GET | Get referral stats by code |
| `/api/influencer/track-click` | POST | Track referral link click |
| `/api/influencer/list` | GET | Get all active influencer referrals |

### Frontend Utilities

**File:** `/lib/referral-tracking.js`

Key functions:
- `getReferralCodeFromUrl()` - Extract ref parameter from URL
- `storeReferralCode(code)` - Store code in localStorage
- `getStoredReferralCode()` - Retrieve stored code
- `trackReferralClick(code)` - Call API to track click
- `getReferralData(code)` - Fetch referral info from API
- `initializeReferralTracking()` - Auto-detect and track referrals
- `getActiveReferralCode()` - Get current active code

**File:** `/hooks/useReferral.js`

React hook for components:
```javascript
import { useReferral } from '../hooks/useReferral';

function MyComponent() {
  const { referralData, referralCode, promoCode, isLoading } = useReferral();

  // Auto-apply promo code
  useEffect(() => {
    if (promoCode) {
      applyPromoCode(promoCode);
    }
  }, [promoCode]);
}
```

### Backend Functions

**File:** `/lib/airtable.js`

Key functions:
- `createInfluencerReferral(data)` - Create new referral
- `getReferralByCode(code)` - Get referral info
- `incrementReferralClicks(code)` - Track click
- `trackReferralConversion(code, total, orderId)` - Track order
- `getAllInfluencerReferrals()` - List all referrals

### Order Integration

**File:** `/pages/checkout.jsx`

The checkout automatically:
1. Gets active referral code via `getActiveReferralCode()`
2. Includes it in `orderData.referralCode`
3. Sends to `/api/user/orders` endpoint
4. Order creation triggers `trackReferralConversion()`

---

## 💡 Usage Examples

### Example 1: Create Referral for Influencer

```javascript
// Create referral with 15% commission
await fetch('/api/influencer/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    referralCode: 'EMMA15',
    influencerName: 'Emma Smith',
    influencerEmail: 'emma@example.com',
    promoCode: 'EMMA15OFF',  // Must exist in PromoCodes table
    commissionRate: 15,
  }),
});
```

### Example 2: Get Influencer Stats

```javascript
const response = await fetch('/api/influencer/EMMA15');
const data = await response.json();

console.log(data.referral);
// {
//   referralCode: 'EMMA15',
//   influencerName: 'Emma Smith',
//   totalClicks: 250,
//   totalConversions: 12,
//   totalRevenue: 650.00,
//   totalCommission: 97.50,
//   commissionRate: 15
// }
```

### Example 3: Check Active Referral in Component

```javascript
import { useEffect } from 'react';
import { getActiveReferralCode } from '../lib/referral-tracking';

function Cart() {
  useEffect(() => {
    const code = getActiveReferralCode();
    if (code) {
      console.log(`Customer came from referral: ${code}`);
      // Maybe show a banner: "You're using Sarah's link! 10% off applied"
    }
  }, []);
}
```

---

## 🎯 Best Practices

### For Admin/Store Owner

1. **Create Promo Code First**
   - Create the promo code in PromoCodes table before creating the referral
   - Use the same code for both (e.g., referral code "SARAH10" → promo code "SARAH10")

2. **Clear Communication**
   - Send influencers both their referral link AND dashboard link
   - Explain the commission structure clearly

3. **Regular Monitoring**
   - Check `/admin/referrals` weekly to see performance
   - Reach out to high-performing influencers

4. **Payout Tracking**
   - Export data from Airtable for commission payouts
   - Add a "CommissionPaid" checkbox field to track payments

### For Influencers

1. **Share on Multiple Channels**
   - Instagram bio link
   - YouTube video descriptions
   - Blog posts
   - Email newsletters

2. **Track Performance**
   - Visit dashboard weekly at `/influencer/YOURCODE`
   - Test conversion rate by trying different messaging

3. **Use UTM Parameters** (Optional)
   - Add UTM parameters for detailed tracking
   - Example: `?ref=SARAH123&utm_source=instagram&utm_campaign=spring2024`

---

## 🔒 Security Considerations

- **No Authentication Required** for influencer dashboard (by design)
  - Referral codes are not secret - they're meant to be shared
  - Dashboard only shows aggregate stats, no customer PII

- **Admin Pages Should Be Protected**
  - Add authentication to `/admin/*` routes
  - Restrict who can create new referrals

- **Referral Code Validation**
  - Codes are uppercase, alphanumeric only
  - Prevents SQL injection via sanitization

---

## 📈 Future Enhancements

Potential additions:

1. **Email Notifications**
   - Notify influencer when they make a sale
   - Weekly performance summary emails

2. **Tiered Commissions**
   - Increase commission rate after X sales
   - Example: 10% for first 10 sales, then 15%

3. **Cookie Tracking**
   - Use cookies in addition to localStorage
   - Better cross-device tracking

4. **Custom Landing Pages**
   - Create `/ref/SARAH123` pretty URLs
   - Redirect with referral code parameter

5. **Payout Automation**
   - Integrate with PayPal/Stripe for automatic payouts
   - Track paid vs unpaid commissions

6. **Multi-tier Referrals**
   - Customer referrals (different from influencer)
   - Referral rewards for customers

---

## 🐛 Troubleshooting

### Referral Not Tracking

**Problem:** Clicks not incrementing

**Solutions:**
1. Check browser console for errors
2. Verify Airtable API credentials in `.env`
3. Check if `ReferralCode` field exists in Airtable
4. Check if referral code is active (`IsActive = true`)

### Promo Code Not Auto-Applying

**Problem:** Discount not showing in cart

**Solutions:**
1. Verify promo code exists in PromoCodes table
2. Check if promo code is linked correctly in Referrals table
3. Implement auto-apply logic in cart page (see below)

**Implementation:**
```javascript
// In pages/cart.jsx
import { useReferral } from '../hooks/useReferral';

function Cart() {
  const { promoCode } = useReferral();

  useEffect(() => {
    if (promoCode) {
      setPromoCode(promoCode);
      handleApplyPromo();
    }
  }, [promoCode]);
}
```

### Conversion Not Tracked

**Problem:** Order created but stats not updating

**Solutions:**
1. Check if `referralCode` is in orderData
2. Verify `trackReferralConversion()` is called in `createOrder()`
3. Check Airtable for errors in console logs
4. Ensure `ReferralCode` field exists in Orders table

---

## 📞 Support

For issues or questions:
- Check Airtable data directly
- Review browser console for errors
- Check API endpoint responses
- Verify environment variables are set

---

## 📝 Summary

The Influencer Referral System provides:

✅ Unique referral codes for each influencer
✅ Automatic click and conversion tracking
✅ Commission calculation based on sales
✅ Influencer dashboard for viewing stats
✅ Admin dashboard for managing referrals
✅ Auto-apply promo codes for customers
✅ 30-day cookie tracking
✅ Easy integration with existing e-commerce

**Key Files:**
- `/lib/airtable.js` - Database functions
- `/lib/referral-tracking.js` - Browser utilities
- `/hooks/useReferral.js` - React hooks
- `/pages/api/influencer/*` - API endpoints
- `/pages/influencer/[code].jsx` - Influencer dashboard
- `/pages/admin/referrals.jsx` - Admin management
- `/pages/checkout.jsx` - Order integration

Happy tracking! 🎉
