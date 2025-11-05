import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(
  process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
);

const PRODUCTS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || 'Products';

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

    // Prepare update data
    const updateData = {};

    if (name) updateData.Name = name;
    if (description !== undefined) updateData.Description = description;
    if (specifications !== undefined) updateData.Specifications = specifications;
    if (price) updateData.Price = parseFloat(price);
    if (category) updateData.Category = category;
    if (slug) updateData.Slug = slug;
    if (inStock !== undefined) updateData.InStock = inStock;
    if (featured !== undefined) updateData.Featured = featured;

    // Handle sale price - can be null to remove it
    if (salePrice !== undefined) {
      updateData.SalePrice = salePrice ? parseFloat(salePrice) : null;
    }

    // Handle sizes array
    if (sizes !== undefined) updateData.Sizes = sizes;

    // Handle sold count
    if (soldCount !== undefined) updateData.SoldCount = parseInt(soldCount) || 0;

    // Handle video URLs
    if (videoUrls !== undefined) {
      if (videoUrls.length > 0) {
        updateData.VideoUrls = videoUrls;
      } else {
        updateData.VideoUrls = [];
      }
    }

    // Handle main images - convert URLs to Airtable attachment format
    if (images !== undefined) {
      if (images.length > 0) {
        updateData.Images = images.map(url => ({ url }));
      } else {
        updateData.Images = [];
      }
    }

    // Handle available product images (variants) - convert URLs to Airtable attachment format
    if (availableProductImages !== undefined) {
      if (availableProductImages.length > 0) {
        updateData.Available_Products = availableProductImages.map(url => ({ url }));
      } else {
        updateData.Available_Products = [];
      }
    }

    // Update record in Airtable
    const record = await base(PRODUCTS_TABLE).update(productId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: {
        id: record.id,
        name: record.get('Name')
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
}
