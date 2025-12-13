# Questions & Answers - Referrals, Promo Codes, and More

## 🎯 Your Questions Answered

### Q1: What's the difference between a Promo Code and a Referral Link?

**Promo Code:**
- A discount code customers enter at checkout
- Example: `WELCOME10`, `SAVE5`, `BLACKFRIDAY`
- Can be used by anyone who knows the code
- You create them manually in Airtable
- Can be shared anywhere (social media, ads, emails)

**Referral Link:**
- A special URL with a tracking code
- Example: `https://girlsecret.co.uk/?ref=NISHA20`
- Automatically applies a promo code when clicked
- Tracks who clicked and who purchased
- Tied to a specific influencer/ambassador

**How They Work Together:**
```
1. You create an influencer with code: NISHA20
2. System generates referral link: ?ref=NISHA20
3. You also create promo code: NISHA20 (same name!)
4. When customer clicks link → promo code auto-applies
5. Customer gets discount, influencer gets credit
```

---

### Q2: How do I decide the promo value when creating a referral?

**For Influencers (Default 15% commission):**
- Give customers: 10-15% discount
- Example: Customer gets 10% off, you pay influencer 15% commission
- Your profit: Revenue - (10% customer discount) - (15% influencer commission) = 75% gross

**For Ambassadors (Default 10% commission):**
- Give customers: 10% discount
- Example: Customer gets 10% off, you pay ambassador 10% commission
- Your profit: Revenue - (10% customer discount) - (10% ambassador commission) = 80% gross

**Recommended Structure:**
| Program | Customer Discount | Commission Rate | Your Margin |
|---------|------------------|-----------------|-------------|
| Influencer | 15% | 15% | 70% |
| Ambassador | 10% | 10% | 80% |
| VIP Influencer | 20% | 20% | 60% |

**How to Create the Matching Promo Code:**

When influencer "Nisha" applies and gets code `NISHA20`:

```
In Airtable PromoCodes table, create:
Code: NISHA20
DiscountType: percentage
DiscountValue: 15
MinPurchase: 0
MaxDiscount: 30
Active: ✓
ValidFrom: 2025-11-26
ValidUntil: 2026-12-31
Description: Nisha's influencer code - 15% off
```

---

### Q3: How do we count clicks and track sales?

**Click Tracking:**
1. Customer clicks: `https://girlsecret.co.uk/?ref=NISHA20`
2. System calls `/api/influencer/track-click` API
3. Increments `TotalClicks` in Influencers/Ambassadors table
4. Stores referral code in customer's session/cookie

**Sales Tracking:**
When an order is placed with a referral code:
1. Checkout detects referral code in session
2. Order is created with referral code attached
3. System updates:
   - `TotalConversions` +1
   - `TotalRevenue` + order amount
   - `TotalCommission` + (order amount × commission rate)

**Current Implementation Status:**
- ✅ Referral link pages work (/influencer/[code])
- ✅ Click tracking API exists
- ✅ Promo code validation works
- ⚠️ Need to connect checkout to track conversions
- ⚠️ Need to update Airtable when order completes

---

### Q4: Why are "Total Revenue" and "Your Earnings" different on the influencer page?

**Total Revenue:**
- The FULL order value from all referrals
- Example: If 10 customers buy £50 each = £500 total revenue
- This is the total sales YOU made because of the influencer

**Your Earnings (Commission):**
- The amount the influencer EARNS (not keeps!)
- Calculated as: Total Revenue × Commission Rate
- Example: £500 revenue × 15% = £75 earnings for influencer

**Visual Example:**

```
Influencer "Nisha" with 15% commission rate:

Customer 1: Buys £50 → Nisha earns £7.50
Customer 2: Buys £75 → Nisha earns £11.25
Customer 3: Buys £100 → Nisha earns £15.00

Total Revenue: £225 (what customers spent)
Your Earnings: £33.75 (what Nisha gets paid)
```

**Why Show Both?**
- **Total Revenue** = Shows their impact (motivates them!)
- **Your Earnings** = Shows what they'll be paid (transparent!)

---

### Q5: How do we give them money (commission payouts)?

**Manual Payout Process (Current):**

**Monthly:**
1. Open Airtable → Influencers or Ambassadors table
2. Filter by: `CommissionEarned > CommissionPaid`
3. This shows who needs to be paid
4. Contact each person for payment details (PayPal, bank transfer)
5. Send payment via:
   - PayPal (instant)
   - Bank transfer (1-2 days)
   - Wise/Revolut (international)
6. Update `CommissionPaid` field with amount sent
7. Send payment confirmation email

**Example Workflow:**

```
Nisha's Record in Airtable:
- CommissionEarned: £75.00
- CommissionPaid: £0.00
- Balance Owed: £75.00 (formula: CommissionEarned - CommissionPaid)

You do:
1. Email Nisha: "You've earned £75! What's your PayPal?"
2. She replies: nisha@email.com
3. Send £75 via PayPal
4. Update record: CommissionPaid = £75.00
5. Email her: "Paid! Thank you for promoting us!"
```

