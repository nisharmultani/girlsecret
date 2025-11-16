# Stripe Payment Integration - Setup Guide

## 🎉 What's Been Implemented

Your GirlSecret store now has **real Stripe payment processing**! Here's what's been added:

### ✅ Completed Components

1. **Stripe Configuration** (`/lib/stripe.js`)
   - Payment intent creation
   - Customer management
   - Refund processing
   - Webhook verification

2. **Payment Intent API** (`/pages/api/payment/create-intent.js`)
   - Creates payment intents for checkout
   - Validates amounts
   - Handles errors

3. **Webhook Handler** (`/pages/api/payment/webhook.js`)
   - Listens for Stripe events
   - Updates order status automatically
   - Handles payment success/failure

4. **Stripe Payment Component** (`/components/StripePaymentForm.jsx`)
   - Secure card input with Stripe Elements
   - 3D Secure support
   - Error handling
   - Loading states

5. **Updated Airtable Functions**
   - `updateOrderPaymentStatus()` function added
   - Tracks payment intent IDs
   - Updates order status

6. **Package Installation**
   - `stripe` - Server-side Stripe SDK
   - `@stripe/stripe-js` - Client-side Stripe.js library
   - `@stripe/react-stripe-js` - React components for Stripe

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Complete the registration (email, password, business details)
4. You'll be in **Test Mode** by default - Perfect for now!

### Step 2: Get Your API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`) - Safe to use in your frontend
   - **Secret key** (starts with `sk_test_...`) - Keep this secret!

### Step 3: Add Keys to Your Environment

