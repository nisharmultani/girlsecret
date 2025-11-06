// Email service utility
// Supports multiple email providers (SendGrid, AWS SES, Mailgun, Resend)
// In development mode, logs email content to console

/**
 * Send order confirmation email
 * @param {Object} orderData - Order details
 * @param {string} customerEmail - Customer's email address
 */
export async function sendOrderConfirmationEmail(orderData, customerEmail) {
  const emailContent = generateOrderConfirmationEmail(orderData);

  return await sendEmail({
    to: customerEmail,
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html: emailContent.html,
    text: emailContent.text,
  });
}

/**
 * Send order status update email
 * @param {Object} orderData - Order details
 * @param {string} customerEmail - Customer's email address
 * @param {string} status - New order status
 */
export async function sendOrderStatusEmail(orderData, customerEmail, status) {
  const emailContent = generateOrderStatusEmail(orderData, status);

  return await sendEmail({
    to: customerEmail,
    subject: `Order ${status} - ${orderData.orderNumber}`,
    html: emailContent.html,
    text: emailContent.text,
  });
}

/**
 * Send shipping notification email
 * @param {Object} orderData - Order details
 * @param {string} customerEmail - Customer's email address
 * @param {string} trackingNumber - Shipping tracking number
 * @param {string} carrier - Shipping carrier name
 */
export async function sendShippingNotificationEmail(orderData, customerEmail, trackingNumber, carrier) {
  const emailContent = generateShippingNotificationEmail(orderData, trackingNumber, carrier);

  return await sendEmail({
    to: customerEmail,
    subject: `Your Order Has Been Shipped - ${orderData.orderNumber}`,
    html: emailContent.html,
    text: emailContent.text,
  });
}

/**
 * Send welcome email for newsletter subscription
 * @param {string} email - Subscriber's email address
 * @param {string} firstName - Subscriber's first name (optional)
 */
export async function sendWelcomeEmail(email, firstName = '') {
  const emailContent = generateWelcomeEmail(firstName);

  return await sendEmail({
    to: email,
    subject: 'Welcome to GirlSecret Newsletter! ✨',
    html: emailContent.html,
    text: emailContent.text,
  });
}

/**
 * Send email verification email for new accounts
 * @param {string} email - User's email address
 * @param {string} firstName - User's first name
 * @param {string} verificationToken - Email verification token
 */
export async function sendVerificationEmail(email, firstName, verificationToken) {
  const emailContent = generateVerificationEmail(firstName, verificationToken);

  return await sendEmail({
    to: email,
    subject: 'Verify Your Email - GirlSecret UK',
    html: emailContent.html,
    text: emailContent.text,
  });
}

/**
 * Send contact form submission to support team
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Customer's name
 * @param {string} contactData.email - Customer's email
 * @param {string} contactData.subject - Message subject
 * @param {string} contactData.message - Message content
 */
export async function sendContactEmail(contactData) {
  const emailContent = generateContactEmail(contactData);

  return await sendEmail({
    to: process.env.CONTACT_EMAIL || 'support@girlsecretuk.com',
    subject: `Contact Form: ${contactData.subject}`,
    html: emailContent.html,
    text: emailContent.text,
    replyTo: contactData.email, // Allow direct reply to customer
  });
}

/**
 * Core email sending function
 * @param {Object} emailData - Email details (to, subject, html, text, replyTo)
 */
