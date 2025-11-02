import { addToWishlist } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    const result = await addToWishlist(userId, productId);


    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to add to wishlist' });
    }

    return res.status(200).json({
      success: true,
      message: result.message || 'Added to wishlist'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
