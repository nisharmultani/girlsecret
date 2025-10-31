import { getOrderByNumber } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderNumber } = req.query;

    if (!orderNumber) {
      return res.status(400).json({ error: 'Order number is required' });
    }

    // Find order by order number
    const order = await getOrderByNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found. Please check your order number.',
      });
    }

    // Add tracking URL if carrier and tracking number exist
    if (order.carrier && order.trackingNumber) {
      const trackingUrls = {
        'Royal Mail': `https://www.royalmail.com/track-your-item#/tracking-results/${order.trackingNumber}`,
        'DPD': `https://www.dpd.co.uk/apps/tracking/?parcel=${order.trackingNumber}`,
        'Hermes': `https://www.evri.com/track-a-parcel?parcelCode=${order.trackingNumber}`,
        'Evri': `https://www.evri.com/track-a-parcel?parcelCode=${order.trackingNumber}`,
        'UPS': `https://www.ups.com/track?tracknum=${order.trackingNumber}`,
        'FedEx': `https://www.fedex.com/fedextrack/?tracknumbers=${order.trackingNumber}`,
      };

      order.trackingUrl = trackingUrls[order.carrier] || null;
    }

    return res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error('Track order error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
