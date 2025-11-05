import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
);

const PRODUCTS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || 'Products';
const WISHLISTS_TABLE = 'Wishlists';
const REVIEWS_TABLE = 'Reviews';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Add admin authentication check here
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // First, clean up related data (wishlists and reviews)
    try {
      // Delete wishlist entries for this product
      const wishlistRecords = await base(WISHLISTS_TABLE)
        .select({
          filterByFormula: `FIND('${productId}', ARRAYJOIN({ProductId}))`
        })
        .all();

      if (wishlistRecords.length > 0) {
        const wishlistIds = wishlistRecords.map(record => record.id);
        // Delete in batches of 10 (Airtable limit)
        for (let i = 0; i < wishlistIds.length; i += 10) {
          const batch = wishlistIds.slice(i, i + 10);
          await base(WISHLISTS_TABLE).destroy(batch);
        }
        console.log(`Deleted ${wishlistIds.length} wishlist entries for product ${productId}`);
      }

      // Delete reviews for this product
      const reviewRecords = await base(REVIEWS_TABLE)
        .select({
          filterByFormula: `FIND('${productId}', ARRAYJOIN({ProductId}))`
        })
        .all();

      if (reviewRecords.length > 0) {
        const reviewIds = reviewRecords.map(record => record.id);
        // Delete in batches of 10
        for (let i = 0; i < reviewIds.length; i += 10) {
          const batch = reviewIds.slice(i, i + 10);
          await base(REVIEWS_TABLE).destroy(batch);
        }
        console.log(`Deleted ${reviewIds.length} reviews for product ${productId}`);
      }
    } catch (cleanupError) {
      console.warn('Error cleaning up related data:', cleanupError);
      // Continue with product deletion even if cleanup fails
    }

    // Delete the product record from Airtable
    await base(PRODUCTS_TABLE).destroy(productId);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
}
