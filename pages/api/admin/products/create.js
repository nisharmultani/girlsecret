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
      name,
      description,
      price,
      salePrice,
      category,
      slug,
      sizes,
      inStock,
      featured,
      soldCount,
      images,
      availableProductImages
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one product image is required' });
    }

    // Prepare product data for Airtable
    const productData = {
      Name: name,
      Description: description || '',
      Price: parseFloat(price),
      Category: category,
      Slug: slug,
      InStock: inStock !== false,
      Featured: featured === true,
    };

    // Add optional fields
    if (salePrice) productData.SalePrice = parseFloat(salePrice);
    if (sizes && sizes.length > 0) productData.Sizes = sizes;
    if (soldCount !== undefined) productData.SoldCount = parseInt(soldCount) || 0;

    // For main images, convert URLs to Airtable attachment format
    if (images && images.length > 0) {
      productData.Images = images.map(url => ({ url }));
    }

    // For available product images (variants), convert URLs to Airtable attachment format
    if (availableProductImages && availableProductImages.length > 0) {
      productData.Available_Products = availableProductImages.map(url => ({ url }));
    }

    // Create record in Airtable
    const record = await base(PRODUCTS_TABLE).create(productData);

    return res.status(200).json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: record.id,
        name: record.get('Name')
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
}
