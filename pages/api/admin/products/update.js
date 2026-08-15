import { updateProduct } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Add admin authentication check here
    const {
      productId,
      name,
      description,
      specifications,
      price,
      salePrice,
      category,
      slug,
      sizes,
      inStock,
      featured,
      soldCount,
      images,
      availableProductImages,
      videoUrls
    } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const result = await updateProduct(productId, {
      name,
      description,
      specifications,
      price,
      category,
      slug,
      inStock,
      featured,
      salePrice,
      sizes,
      soldCount,
      videoUrls,
      images,
      availableProductImages,
    });

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to update product', details: result.error });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: result.product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
}