async function sendEmail(emailData) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // In development mode, log email instead of sending
  if (isDevelopment || !process.env.EMAIL_SERVICE) {
    console.log('\n========== EMAIL (Development Mode) ==========');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    if (emailData.replyTo) console.log('Reply-To:', emailData.replyTo);
    console.log('Content:', emailData.text);
    console.log('==============================================\n');

    return {
      success: true,
      message: 'Email logged in development mode',
      emailData: emailData,
    };
  }

  // Production email sending
  try {
    const emailService = process.env.EMAIL_SERVICE; // 'sendgrid', 'ses', 'mailgun', 'resend'

    switch (emailService) {
      case 'sendgrid':
        return await sendViaSendGrid(emailData);
      case 'ses':
        return await sendViaSES(emailData);
      case 'mailgun':
        return await sendViaMailgun(emailData);
      case 'resend':
        return await sendViaResend(emailData);
      default:
        throw new Error(`Unsupported email service: ${emailService}`);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// SendGrid integration
async function sendViaSendGrid(emailData) {
  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: emailData.to,
      from: process.env.EMAIL_FROM || 'orders@girlsecretuk.com',
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };

    if (emailData.replyTo) {
      msg.replyTo = emailData.replyTo;
    }

    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('SendGrid package not installed. Run: npm install @sendgrid/mail');
      console.log('Email would have been sent:', emailData.subject);
      return { success: true, note: 'Package not installed, email logged' };
    }
    throw error;
  }
}

// AWS SES integration
async function sendViaSES(emailData) {
  try {
    const AWS = require('aws-sdk');
    const ses = new AWS.SES({
      region: process.env.AWS_REGION || 'eu-west-2',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const params = {
      Source: process.env.EMAIL_FROM || 'orders@girlsecretuk.com',
      Destination: { ToAddresses: [emailData.to] },
      Message: {
        Subject: { Data: emailData.subject },
        Body: {
          Text: { Data: emailData.text },
          Html: { Data: emailData.html },
        },
      },
    };

    if (emailData.replyTo) {
      params.ReplyToAddresses = [emailData.replyTo];
    }

    await ses.sendEmail(params).promise();
    return { success: true };
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('AWS SDK package not installed. Run: npm install aws-sdk');
      console.log('Email would have been sent:', emailData.subject);
      return { success: true, note: 'Package not installed, email logged' };
    }
    throw error;
  }
}

// Mailgun integration
async function sendViaMailgun(emailData) {
  try {
    const mailgun = require('mailgun-js')({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });

    const data = {
      from: process.env.EMAIL_FROM || 'orders@girlsecretuk.com',
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };

    if (emailData.replyTo) {
      data['h:Reply-To'] = emailData.replyTo;
    }

    await mailgun.messages().send(data);
    return { success: true };
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('Mailgun package not installed. Run: npm install mailgun-js');
      console.log('Email would have been sent:', emailData.subject);
      return { success: true, note: 'Package not installed, email logged' };
    }
    throw error;
  }
}