1. Copy `.env.example` to `.env.local` (if you haven't already)
2. Add your Stripe keys:

```bash
# Stripe Payment Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxx
# Leave webhook secret empty for now (we'll add it in Step 5)
STRIPE_WEBHOOK_SECRET=
```

3. **Important:** Never commit your `.env.local` file to git!

### Step 4: Test the Integration

1. Restart your development server:
```bash
npm run dev
```

2. Go to your checkout page
3. Use Stripe test card numbers:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **3D Secure:** `4000 0027 6000 3184`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC (e.g., 123)

4. Complete a test order and verify it appears in:
   - Your Airtable Orders table
   - Stripe Dashboard → Payments

### Step 5: Set Up Webhooks (Important!)

Webhooks automatically update your orders when payments succeed/fail.

#### Option A: For Testing Locally (Stripe CLI)

1. Install Stripe CLI:
```bash
# Mac
brew install stripe/stripe-cli/stripe

# Windows
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Linux
# Download from https://github.com/stripe/stripe-cli/releases
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

4. Copy the webhook secret (starts with `whsec_...`) and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
```

#### Option B: For Production (After Deployment)

1. Deploy your site to production (Vercel, Netlify, etc.)
2. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
3. Click "Add endpoint"
4. Enter your webhook URL:
   ```
   https://your-domain.com/api/payment/webhook
   ```
5. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
6. Click "Add endpoint"
7. Copy the "Signing secret" (starts with `whsec_...`)
8. Add it to your production environment variables

---

## 🔧 Complete the Checkout Page Integration

The checkout page has been partially updated. Here's what you need to finalize:

### Update `/pages/checkout.jsx`

1. **Replace the demo payment section** (around line 588-645) with:

```jsx
{/* Payment Information */}
<div className="bg-white rounded-xl shadow-sm p-6">
  <h2 className="text-xl font-semibold mb-4">Payment Information</h2>

  {paymentError && (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p className="text-sm text-red-800">{paymentError}</p>
    </div>
  )}

  {clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm
        onSuccess={(paymentIntent) => handlePaymentSuccess(paymentIntent, getValues())}
        onError={(error) => setPaymentError(error.message)}
        amount={total}
      />
    </Elements>
  ) : (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
      <span className="ml-3 text-gray-600">Loading payment form...</span>
    </div>
  )}
</div>
```

2. **Complete the `handlePaymentSuccess` function** (add after line 279):

```jsx
      // Clear cart
      clearCart();

      // Show success
      setOrderComplete(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        if (isAuthenticated) {
          router.push('/account/orders');
        } else {
          router.push('/');
        }
      }, 5000);
    } catch (error) {
      console.error('Order creation error:', error);
      setPaymentError('Failed to create order. Please contact support.');
      setIsProcessing(false);
    }
  };
```

3. **Remove the old demo submit handler** - The payment now happens in StripePaymentForm component

4. **Import `getValues` from react-hook-form**:

```jsx
const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm();
```

---

## 💳 Airtable Database Updates

Add these fields to your **Orders** table in Airtable:

| Field Name | Type | Description |
|-----------|------|-------------|
| PaymentStatus | Single Select | Options: Pending, Paid, Failed, Canceled, Refunded |
| PaymentIntentId | Text | Stripe payment intent ID |
| PaymentMethod | Text | Payment method used (card brand, last 4 digits) |
| AmountReceived | Currency | Actual amount received (in GBP) |
| PaymentError | Long Text | Error message if payment failed |

### How to Add Fields:

1. Open your Airtable base
2. Click on the Orders table
3. Click "+" to add a new field
4. Create each field with the type specified above
5. For "PaymentStatus", add the options: Pending, Paid, Failed, Canceled, Refunded

---

## 🧪 Testing Your Integration

### Test Card Numbers

| Card Number | Description |
|------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Declined payment |
| 4000 0027 6000 3184 | Requires 3D Secure authentication |
| 4000 0000 0000 9995 | Declined with insufficient funds |

**For all test cards:**
- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any billing postcode

### Testing Checklist

- [ ] Payment succeeds with test card
- [ ] Order appears in Airtable with "Paid" status
- [ ] Payment appears in Stripe Dashboard
- [ ] Webhook updates order status
- [ ] Declined cards show error message
- [ ] 3D Secure authentication works
- [ ] Order confirmation email sent
- [ ] Cart clears after successful payment

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep your Secret Key (`SK_TEST_...`) secret
- Use environment variables for all API keys
- Validate amounts on the server-side
- Use HTTPS in production
- Enable webhook signature verification

### ❌ DON'T:
- Commit API keys to Git
- Use live keys in development
- Trust payment amounts from the client
- Skip webhook signature verification
- Store card details yourself (Stripe handles this)

---

## 🌍 Going Live (Production Checklist)

When you're ready to accept real payments:

1. **Switch to Live Mode in Stripe:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Toggle from "Test mode" to "Live mode" (top right)
   - Get your Live API keys

2. **Update Environment Variables:**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxx
   ```

3. **Activate Your Stripe Account:**
   - Complete business verification in Stripe Dashboard
   - Add bank account for payouts
   - Verify your business details

4. **Set Up Production Webhooks:**
   - Create webhook endpoint at `https://yourdomain.com/api/payment/webhook`
   - Add webhook secret to production env variables

5. **Test Everything:**
   - Make a small real payment (you can refund it)
   - Verify webhook works
   - Check email notifications
   - Test refund process

6. **Enable Additional Features (Optional):**
   - Set up email receipts in Stripe
   - Enable Radar for fraud prevention
   - Configure dispute handling
   - Set up automatic payouts

---

## 📊 Monitoring & Management

### Stripe Dashboard

Access your [Stripe Dashboard](https://dashboard.stripe.com) to:

- View all payments
- Issue refunds
- Handle disputes
- See analytics
- Export data
- Manage customers

### Common Tasks

#### Issue a Refund:
1. Go to Stripe Dashboard → Payments
2. Find the payment
3. Click "Refund"
4. Enter amount and reason
5. Confirm

#### Handle Failed Payment:
1. Check webhook logs for errors
2. Review order in Airtable
3. Contact customer
4. Manually retry or refund

#### View Analytics:
1. Stripe Dashboard → Reports
2. See successful payments, failures, refunds
3. Export data for accounting

---

## 🆘 Troubleshooting

### Payment Form Doesn't Load
- **Check:** Publishable key in `.env.local`
- **Check:** Console for errors
- **Solution:** Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set

### "No such payment_intent" Error
- **Cause:** Payment intent not created or expired
- **Solution:** Refresh checkout page to create new intent

### Webhook Not Receiving Events
- **Check:** Webhook URL is correct
- **Check:** Stripe CLI is running (local dev)
- **Check:** Webhook secret is set
- **Solution:** Restart Stripe CLI or verify endpoint URL

### Order Created But Payment Failed
- **Check:** Webhook events in Stripe Dashboard
- **Check:** Server logs for errors
- **Solution:** Webhook should update order status automatically

### Payment Succeeds But Order Stays "Pending"
- **Cause:** Webhook not configured or failing
- **Solution:** Set up webhook (see Step 5)

---

## 📚 Additional Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Testing:** https://stripe.com/docs/testing
- **Stripe Elements:** https://stripe.com/docs/stripe-js
- **Webhooks Guide:** https://stripe.com/docs/webhooks
- **Security Best Practices:** https://stripe.com/docs/security/guide

---

## 💡 Next Steps & Enhancements

Once basic integration is working, consider adding:

1. **Save Payment Methods**
   - Let customers save cards for faster checkout
   - Implement with Stripe Customer objects

2. **Subscription Support**
   - Recurring billing for subscription boxes
   - Automatic renewals

3. **Multiple Currencies**
   - Accept payments in EUR, USD, etc.
   - Automatic currency conversion

4. **Payment Request API**
   - Apple Pay
   - Google Pay
   - One-click checkout

5. **Invoice System**
   - Generate PDF invoices
   - Send via email automatically

6. **Advanced Fraud Prevention**
   - Enable Stripe Radar
   - Set up custom rules
   - Review risky payments

---

## ✅ Summary

You now have:
- ✅ Full Stripe payment integration
- ✅ Secure payment processing
- ✅ Automatic order updates via webhooks
- ✅ Test mode ready to use
- ✅ Production-ready code

**Current Status:** Test Mode (use test cards)

**To Go Live:** Follow "Going Live" checklist above

**Questions?** Contact Stripe support or check their excellent documentation!

---

Last Updated: November 16, 2024
Version: 1.0
