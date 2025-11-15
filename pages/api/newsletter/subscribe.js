import { subscribeToNewsletter } from '../../../lib/airtable';
import { isValidEmail } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, source = 'Website Modal' } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({
      email: email.toLowerCase().trim(),
      source,
      subscribedAt: new Date().toISOString(),
    });

    if (!result.success) {
      // Check if it's an "already subscribed" error
      if (result.error && result.error.includes('already subscribed')) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          alreadySubscribed: true,
        });
      }

      return res.status(500).json({
        error: result.error || 'Failed to subscribe to newsletter',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
