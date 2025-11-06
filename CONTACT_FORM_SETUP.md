# Contact Form Setup Guide

## Overview

The contact form is now fully functional and will:
- ✅ Send email notifications to your support team
- ✅ Store all submissions in Airtable for record-keeping
- ✅ Support Reply-To functionality (you can reply directly from your email)
- ✅ Validate all inputs to prevent abuse
- ✅ Show success/error messages to customers

---

## 🗄️ Airtable Setup (Required)

### Create ContactMessages Table

1. Go to your Airtable base (same base as Products, Users, etc.)
2. Create a new table named **`ContactMessages`**
3. Add the following fields:

| Field Name | Field Type | Description | Required |
|------------|------------|-------------|----------|
| `Name` | Single line text | Customer's name | Yes |
| `Email` | Email | Customer's email address | Yes |
| `Subject` | Single line text | Message subject | Yes |
| `Message` | Long text | Message content | Yes |
| `SubmittedAt` | Date & time | When the message was submitted | Yes |
| `Status` | Single select | Message status | Yes |

### Field Configuration Details

**Status Field (Single select):**
Add these options:
- `New` (default)
- `Read`
- `Replied`
- `Resolved`

**SubmittedAt Field:**
- Type: Date & time
- Include time: Yes
- GMT: Yes
- Format: ISO

### Optional: Add Views

Create these views in Airtable for easier management:

1. **New Messages** - Filter: `{Status} = "New"`
2. **All Messages** - No filter, sorted by SubmittedAt (newest first)
3. **Resolved** - Filter: `{Status} = "Resolved"`

---

## 📧 Email Configuration

### Option 1: Development Mode (Default)

By default, emails are logged to the console. This is perfect for testing:

```bash
# In your terminal, you'll see:
========== EMAIL (Development Mode) ==========
To: support@girlsecretuk.com
Subject: Contact Form: Question about shipping
Reply-To: customer@example.com
Content: [message text]
==============================================
```

### Option 2: Production Email Service

To actually send emails, configure one of these services:

#### Using Resend (Recommended - Easiest)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env`:
```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=support@girlsecretuk.com
```

#### Using SendGrid

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=support@girlsecretuk.com
```

#### Using AWS SES

```env
EMAIL_SERVICE=ses
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=support@girlsecretuk.com
```

#### Using Mailgun

```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=xxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=support@girlsecretuk.com
```

---

## 🧪 Testing the Contact Form

### 1. Test Locally

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/contact
# Fill out the form and submit
# Check your terminal for the email log
# Check your Airtable for the new record
```

### 2. Test Validation

Try these to test error handling:
- Submit without filling all fields
- Enter invalid email format
- Enter very short message (< 10 characters)
- Enter very long message (> 5000 characters)

### 3. Test Email Sending (Production)

Once you've configured an email service:
1. Set `EMAIL_SERVICE` in your `.env`
2. Restart your dev server
3. Submit the contact form
4. Check your `CONTACT_EMAIL` inbox for the notification

---

## 📋 How It Works

### Customer Journey

1. Customer visits `/contact` page
2. Fills out form (Name, Email, Subject, Message)
3. Clicks "Send Message"
4. Form validates inputs
5. Sends to `/api/contact` endpoint
6. API:
   - Validates data again (server-side)
   - Stores in Airtable `ContactMessages` table
   - Sends email to `CONTACT_EMAIL`
   - Includes `Reply-To` header with customer's email
7. Customer sees success message

### Support Team Workflow

1. Receive email notification at `CONTACT_EMAIL`
2. Email contains:
   - Customer's name and email
   - Subject line
   - Full message
   - "Reply to [Name]" button
3. Simply reply to the email to respond to customer
4. Update status in Airtable:
   - Mark as "Read" when viewed
   - Mark as "Replied" when you respond
   - Mark as "Resolved" when complete

---

## 🔒 Security Features

### Input Validation
- ✅ All fields required
- ✅ Email format validation (client & server)
- ✅ Message length limits (10-5000 characters)
- ✅ XSS protection via sanitization

### Rate Limiting
**TODO:** Add rate limiting to prevent spam
- Recommended: Max 3 submissions per IP per hour
- Use middleware like `express-rate-limit` or similar

