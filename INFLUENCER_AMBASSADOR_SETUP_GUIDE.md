# Influencer & Ambassador Program Setup Guide

## Overview

Your Influencer and Ambassador programs are now fully integrated with proper tracking, unique referral codes, and analytics. This guide explains how to set up the Airtable tables and start managing your programs.

---

## 🎯 What's New

### Before
- ✗ Applications just sent to contact form
- ✗ No referral code generation
- ✗ No tracking or analytics
- ✗ No way to manage influencers/ambassadors
- ✗ No commission tracking

### After
- ✅ Dedicated Airtable tables for each program
- ✅ Automatic unique referral code generation
- ✅ Click and sales tracking
- ✅ Commission calculation
- ✅ Status management (Pending/Approved/Active/Inactive)
- ✅ Full analytics for each influencer/ambassador

---

## 📊 Airtable Tables Setup

### Table 1: Influencers

Create a table named **"Influencers"** with these fields:

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Name | Single line text | Influencer's full name | `Sarah Johnson` |
| Email | Email | Contact email | `sarah@example.com` |
| Instagram | Single line text | Instagram handle | `@sarahstyle` |
| FollowerCount | Single select | Follower range | `10k-50k` |
| Niche | Single select | Content category | `Fashion` |
| Message | Long text | Application message | `I love your brand because...` |
| Status | Single select | Application status | `Pending`, `Approved`, `Active`, `Rejected` |
| ReferralCode | Single line text | Unique code | `SARAHJOH5X2A` |
| AppliedDate | Date | When they applied | `2025-11-25` |
| ApprovedDate | Date | When approved | `2025-11-26` |
| TotalClicks | Number | Link clicks tracked | `245` |
| TotalSales | Number | Orders from their link | `15` |
| TotalRevenue | Currency (£) | Revenue generated | `£750.00` |
| CommissionRate | Percent | Their commission % | `15%` |
| CommissionEarned | Currency (£) | Total earned | `£112.50` |
| CommissionPaid | Currency (£) | Amount paid out | `£0.00` |
| LastActivityDate | Date | Last referral click/sale | `2025-11-24` |
| Notes | Long text | Internal notes | `Great content creator` |

**Single Select Options:**

**FollowerCount:**
- `5k-10k`
- `10k-50k`
- `50k-100k`
- `100k+`

**Niche:**
- `Fashion`
- `Lifestyle`
- `Beauty`
- `Fitness`
- `Other`

**Status:**
- `Pending` (default for new applications)
- `Approved` (accepted, ready to start)
- `Active` (currently promoting)
- `Inactive` (paused)
- `Rejected` (not accepted)

---

### Table 2: Ambassadors

Create a table named **"Ambassadors"** with these fields:

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| Name | Single line text | Ambassador's full name | `Emma Williams` |
| Email | Email | Contact email | `emma@example.com` |
| Phone | Phone number | Contact number | `+44 7700 900000` |
| City | Single line text | Location | `London` |
| University | Single line text | School (if applicable) | `UCL` |
| WhyYou | Long text | Why they want to join | `I'm passionate about...` |
| Experience | Long text | Relevant experience | `I've been a brand rep for...` |
| Status | Single select | Application status | `Pending`, `Approved`, `Active`, `Rejected` |
| ReferralCode | Single line text | Unique code | `AMBEMMAEWIL3B7K` |
| AppliedDate | Date | When they applied | `2025-11-25` |
| ApprovedDate | Date | When approved | `2025-11-26` |
| TotalClicks | Number | Link clicks tracked | `128` |
| TotalSales | Number | Orders from their link | `8` |
| TotalRevenue | Currency (£) | Revenue generated | `£320.00` |
| CommissionRate | Percent | Their commission % | `10%` |
| CommissionEarned | Currency (£) | Total earned | `£32.00` |
| CommissionPaid | Currency (£) | Amount paid out | `£0.00` |
| LastActivityDate | Date | Last referral click/sale | `2025-11-23` |
| Notes | Long text | Internal notes | `Campus ambassador at UCL` |

**Single Select Options:**

**Status:**
- `Pending` (default for new applications)
- `Approved` (accepted, ready to start)
- `Active` (currently promoting)
- `Inactive` (paused)
- `Rejected` (not accepted)

---

## 🚀 How It Works

### User Applies

**Influencer Flow:**
1. User visits `/influencer-program`
2. Fills out application form
3. Clicks "Submit Application"
4. System creates record in Influencers table
5. Auto-generates unique referral code (e.g., `SARAHJOH5X2A`)
6. Sets Status to "Pending"
7. User receives confirmation with their referral code
8. Email notification sent to admin

**Ambassador Flow:**
1. User visits `/ambassador-program`
2. Fills out application form
3. Clicks "Submit Application"
4. System creates record in Ambassadors table
5. Auto-generates unique referral code (e.g., `AMBEMMAEWIL3B7K`)
6. Sets Status to "Pending"
7. User receives confirmation with their referral code
8. Email notification sent to admin

