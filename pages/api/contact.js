import { sendContactEmail } from '../../lib/email';
import { createContactMessage } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Validate message length (prevent abuse)
    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message is too long (max 5000 characters)' });
    }

    // Store contact message in Airtable (for record-keeping)
    try {
      await createContactMessage({
        name,
        email,
        subject,
        message,
        submittedAt: new Date().toISOString(),
      });
    } catch (error) {
      // Log error but don't fail the request if Airtable fails
      console.error('Failed to store contact message in Airtable:', error);
    }

    // Send email notification to support team
    const emailResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    if (emailResult.success) {
      return res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
      });
    } else {
      // Email failed but we logged the message in Airtable
      console.error('Failed to send contact email:', emailResult.error);
      return res.status(500).json({
        error: 'Failed to send message. Please try again or email us directly at support@girlsecretuk.com',
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your message. Please try again.',
    });
  }
}
