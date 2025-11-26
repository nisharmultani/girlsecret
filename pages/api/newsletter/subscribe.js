import { subscribeToNewsletter } from '../../../lib/airtable';
import { isValidEmail } from '../../../lib/auth';
import { sendEmail } from '../../../lib/email';

// Generate a unique welcome promo code
function generateWelcomeCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WELCOME${timestamp}${random}`.substring(0, 15); // Keep it short
}

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

    // Generate unique promo code
    const promoCode = 'WELCOME15'; // Using a fixed code for simplicity - everyone gets 15% off

    // Subscribe to newsletter
    const result = await subscribeToNewsletter({
      email: email.toLowerCase().trim(),
      source,
      subscribedAt: new Date().toISOString(),
      promoCode, // Store the promo code with subscription
    });

    if (!result.success) {
      // Check if it's an "already subscribed" error
      if (result.error && result.error.includes('already subscribed')) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          alreadySubscribed: true,
          promoCode: 'WELCOME15', // Give them the code anyway
        });
      }

      return res.status(500).json({
        error: result.error || 'Failed to subscribe to newsletter',
      });
    }

    // Send welcome email with promo code
    try {
      await sendEmail({
        to: email,
        subject: '💝 Welcome to GirlSecret! Here\'s Your 15% Off Code',
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #ffffff; padding: 40px 30px; }
    .promo-code { background: #f7f7f7; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 30px 0; border-radius: 10px; }
    .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 3px; font-family: 'Courier New', monospace; }
    .button { display: inline-block; background: #000; color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
    .benefits { background: #f9fafb; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .benefit-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .benefit-item:last-child { border-bottom: none; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 32px;">Welcome to GirlSecret!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your journey to intimate elegance begins here</p>
    </div>

    <div class="content">
      <h2 style="color: #333; margin-top: 0;">Hi there! 👋</h2>

      <p>We're thrilled to have you join the GirlSecret community! As a warm welcome, here's your exclusive discount code:</p>

      <div class="promo-code">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Exclusive Code</p>
        <div class="code">${promoCode}</div>
        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">15% OFF your first order!</p>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.co.uk'}/shop?promo=${promoCode}" class="button">
          Start Shopping →
        </a>
      </div>

      <div class="benefits">
        <h3 style="margin-top: 0; color: #333;">As a GirlSecret insider, you'll enjoy:</h3>
        <div class="benefit-item">✨ <strong>Exclusive Discounts</strong> - Member-only offers and early access to sales</div>
        <div class="benefit-item">🎁 <strong>Birthday Rewards</strong> - Special treats on your special day</div>
        <div class="benefit-item">📦 <strong>Free Shipping</strong> - On orders over £50</div>
        <div class="benefit-item">👗 <strong>New Arrivals First</strong> - Be the first to shop our latest collections</div>
        <div class="benefit-item">💡 <strong>Style Tips</strong> - Expert advice and styling guides</div>
      </div>

      <p><strong>Pro Tip:</strong> Use code <strong>${promoCode}</strong> at checkout to save 15% on your first order. No minimum purchase required!</p>

      <p>Ready to discover your new favorites?</p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="margin: 0 0 15px 0; color: #666;">Follow us for daily inspiration:</p>
        <a href="https://www.instagram.com/girlsecretuk" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none;">📸 Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=61583184296845" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none;">👍 Facebook</a>
        <a href="https://x.com/girlsecretuk" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none;">🐦 Twitter</a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Questions? Just reply to this email - we're here to help!
      </p>

      <p style="margin-top: 30px;">
        Love,<br>
        <strong>The GirlSecret Team</strong> 💕
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} GirlSecret. All rights reserved.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.co.uk'}/unsubscribe" style="color: #666;">Unsubscribe</a> |
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.co.uk'}/privacy" style="color: #666;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
        `,
        text: `Welcome to GirlSecret!

We're thrilled to have you join our community!

Your exclusive welcome code: ${promoCode}
Save 15% on your first order!

Shop now: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.co.uk'}/shop

As a GirlSecret insider, you'll enjoy:
✨ Exclusive discounts and early access to sales
🎁 Birthday rewards
📦 Free shipping on orders over £50
👗 First access to new arrivals
💡 Expert style tips

Follow us:
Instagram: @girlsecretuk
Facebook: GirlSecret UK
Twitter: @girlsecretuk

Questions? Just reply to this email!

Love,
The GirlSecret Team 💕
        `,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      promoCode: promoCode,
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
