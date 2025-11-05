import Airtable from 'airtable';
import { sendEmail } from '../../../../lib/email';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
);

const ORDERS_TABLE = 'Orders';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Add admin authentication check here
    const { orderId, status, trackingNumber, carrier, aliexpressStatus, notes } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Prepare update data
    const updateData = {
      UpdatedAt: new Date().toISOString()
    };

    if (status) updateData.Status = status;
    if (trackingNumber) updateData.TrackingNumber = trackingNumber;
    if (carrier) updateData.Carrier = carrier;
    if (aliexpressStatus) updateData.AliExpressStatus = aliexpressStatus;
    if (notes) updateData.Notes = notes;

    // Update order in Airtable
    const record = await base(ORDERS_TABLE).update(orderId, updateData);

    // Get full order details for email
    const orderData = {
      OrderNumber: record.get('OrderNumber'),
      CustomerName: record.get('CustomerName'),
      CustomerEmail: record.get('CustomerEmail'),
      Status: record.get('Status'),
      TrackingNumber: record.get('TrackingNumber'),
      Carrier: record.get('Carrier'),
      AliExpressStatus: record.get('AliExpressStatus'),
      Total: record.get('Total'),
      Items: record.get('Items')
    };

    // Send notification email to customer
    await sendOrderUpdateEmail(orderData);

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: orderData
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Failed to update order' });
  }
}

async function sendOrderUpdateEmail(order) {
  const { CustomerEmail, CustomerName, OrderNumber, Status, TrackingNumber, Carrier, AliExpressStatus } = order;

  let statusMessage = '';
  let subject = '';

  switch (Status) {
    case 'Processing':
      subject = `Your Order ${OrderNumber} is Being Processed`;
      statusMessage = 'We are currently processing your order and preparing it for shipment.';
      break;
    case 'Shipped':
      subject = `Your Order ${OrderNumber} Has Been Shipped!`;
      statusMessage = 'Great news! Your order has been shipped and is on its way to you.';
      break;
    case 'Delivered':
      subject = `Your Order ${OrderNumber} Has Been Delivered`;
      statusMessage = 'Your order has been delivered. We hope you love your purchase!';
      break;
    case 'Cancelled':
      subject = `Your Order ${OrderNumber} Has Been Cancelled`;
      statusMessage = 'Your order has been cancelled. If you have any questions, please contact our support team.';
      break;
    default:
      subject = `Update on Your Order ${OrderNumber}`;
      statusMessage = `Your order status has been updated to: ${Status}`;
  }

  const trackingInfo = TrackingNumber
    ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0; color: #374151;">Tracking Information</h3>
        <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${TrackingNumber}</p>
        <p style="margin: 5px 0;"><strong>Carrier:</strong> ${Carrier || 'N/A'}</p>
      </div>
    `
    : '';

  const aliexpressInfo = AliExpressStatus
    ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
        <p style="margin: 0;"><strong>AliExpress Status:</strong> ${AliExpressStatus}</p>
      </div>
    `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #db2777; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">GirlSecret</h1>
      </div>

      <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #111827; margin-top: 0;">Order Update</h2>

        <p>Hi ${CustomerName},</p>

        <p>${statusMessage}</p>

        <div style="margin: 20px 0; padding: 15px; background-color: #fce7f3; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #9d174d;">Order Details</h3>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${OrderNumber}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #db2777; font-weight: bold;">${Status}</span></p>
        </div>

        ${trackingInfo}
        ${aliexpressInfo}

        <p style="margin-top: 30px;">
          You can track your order anytime by visiting our
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://girlsecret.com'}/track-order"
             style="color: #db2777; text-decoration: none; font-weight: bold;">order tracking page</a>.
        </p>

        <p>If you have any questions, please don't hesitate to contact us.</p>

        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The GirlSecret Team</strong>
        </p>
      </div>

      <div style="margin-top: 20px; padding: 20px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          © ${new Date().getFullYear()} GirlSecret. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      to: CustomerEmail,
      subject,
      html
    });
    console.log(`Order update email sent to ${CustomerEmail}`);
  } catch (error) {
    console.error('Error sending order update email:', error);
    // Don't throw error - order was still updated successfully
  }
}
