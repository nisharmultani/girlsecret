import { getUserOrders, createOrder } from '../../../lib/airtable';

export default async function handler(req, res) {
  // GET - Fetch user orders
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const orders = await getUserOrders(userId);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error('Fetch orders error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // POST - Create new order
  else if (req.method === 'POST') {
    try {
      const { userId, orderData } = req.body;

      if (!userId || !orderData) {
        return res.status(400).json({ error: 'User ID and order data are required' });
      }

      // Validate required order fields
      if (!orderData.items || !orderData.total || !orderData.shippingAddress) {
        return res.status(400).json({ error: 'Missing required order fields' });
      }

      const result = await createOrder(userId, orderData);

      if (!result.success) {
        return res.status(500).json({ error: result.error || 'Failed to create order' });
      }

      res.status(201).json({
        success: true,
        order: result.order,
        message: 'Order created successfully',
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