// Resend integration (modern, simple API)
async function sendViaResend(emailData) {
  try {
    const emailPayload = {
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };

    if (emailData.replyTo) {
      emailPayload.reply_to = emailData.replyTo;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // Provide specific error messages
      if (response.status === 401) {
        throw new Error('Invalid Resend API key. Check your RESEND_API_KEY environment variable.');
      } else if (response.status === 403) {
        throw new Error(`Resend: ${errorData.message || 'Domain not verified. Use onboarding@resend.dev or verify your domain.'}`);
      } else if (response.status === 422) {
        throw new Error(`Resend validation error: ${JSON.stringify(errorData)}`);
      } else {
        throw new Error(`Resend API error (${response.status}): ${errorData.message || errorData.error || 'Unknown error'}`);
      }
    }

    const result = await response.json();
    console.log('Email sent successfully via Resend:', result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Resend error details:', error);
    throw error;
  }
}

// Generate order confirmation email HTML
function generateOrderConfirmationEmail(orderData) {
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name}
        ${item.size ? `<br><small style="color: #666;">Size: ${item.size}</small>` : ''}
        ${item.color ? `<br><small style="color: #666;">Color: ${item.color}</small>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">£${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderData.orderNumber}</p>
      </div>

      <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">
          Hi ${orderData.customerName},
        </p>

        <p>
          Your order has been confirmed and will be processed shortly.
          You'll receive another email when your items have been shipped.
        </p>

        <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Order Details</h2>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="text-align: right; padding: 5px;"><strong>Subtotal:</strong></td>
            <td style="text-align: right; padding: 5px; width: 100px;">£${orderData.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="text-align: right; padding: 5px;"><strong>Shipping:</strong></td>
            <td style="text-align: right; padding: 5px;">£${orderData.shippingCost.toFixed(2)}</td>
          </tr>
          ${orderData.discount > 0 ? `
          <tr>
            <td style="text-align: right; padding: 5px; color: #28a745;"><strong>Discount:</strong></td>
            <td style="text-align: right; padding: 5px; color: #28a745;">-£${orderData.discount.toFixed(2)}</td>
          </tr>
          ` : ''}
          <tr style="border-top: 2px solid #667eea;">
            <td style="text-align: right; padding: 10px;"><strong style="font-size: 18px;">Total:</strong></td>
            <td style="text-align: right; padding: 10px;"><strong style="font-size: 18px;">£${orderData.total.toFixed(2)}</strong></td>
          </tr>
        </table>

        <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Shipping Address</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <p style="margin: 5px 0;"><strong>${orderData.shippingAddress.fullName}</strong></p>
          <p style="margin: 5px 0;">${orderData.shippingAddress.addressLine1}</p>
          ${orderData.shippingAddress.addressLine2 ? `<p style="margin: 5px 0;">${orderData.shippingAddress.addressLine2}</p>` : ''}
          <p style="margin: 5px 0;">${orderData.shippingAddress.city}, ${orderData.shippingAddress.postcode}</p>
          <p style="margin: 5px 0;">${orderData.shippingAddress.country}</p>
        </div>

        <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Track your order:</strong> Visit our website and go to
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/track-order?number=${orderData.orderNumber}" style="color: #667eea;">
              Order Tracking
            </a>
          </p>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          If you have any questions about your order, please contact us at
          <a href="mailto:support@girlsecretuk.com" style="color: #667eea;">support@girlsecretuk.com</a>
          or call us at +44 (0) 20 1234 5678.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
        <p>GirlSecret UK - Premium Lingerie & Intimate Apparel</p>
        <p>123 Fashion Street, London, W1D 1BS, United Kingdom</p>
        <p style="margin-top: 10px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}" style="color: #667eea; text-decoration: none;">Visit our website</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Order Confirmation - ${orderData.orderNumber}

Hi ${orderData.customerName},

Thank you for your order! Your order has been confirmed and will be processed shortly.

Order Details:
${orderData.items.map(item => `- ${item.name} x ${item.quantity} - £${item.price.toFixed(2)}`).join('\n')}

Subtotal: £${orderData.subtotal.toFixed(2)}
Shipping: £${orderData.shippingCost.toFixed(2)}
${orderData.discount > 0 ? `Discount: -£${orderData.discount.toFixed(2)}\n` : ''}Total: £${orderData.total.toFixed(2)}

Shipping Address:
${orderData.shippingAddress.fullName}
${orderData.shippingAddress.addressLine1}
${orderData.shippingAddress.addressLine2 ? orderData.shippingAddress.addressLine2 + '\n' : ''}${orderData.shippingAddress.city}, ${orderData.shippingAddress.postcode}
${orderData.shippingAddress.country}

Track your order: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/track-order?number=${orderData.orderNumber}

Questions? Contact us at support@girlsecretuk.com or +44 (0) 20 1234 5678

GirlSecret UK
  `;

  return { html, text };
}

// Generate order status update email
function generateOrderStatusEmail(orderData, status) {
  const statusMessages = {
    Processing: 'Your order is being processed and prepared for shipment.',
    Shipped: 'Great news! Your order has been shipped and is on its way.',
    Delivered: 'Your order has been delivered. We hope you love it!',
    Cancelled: 'Your order has been cancelled as requested.',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Order Status Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Order ${status}</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderData.orderNumber}</p>
      </div>

      <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none;">
        <p style="font-size: 16px;">
          Hi ${orderData.customerName},
        </p>

        <p style="font-size: 16px; margin: 20px 0;">
          ${statusMessages[status] || 'Your order status has been updated.'}
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #667eea; border-radius: 5px;">
          <p style="margin: 0;"><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p style="margin: 10px 0 0 0;"><strong>Status:</strong> ${status}</p>
        </div>

        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/track-order?number=${orderData.orderNumber}"
             style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Track Your Order
          </a>
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          Questions? Contact us at <a href="mailto:support@girlsecretuk.com" style="color: #667eea;">support@girlsecretuk.com</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Order ${status} - ${orderData.orderNumber}

Hi ${orderData.customerName},

${statusMessages[status] || 'Your order status has been updated.'}

Order Number: ${orderData.orderNumber}
Status: ${status}

Track your order: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/track-order?number=${orderData.orderNumber}

Questions? Contact support@girlsecretuk.com

GirlSecret UK
  `;

  return { html, text };
}

// Generate shipping notification email
function generateShippingNotificationEmail(orderData, trackingNumber, carrier) {
  const trackingUrls = {
    'Royal Mail': `https://www.royalmail.com/track-your-item#/tracking-results/${trackingNumber}`,
    'DPD': `https://www.dpd.co.uk/apps/tracking/?parcel=${trackingNumber}`,
    'Hermes': `https://www.evri.com/track-a-parcel?parcelCode=${trackingNumber}`,
    'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
  };

  const trackingUrl = trackingUrls[carrier] || '#';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your Order Has Shipped</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">📦 Your Order Has Shipped!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderData.orderNumber}</p>
      </div>

      <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none;">
        <p style="font-size: 16px;">
          Hi ${orderData.customerName},
        </p>

        <p style="font-size: 16px; margin: 20px 0;">
          Great news! Your order has been shipped and is on its way to you.
        </p>

        <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #28a745; border-radius: 5px;">
          <p style="margin: 0;"><strong>Carrier:</strong> ${carrier}</p>
          <p style="margin: 10px 0 0 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
        </div>

        <p style="text-align: center;">
          <a href="${trackingUrl}"
             style="display: inline-block; background: #28a745; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-size: 16px;">
            Track Your Package
          </a>
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #666; background: #fffbeb; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
          <strong>Note:</strong> Please allow 24 hours for tracking information to be updated by the carrier.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          Questions about your delivery? Contact us at <a href="mailto:support@girlsecretuk.com" style="color: #667eea;">support@girlsecretuk.com</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Your Order Has Shipped! - ${orderData.orderNumber}

Hi ${orderData.customerName},

Great news! Your order has been shipped and is on its way to you.

Carrier: ${carrier}
Tracking Number: ${trackingNumber}

Track your package: ${trackingUrl}

Note: Please allow 24 hours for tracking information to be updated by the carrier.

Questions? Contact support@girlsecretuk.com

GirlSecret UK
  `;

  return { html, text };
}

// Generate welcome email for newsletter subscription
function generateWelcomeEmail(firstName) {
  const greeting = firstName ? `Hi ${firstName}` : 'Hello';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to GirlSecret</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 32px;">✨ Welcome to GirlSecret!</h1>
        <p style="margin: 15px 0 0 0; font-size: 18px;">Thank you for subscribing</p>
      </div>

      <div style="background: #fff; padding: 40px; border: 1px solid #ddd; border-top: none;">
        <p style="font-size: 18px; margin-bottom: 20px;">
          ${greeting},
        </p>

        <p style="font-size: 16px;">
          Welcome to the GirlSecret community! We're thrilled to have you here.
          You've just taken the first step towards discovering premium lingerie and intimate apparel
          that celebrates your unique beauty.
        </p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0;">
          <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">What to expect:</h2>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li style="margin: 10px 0;">🎁 Exclusive offers and early access to sales</li>
            <li style="margin: 10px 0;">✨ New product launches and collections</li>
            <li style="margin: 10px 0;">💝 Style tips and seasonal inspiration</li>
            <li style="margin: 10px 0;">🎉 Special birthday surprises</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/shop"
             style="display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-size: 16px; font-weight: bold;">
            Start Shopping
          </a>
        </div>

        <div style="background: linear-gradient(to right, #fef3c7, #fde68a); padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b; margin: 30px 0;">
          <p style="margin: 0; font-size: 15px; color: #92400e;">
            <strong>Special Welcome Offer:</strong> Use code <strong style="font-size: 18px; color: #b45309;">WELCOME10</strong>
            for 10% off your first order! (Valid for 30 days)
          </p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Follow us on social media for daily inspiration:
        </p>

        <p style="font-size: 12px; color: #999; margin-top: 40px; text-align: center;">
          Not interested anymore? You can
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/unsubscribe" style="color: #667eea;">
            unsubscribe
          </a> at any time.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
        <p>GirlSecret UK - Premium Lingerie & Intimate Apparel</p>
        <p>123 Fashion Street, London, W1D 1BS, United Kingdom</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to GirlSecret! ✨

${greeting},

Welcome to the GirlSecret community! We're thrilled to have you here.

What to expect:
- Exclusive offers and early access to sales
- New product launches and collections
- Style tips and seasonal inspiration
- Special birthday surprises

SPECIAL WELCOME OFFER:
Use code WELCOME10 for 10% off your first order!
(Valid for 30 days)

Start shopping: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/shop

Not interested anymore? Unsubscribe at: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com'}/unsubscribe

GirlSecret UK
123 Fashion Street, London, W1D 1BS, United Kingdom
  `;

  return { html, text };
}

