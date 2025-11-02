import { getUserWishlist, getWishlistProductIds } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, idsOnly } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if only IDs are requested (for quick checks)
    if (idsOnly === 'true') {
      const productIds = await getWishlistProductIds(userId);
      return res.status(200).json({ success: true, productIds });
    }

    // Fetch full wishlist with product details
    const wishlist = await getUserWishlist(userId);

    return res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
