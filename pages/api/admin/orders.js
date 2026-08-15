import { getAllOrders } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Add admin authentication check here
    // For now, allowing access - you should verify the user is an admin

    const orders = await getAllOrders();

    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
