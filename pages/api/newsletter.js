// Newsletter subscription API endpoint
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '../../lib/airtable';
import { sendWelcomeEmail } from '../../lib/email';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleSubscribe(req, res);
  } else if (req.method === 'DELETE') {
    return handleUnsubscribe(req, res);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}

// Handle newsletter subscription
async function handleSubscribe(req, res) {
  try {
    const { email, firstName, source = 'footer' } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({
      email: email.toLowerCase().trim(),
      firstName: firstName || '',
      source,
      subscribedAt: new Date().toISOString(),
      isActive: true,
    });

    if (!result.success) {
      // Check if already subscribed
      if (result.error && result.error.includes('already subscribed')) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter',
          alreadySubscribed: true,
        });
      }

      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to subscribe'
      });
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email, firstName);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: result.subscriber,
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Handle newsletter unsubscribe
async function handleUnsubscribe(req, res) {
  try {
    const { email, token } = req.body;

    if (!email && !token) {
      return res.status(400).json({
        success: false,
        error: 'Email or unsubscribe token is required'
      });
    }

    const result = await unsubscribeFromNewsletter(email || token);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to unsubscribe'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