### You Review & Approve

1. **Check Airtable**
   - Open Influencers or Ambassadors table
   - Filter by Status = "Pending"
   - Review applications

2. **Approve Application**
   - Change Status to "Approved"
   - Optionally set ApprovedDate
   - Adjust CommissionRate if needed
   - Add any Notes

3. **Send Welcome Email**
   - Email them their referral code
   - Explain how to use it
   - Provide marketing materials
   - Share referral link format

### Influencer/Ambassador Promotes

**Referral Link Format:**
```
https://girlsecret.co.uk/?ref=SARAHJOH5X2A
```

**When Customer Visits:**
1. Customer clicks influencer's link
2. System captures referral code in session
3. TotalClicks increments in Airtable
4. Promo code auto-applies at checkout (if exists)

**When Customer Purchases:**
1. Order is placed with referral code
2. TotalSales increments
3. TotalRevenue adds order total
4. CommissionEarned calculates (Revenue × CommissionRate)
5. LastActivityDate updates

---

## 💰 Commission Structure

### Default Rates

**Influencers:**
- Default: **15% commission**
- Can be customized per influencer
- Good for: Content creators with engaged audiences

**Ambassadors:**
- Default: **10% commission**
- Can be customized per ambassador
- Good for: Students, campus reps, local advocates

### Commission Calculation

```javascript
// Example for an influencer with 15% commission

Order Total: £50.00
Commission Rate: 15%
Commission Earned: £50.00 × 15% = £7.50

// Added to their CommissionEarned field
```

### Tracking Commissions

**In Airtable, you can:**
1. See total CommissionEarned for each person
2. Track CommissionPaid when you pay them
3. Calculate outstanding balance: `CommissionEarned - CommissionPaid`

**Create Airtable Formula:**
```
{CommissionEarned} - {CommissionPaid}
```
Name the field: `CommissionOwed`

---

## 📈 Analytics & Reporting

### Key Metrics to Track

**Per Influencer/Ambassador:**
- **Conversion Rate**: `(TotalSales / TotalClicks) × 100`
- **Average Order Value**: `TotalRevenue / TotalSales`
- **ROI**: `(TotalRevenue - CommissionEarned) / CommissionEarned`

**Program-Level:**
- Total active influencers/ambassadors
- Total clicks generated
- Total sales from referrals
- Total revenue from referrals
- Total commissions owed
- Average commission per sale

### Airtable Views to Create

**View 1: Pending Applications**
- Filter: Status = "Pending"
- Sort: AppliedDate (newest first)
- Purpose: Review new applications

**View 2: Top Performers**
- Filter: Status = "Active"
- Sort: TotalRevenue (highest first)
- Purpose: See who's driving most sales

**View 3: Commission Report**
- Filter: CommissionOwed > 0 (using formula field)
- Sort: CommissionOwed (highest first)
- Purpose: See who needs to be paid

**View 4: Inactive (Need Outreach)**
- Filter: Status = "Active" AND LastActivityDate < 30 days ago
- Purpose: Re-engage inactive partners

---

## 🎁 Creating Matching Promo Codes

For each approved influencer/ambassador, create a matching promo code:

### In PromoCodes Table:

**For Influencer "SARAHJOH5X2A":**
```
Code: SARAHJOH5X2A (match their referral code)
DiscountType: percentage
DiscountValue: 15
MinPurchase: 0
MaxDiscount: 25
Active: ✓
ValidFrom: 2025-11-26
ValidUntil: 2026-12-31
Description: Sarah Johnson influencer code
```

**For Ambassador "AMBEMMAEWIL3B7K":**
```
Code: AMBEMMAEWIL3B7K (match their referral code)
DiscountType: percentage
DiscountValue: 10
MinPurchase: 0
MaxDiscount: 15
Active: ✓
ValidFrom: 2025-11-26
ValidUntil: 2026-12-31
Description: Emma Williams ambassador code
```

**Why Create Promo Codes:**
- Customers get instant discount when using referral link
- Better conversion rates
- Tracks back to specific influencer/ambassador
- Customers can manually enter code too

---

## 📧 Email Templates

### Application Confirmation (Auto-Sent)

**Subject:** Thank you for applying to the GirlSecret [Influencer/Ambassador] Program

```
Hi [Name],

Thank you for applying to join the GirlSecret [Influencer/Ambassador] Program!

Your application has been received and is under review. We'll get back to you within [48 hours/5 business days].

Your unique referral code: [ReferralCode]

We're excited to potentially have you as part of our team!

Best regards,
The GirlSecret Team
```

### Approval Email (Manual Send)

**Subject:** Welcome to the GirlSecret [Influencer/Ambassador] Program! 🎉

