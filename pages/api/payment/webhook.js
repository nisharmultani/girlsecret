import { buffer } from 'micro';
import { constructWebhookEvent } from '../../../lib/stripe';
import { updateOrderPaymentStatus } from '../../../lib/airtable';

// Disable body parsing, we need the raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the raw body as a buffer
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    // Verify and construct the event
    const result = constructWebhookEvent(buf.toString(), signature);

    if (!result.success) {
      console.error('Webhook verification failed:', result.error);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = result.event;

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);

        // Update order in database
        if (paymentIntent.metadata.orderNumber) {
          await updateOrderPaymentStatus(
            paymentIntent.metadata.orderNumber,
            'Paid',
            {
              paymentIntentId: paymentIntent.id,
              paymentMethod: paymentIntent.payment_method,
              amountReceived: paymentIntent.amount_received / 100,
            }
          );
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);

        // Update order status to payment failed
        if (paymentIntent.metadata.orderNumber) {
          await updateOrderPaymentStatus(
            paymentIntent.metadata.orderNumber,
            'Payment Failed',
            {
              paymentIntentId: paymentIntent.id,
              error: paymentIntent.last_payment_error?.message || 'Payment failed',
            }
          );
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        console.log('Refund processed:', charge.id);

        // Handle refund logic here
        // You can update order status to "Refunded"
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        console.log('Payment canceled:', paymentIntent.id);

        if (paymentIntent.metadata.orderNumber) {
          await updateOrderPaymentStatus(
            paymentIntent.metadata.orderNumber,
            'Canceled',
            {
              paymentIntentId: paymentIntent.id,
            }
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}