**Automated Payout (Future Enhancement):**
- Integrate Stripe Connect or PayPal Payouts API
- Influencers add payment method to dashboard
- System auto-pays when threshold reached (e.g., £50 minimum)
- Email confirmation sent automatically

---

### Q6: What happens when someone orders using a referral link?

**Complete Flow:**

**Step 1: Click**
```
Customer clicks: https://girlsecret.co.uk/?ref=NISHA20
→ Lands on homepage
→ System stores "NISHA20" in session
→ TotalClicks +1 in Airtable
```

**Step 2: Browse & Shop**
```
Customer browses products
→ Referral code still in session
→ Adds items to cart
```

**Step 3: Cart**
```
Customer views cart
→ System auto-applies NISHA20 promo code
→ Shows: "15% off with Nisha's code!"
→ Discount calculated and applied
```

**Step 4: Checkout**
```
Customer checks out
→ Order created with:
  - OrderTotal: £50.00
  - Discount: £7.50 (15%)
  - ReferralCode: NISHA20
  - Final: £42.50
```

**Step 5: Order Complete**
```
System updates Influencers table:
→ TotalConversions: +1
→ TotalRevenue: +£50.00 (before discount)
→ TotalCommission: +£7.50 (£50 × 15%)
```

**Step 6: Monthly Payout**
```
You pay Nisha £7.50 via PayPal
→ Update CommissionPaid: £7.50
→ Send confirmation email
```

---

## 🔧 What Needs to Be Connected

### Currently Missing (Need to Build):

**1. Checkout → Referral Tracking Integration**
```javascript
// In checkout completion:
if (referralCode) {
  // Update Influencers/Ambassadors table
  await incrementReferralStats(referralCode, {
    conversions: +1,
    revenue: orderTotal,
    commission: orderTotal * commissionRate
  });
}
```

**2. Order Table → Referral Code Field**
```
Add to Orders table in Airtable:
- ReferralCode (text)
- ReferralType (Influencer/Ambassador)
- CommissionAmount (currency)
```

**3. Commission Tracking**
```
Create monthly reports showing:
- Each influencer's sales
- Commission owed
- Commission paid
- Balance due
```

---

## 📊 Recommended Setup

### Step 1: Create Referral-Enabled Promo Codes

For each approved influencer/ambassador:

```
Airtable PromoCodes table:
Code: NISHA20 (matches their referral code!)
DiscountType: percentage
DiscountValue: 15
Active: ✓
LinkedInfluencer: [Link to Influencers table] (optional)
```

### Step 2: Set Commission Rates

```
Airtable Influencers table:
CommissionRate: 15%

Airtable Ambassadors table:
CommissionRate: 10%
```

### Step 3: Monitor Performance

**Weekly:**
- Check top performers
- Reach out with encouragement
- Share best-performing content

**Monthly:**
- Calculate commissions owed
- Process payments
- Send performance reports

---

## 💡 Pro Tips

**Tip 1: Higher Discounts for Better Influencers**
```
Micro influencer (5k-50k): 10% discount, 15% commission
Macro influencer (50k-500k): 15% discount, 15% commission
Mega influencer (500k+): 20% discount, 20% commission
```

**Tip 2: Bonus Commissions**
```
First month: 15% standard
After 10 sales: 20% bonus rate
After 50 sales: 25% VIP rate
```

**Tip 3: Track Everything**
```
In Airtable, create views:
- "Top Performers" (sort by TotalRevenue desc)
- "Need Payment" (CommissionEarned > CommissionPaid)
- "Inactive" (no clicks in 30 days)
- "New This Month" (ApprovedDate within 30 days)
```

---

## 📋 Quick Reference

### Creating a New Influencer Partnership

1. **They Apply** → `/influencer-program`
2. **You Review** → Airtable Influencers table
3. **You Approve** → Change Status to "Approved"
4. **Create Promo** → PromoCodes table with their code
5. **Send Welcome** → Email with referral link
6. **They Promote** → Share link on social media
7. **You Track** → Monitor their dashboard
8. **You Pay** → Monthly commission payouts

### Tracking a Sale

1. **Customer Clicks** → ?ref=CODE
2. **Session Stores** → referralCode in cookie
3. **Promo Applied** → Automatic at cart
4. **Order Placed** → Linked to referral
5. **Stats Update** → Clicks, conversions, revenue
6. **Commission Calc** → Automatic based on rate
7. **You Pay** → Monthly payout process

---

## 🚀 Next Steps for Full Implementation

**I can build for you:**

1. **Checkout Integration**
   - Link orders to referral codes
   - Auto-update influencer stats
   - Track commissions in Orders table

2. **Admin Dashboard**
   - View all influencers/ambassadors
   - See pending commissions
   - Process bulk payouts
   - Generate reports

3. **Automated Emails**
   - Welcome email when approved
   - Monthly performance reports
   - Payment confirmation emails

4. **Enhanced Influencer Dashboard**
   - Recent orders from their link
   - Earnings breakdown by month
   - Downloadable reports
   - Payment request button

**Want me to build any of these?** Let me know and I'll implement them! 🎯