```
Hi [Name],

Congratulations! Your application has been approved!

YOUR DETAILS:
• Referral Code: [ReferralCode]
• Commission Rate: [CommissionRate]%
• Your Unique Link: https://girlsecret.co.uk/?ref=[ReferralCode]

HOW IT WORKS:
1. Share your unique link with your audience
2. Customers get [Discount]% off when using your link
3. You earn [CommissionRate]% commission on all sales
4. Track your performance in our dashboard (coming soon!)

GETTING STARTED:
1. Save your referral link
2. Create content featuring our products
3. Share your link on social media, stories, blogs
4. Watch your commissions grow!

We'll send you exclusive updates, new product launches, and special promotions.

Need marketing materials? Reach out anytime!

Welcome to the team!

The GirlSecret Team
```

---

## 🔧 Managing Your Programs

### Weekly Tasks

**Monday: Review Applications**
- Check Pending Applications view
- Approve/reject new applicants
- Send welcome emails to approved members

**Wednesday: Check Performance**
- Review Top Performers view
- Reach out to top performers with thanks/bonuses
- Identify and contact inactive members

**Friday: Commission Review**
- Check Commission Report view
- Plan monthly payouts
- Update CommissionPaid field after payments

### Monthly Tasks

**Commission Payouts:**
1. Export Commission Report from Airtable
2. Process payments (PayPal, bank transfer, etc.)
3. Update CommissionPaid field for each person
4. Send payment confirmation emails

**Program Analysis:**
1. Calculate program ROI
2. Identify top 10 performers
3. Plan special bonuses or incentives
4. Review and adjust commission rates if needed

### Quarterly Tasks

**Program Review:**
1. Survey influencers/ambassadors for feedback
2. Update program terms if needed
3. Launch special campaigns
4. Recruit new members in underserved niches

---

## 🎯 Best Practices

### Recruiting

**Good Fit Indicators:**
- Engaged audience (not just follower count)
- Authentic content style
- Alignment with brand values
- Previous brand partnership experience
- Professional communication

**Red Flags:**
- Fake followers
- Low engagement rates
- Unprofessional social media presence
- Unrealistic commission expectations

### Supporting Your Partners

**Provide:**
- High-quality product images
- Brand guidelines
- Suggested captions/hashtags
- Exclusive discount codes
- Early access to new products
- Regular communication and updates

### Retention Strategies

1. **Monthly Newsletter**: Share program updates, top performers, tips
2. **Exclusive Perks**: Early access, free products, higher commissions for top performers
3. **Community Building**: Private Facebook group or Discord
4. **Recognition**: Feature top performers on your social media
5. **Contests**: Monthly challenges with bonuses

---

## 📊 Sample Dashboard (Future Feature)

We can build an influencer/ambassador dashboard where they can:
- View their referral link
- See click statistics
- Track sales and commissions
- Download marketing materials
- Update their profile
- Request payouts

**Interested?** Let me know and I can build this next!

---

## 🚀 Quick Start Checklist

### Initial Setup (Do Once)

- [ ] Create "Influencers" table in Airtable with all fields
- [ ] Create "Ambassadors" table in Airtable with all fields
- [ ] Set up Airtable views (Pending, Top Performers, Commission Report)
- [ ] Create email templates for confirmations and approvals
- [ ] Set up payment method for commissions (PayPal, etc.)

### For Each New Application

- [ ] Review application in Airtable
- [ ] Check social media presence (for influencers)
- [ ] Approve or reject
- [ ] Update Status field
- [ ] Create matching promo code in PromoCodes table
- [ ] Send welcome email with details
- [ ] Add to tracking spreadsheet (optional)

### Ongoing Management

- [ ] Review applications weekly
- [ ] Track performance monthly
- [ ] Pay commissions monthly
- [ ] Re-engage inactive members quarterly
- [ ] Optimize program based on data

---

## 💡 Pro Tips

1. **Start Small**: Approve 5-10 influencers/ambassadors initially
2. **Test First**: Give new members a 30-day trial period
3. **Track Everything**: Use Airtable automations to track clicks and sales
4. **Communicate Often**: Monthly updates keep members engaged
5. **Reward Top Performers**: Bonus commissions, free products, features
6. **Be Selective**: Quality > quantity - engaged audience beats large following
7. **Clear Terms**: Set expectations upfront about commission, payout timing

---

## 🎉 You're Ready!

Your Influencer and Ambassador programs are now fully functional with:
- ✅ Automated application processing
- ✅ Unique referral code generation
- ✅ Tracking and analytics ready
- ✅ Commission calculation system
- ✅ Professional management workflow

**Next Steps:**
1. Create the Airtable tables (10 minutes)
2. Test the application forms (2 minutes)
3. Create your first promo codes (5 minutes)
4. Start recruiting! (ongoing)

Happy partnering! 🚀
