import { getOrderByNumber, updateOrderStatus, updateOrderTracking } from '../../../lib/airtable';
import { sendOrderStatusEmail, sendShippingNotificationEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderNumber, status, trackingNumber, carrier } = req.body;

    // Basic validation
    if (!orderNumber) {
      return res.status(400).json({ error: 'Order number is required' });
    }

    // Find the order
    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If tracking info is provided, update tracking and set status to Shipped
    if (trackingNumber && carrier) {
      const result = await updateOrderTracking(order.id, trackingNumber, carrier);

      if (!result.success) {
        return res.status(500).json({ error: 'Failed to update tracking' });
      }

      // Send shipping notification email
      try {
        await sendShippingNotificationEmail(
          {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
          },
          order.customerEmail,
          trackingNumber,
          carrier
        );
      } catch (emailError) {
        console.error('Failed to send shipping notification:', emailError);
      }

      return res.status(200).json({
        success: true,
        message: 'Order tracking updated and notification sent',
      });
    }

    // If only status is provided, update status
    if (status) {
      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }

      const result = await updateOrderStatus(order.id, status);

      if (!result.success) {
        return res.status(500).json({ error: 'Failed to update status' });
      }

      // Send status update email
      try {
        await sendOrderStatusEmail(
          {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
          },
          order.customerEmail,
          status
        );
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }

      return res.status(200).json({
        success: true,
        message: 'Order status updated and notification sent',
      });
    }

    return res.status(400).json({
      error: 'Either status or tracking information (trackingNumber + carrier) is required',
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
