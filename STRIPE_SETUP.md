# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for the GirlSecret e-commerce platform.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Node.js installed on your machine
- Access to your project's environment variables

## Installation

The required Stripe packages are already installed:
```bash
npm install stripe @stripe/stripe-js
```

## Configuration Steps

### 1. Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. You'll see two types of keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

⚠️ **Important**: Never commit your secret key to version control!

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root (or update your existing `.env` file):

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Configure Stripe Webhooks

Webhooks allow Stripe to notify your application about payment events.

#### For Local Development:

1. Install the Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   # Download from https://github.com/stripe/stripe-cli/releases

   # Linux
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/payment/webhook
   ```

4. The CLI will output a webhook signing secret (starts with `whsec_`). Copy this to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`.

#### For Production:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/payment/webhook`
4. Select the following events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
5. Copy the webhook signing secret and add it to your production environment variables

## Testing Payments

Stripe provides test card numbers for testing:

### Successful Payment
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)

### Declined Payment
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

### Requires Authentication
- Card: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits

More test cards: https://stripe.com/docs/testing

## How It Works

### Payment Flow

1. **Customer Submits Checkout Form**
   - Form data is collected including card details
   - Order information is prepared

2. **Create Payment Intent** (`/api/payment/create-intent`)
   - Server creates a Stripe PaymentIntent with the order amount
   - Returns a client secret to the frontend

3. **Confirm Payment**
   - Frontend uses Stripe.js to securely confirm the payment
   - Card details are sent directly to Stripe (never touch your server)

4. **Create Order**
   - After successful payment, order is created in Airtable
   - Payment Intent ID is stored with the order
   - Confirmation email is sent

5. **Webhook Confirmation** (`/api/payment/webhook`)
   - Stripe sends webhook events to confirm payment status
   - Can be used to update order status or trigger additional actions

## Security Best Practices

✅ **DO:**
- Keep your secret key secure and never expose it client-side
- Use environment variables for all API keys
- Validate webhook signatures to ensure events come from Stripe
- Use HTTPS in production
- Handle errors gracefully and log them securely

❌ **DON'T:**
- Commit API keys to version control
- Use production keys in development
- Skip webhook signature verification
- Store card details on your server

## Troubleshooting

### "Invalid API Key provided"
- Check that your environment variables are set correctly
- Ensure you're using the correct key (test vs live)
- Restart your development server after changing environment variables

### "No such PaymentIntent"
- Verify the PaymentIntent ID is being passed correctly
- Check that you're using matching test/live keys

### "Webhook signature verification failed"
- Ensure your webhook secret matches the one from Stripe Dashboard/CLI
- Check that you're sending the raw request body to the verification function

### Payment Fails in Testing
- Use the correct test card numbers
- Ensure expiry date is in the future
- Check browser console for detailed error messages

## Going Live

Before going live with real payments:

1. **Get Verified**: Complete your Stripe account verification
2. **Switch to Live Keys**: Replace test keys with live keys in production
3. **Test Thoroughly**: Test the entire checkout flow with real card details
4. **Set Up Monitoring**: Configure alerts for failed payments
5. **Update Webhooks**: Ensure production webhook endpoint is configured
6. **Review Security**: Conduct a security review of your payment flow

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- API Reference: https://stripe.com/docs/api

## Additional Resources

- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Security Best Practices](https://stripe.com/docs/security)
