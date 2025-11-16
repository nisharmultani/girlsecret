import { createPaymentIntent } from '../../../lib/stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'gbp', metadata = {} } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Validate amount is reasonable (between £0.50 and £10,000)
    if (amount < 0.5 || amount > 10000) {
      return res.status(400).json({
        error: 'Invalid amount. Must be between £0.50 and £10,000'
      });
    }

    // Create payment intent
    const result = await createPaymentIntent({
      amount,
      currency,
      metadata: {
        ...metadata,
        source: 'GirlSecret Checkout',
        timestamp: new Date().toISOString(),
      },
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return res.status(500).json({
      error: 'Failed to create payment intent. Please try again.',
    });
  }
}