### Spam Prevention
Consider adding:
- Google reCAPTCHA v3
- Honeypot field
- Time-based submission tracking

---

## 🎨 Customization

### Change Email Template

Edit `/lib/email.js` → `generateContactEmail()` function to customize:
- Email colors
- Layout
- Logo
- Footer text

### Change Notification Recipient

Update `.env`:
```env
CONTACT_EMAIL=your-new-email@example.com
```

### Add Auto-Reply to Customer

Add this to `/pages/api/contact.js`:

```javascript
// After sending to support team, send confirmation to customer
await sendEmail({
  to: contactData.email,
  subject: 'We received your message',
  html: generateCustomerConfirmationEmail(contactData),
  text: 'Thank you for contacting us...',
});
```

---

## 🛠️ API Endpoints

### POST /api/contact

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about products",
  "message": "Hello, I have a question..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully..."
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message here"
}
```

---

## 📊 Admin Dashboard (Optional Enhancement)

You can create an admin page to view contact messages:

**File:** `/pages/admin/contact-messages.js`

```javascript
import { useEffect, useState } from 'react';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch from /api/admin/contact-messages
    fetchMessages();
  }, []);

  return (
    <div>
      <h1>Contact Messages</h1>
      {messages.map(msg => (
        <div key={msg.id}>
          <h3>{msg.subject}</h3>
          <p>From: {msg.name} ({msg.email})</p>
          <p>{msg.message}</p>
          <p>Status: {msg.status}</p>
        </div>
      ))}
    </div>
  );
}
```

**API:** Create `/pages/api/admin/contact-messages.js`:
```javascript
import { getContactMessages } from '../../../lib/airtable';

export default async function handler(req, res) {
  // TODO: Add admin authentication check

  if (req.method === 'GET') {
    const messages = await getContactMessages();
    return res.status(200).json({ messages });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

---

## 🐛 Troubleshooting

### Contact form doesn't submit

**Check:**
1. Browser console for errors
2. Network tab - is `/api/contact` returning 200?
3. Server console for API errors
4. Airtable credentials in `.env`

### Emails not sending

**Check:**
1. `EMAIL_SERVICE` is set correctly
2. API keys are valid and not expired
3. Email provider dashboard for errors
4. Server console for error messages
5. FROM email is verified (required by most providers)

### Message not saved to Airtable

**Check:**
1. `ContactMessages` table exists (case-sensitive)
2. All required fields exist in table
3. Airtable API key has write permissions
4. Server console for Airtable errors

### Reply-To not working

**Check:**
1. Email provider supports Reply-To headers
2. Customer email is valid
3. Not marked as spam (check spam folder)

---

## 📝 Environment Variables Summary

Add these to your `.env` file:

```env
# Required for Airtable storage
NEXT_PUBLIC_AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
NEXT_PUBLIC_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# Required for sending emails (choose one)
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email addresses
EMAIL_FROM=noreply@yourdomain.com
CONTACT_EMAIL=support@girlsecretuk.com

# Optional: Set NODE_ENV=production to enable actual email sending
NODE_ENV=development
```

---

## ✅ Checklist

Before going live:

- [ ] Create `ContactMessages` table in Airtable
- [ ] Add all required fields to the table
- [ ] Configure email service (Resend, SendGrid, etc.)
- [ ] Set `CONTACT_EMAIL` to your support inbox
- [ ] Verify `EMAIL_FROM` is authenticated with provider
- [ ] Test form submission locally
- [ ] Test email delivery
- [ ] Test Reply-To functionality
- [ ] Add rate limiting (optional but recommended)
- [ ] Add reCAPTCHA (optional but recommended)
- [ ] Create admin view in Airtable
- [ ] Train support team on workflow

---

## 🎉 Success!

Your contact form is now fully functional! Customers can reach you directly from your website, and all messages are properly tracked and delivered.

**Support:**
- Check `/lib/email.js` for email template customization
- Check `/pages/api/contact.js` for API logic
- Check `/lib/airtable.js` for database functions
- Check `/pages/contact.jsx` for frontend form

**Next Steps:**
1. Configure your email service
2. Set up the Airtable table
3. Test the form
4. Monitor incoming messages
5. Consider adding spam protection

Happy connecting with your customers! 📧
