import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable body parser for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent succeeded:', paymentIntent.id);

        // Here you can update the order status in Airtable
        // The order ID should be in paymentIntent.metadata.orderId
        if (paymentIntent.metadata.orderId) {
          // TODO: Update order status to "Paid" in Airtable
          console.log('Order paid:', paymentIntent.metadata.orderId);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);

        // Handle failed payment
        if (failedPayment.metadata.orderId) {
          // TODO: Update order status to "Payment Failed" in Airtable
          console.log('Order payment failed:', failedPayment.metadata.orderId);
        }
        break;

      case 'charge.succeeded':
        const charge = event.data.object;
        console.log('Charge succeeded:', charge.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
