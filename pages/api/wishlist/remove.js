import { removeFromWishlist } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    const result = await removeFromWishlist(userId, productId);

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Failed to remove from wishlist' });
    }

    return res.status(200).json({
      success: true,
      message: result.message || 'Removed from wishlist'
    });
  } catch (error) {
    console.error('Wishlist remove error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