// Generate email verification email
function generateVerificationEmail(firstName, verificationToken) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecretuk.com';
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 32px;">Welcome to GirlSecret!</h1>
        <p style="margin: 15px 0 0 0; font-size: 18px;">Let's verify your email address</p>
      </div>

      <div style="background: #fff; padding: 40px; border: 1px solid #ddd; border-top: none;">
        <p style="font-size: 18px; margin-bottom: 20px;">
          Hi ${firstName},
        </p>

        <p style="font-size: 16px;">
          Thank you for creating an account with GirlSecret UK! We're excited to have you join our community.
        </p>

        <p style="font-size: 16px;">
          To complete your registration and access all features, please verify your email address by clicking the button below:
        </p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationUrl}"
             style="display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-size: 16px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin: 30px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Alternative:</strong> If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="margin: 10px 0 0 0; font-size: 13px; word-break: break-all;">
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
        </div>

        <div style="background: #fffbeb; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b; margin: 30px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Note:</strong> This verification link will expire in 24 hours for security reasons.
          </p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          If you didn't create an account with GirlSecret UK, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
        <p>GirlSecret UK - Premium Lingerie & Intimate Apparel</p>
        <p>123 Fashion Street, London, W1D 1BS, United Kingdom</p>
        <p style="margin-top: 10px;">
          <a href="${baseUrl}" style="color: #667eea; text-decoration: none;">Visit our website</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to GirlSecret! - Verify Your Email

Hi ${firstName},

Thank you for creating an account with GirlSecret UK! We're excited to have you join our community.

To complete your registration and access all features, please verify your email address by visiting this link:

${verificationUrl}

Note: This verification link will expire in 24 hours for security reasons.

If you didn't create an account with GirlSecret UK, you can safely ignore this email.

GirlSecret UK
123 Fashion Street, London, W1D 1BS, United Kingdom
${baseUrl}
  `;

  return { html, text };
}

// Generate contact form email
function generateContactEmail(contactData) {
  const { name, email, subject, message } = contactData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">📧 New Contact Form Submission</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">From: ${name}</p>
      </div>

      <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">Contact Information</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
          <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
        </div>

        <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Message</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 15px;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Quick Reply:</strong> Simply reply to this email to respond directly to ${name}.
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
             style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
            Reply to ${name}
          </a>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
        <p>GirlSecret UK - Customer Support</p>
        <p>This email was sent from the contact form on your website</p>
      </div>
    </body>
    </html>
  `;

  const text = `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Reply to this email to respond directly to ${name}.
GirlSecret UK - Customer Support
  `;

  return { html, text };
}
