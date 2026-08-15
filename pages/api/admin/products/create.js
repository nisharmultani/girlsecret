import { createProduct } from '../../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Add admin authentication check here
    const {
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

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one product image is required' });
    }

    const result = await createProduct({
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
      videoUrls,
    });

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to create product', details: result.error });
    }

    return res.status(200).json({
      success: true,
      message: 'Product created successfully',
      product: result.product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
}
