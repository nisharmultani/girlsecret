import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
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
      price,
      salePrice,
      category,
      slug,
      sizes,
      colors,
      inStock,
      featured,
      keywords,
      images
    } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Prepare update data
    const updateData = {};

    if (name) updateData.Name = name;
    if (description !== undefined) updateData.Description = description;
    if (price) updateData.Price = parseFloat(price);
    if (category) updateData.Category = category;
    if (slug) updateData.Slug = slug;
    if (inStock !== undefined) updateData.InStock = inStock;
    if (featured !== undefined) updateData.Featured = featured;

    // Handle sale price - can be null to remove it
    if (salePrice !== undefined) {
      updateData.SalePrice = salePrice ? parseFloat(salePrice) : null;
    }

    // Handle arrays
    if (sizes !== undefined) updateData.Sizes = sizes;
    if (colors !== undefined) updateData.Colors = colors;
    if (keywords !== undefined) updateData.Keywords = keywords;

    // Handle images
    if (images !== undefined) {
      if (images.length > 0) {
        updateData.Images = images.map(url => ({ url }));
      } else {
        updateData.Images = [];
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
