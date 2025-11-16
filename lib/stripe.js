import Stripe from 'stripe';

// Initialize Stripe with your secret key
// In test mode, use test keys (sk_test_...)
// In production, use live keys (sk_live_...)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * Create a payment intent for checkout
 * @param {Object} params - Payment intent parameters
 * @param {number} params.amount - Amount in smallest currency unit (pence for GBP)
 * @param {string} params.currency - Currency code (default: 'gbp')
 * @param {Object} params.metadata - Additional metadata for the payment
 * @returns {Promise<Object>} Payment intent object
 */
export async function createPaymentIntent({ amount, currency = 'gbp', metadata = {} }) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Retrieve a payment intent by ID
 * @param {string} paymentIntentId - The payment intent ID
 * @returns {Promise<Object>} Payment intent object
 */
export async function retrievePaymentIntent(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent,
    };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a customer in Stripe
 * @param {Object} params - Customer parameters
 * @param {string} params.email - Customer email
 * @param {string} params.name - Customer name
 * @param {Object} params.metadata - Additional metadata
 * @returns {Promise<Object>} Customer object
 */
export async function createCustomer({ email, name, metadata = {} }) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return {
      success: true,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a refund for a payment
 * @param {string} paymentIntentId - The payment intent ID to refund
 * @param {number} amount - Amount to refund in smallest currency unit (optional, full refund if not specified)
 * @returns {Promise<Object>} Refund object
 */
export async function createRefund(paymentIntentId, amount = null) {
  try {
    const refundData = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);

    return {
      success: true,
      refund,
    };
  } catch (error) {
    console.error('Error creating refund:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify Stripe webhook signature
 * @param {string} payload - The request body
 * @param {string} signature - The Stripe signature header
 * @returns {Object} The constructed event object or error
 */
export function constructWebhookEvent(payload, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return {
      success: true,
      event,
    };
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default stripe;
