const Airtable = require('airtable');

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

const PRODUCTS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || 'Products';
const REVIEWS_TABLE = 'Reviews';
const PROMO_CODES_TABLE = 'PromoCodes';
const REFERRALS_TABLE = 'Referrals';

// Fetch all products
export async function getAllProducts() {
  try {
    const records = await base(PRODUCTS_TABLE)
      .select({
        view: 'Grid view',
      })
      .all();

    return records.map(record => {
      const name = record.get('Name') || 'Untitled Product';
      return {
        id: record.id,
        name: name,
        description: record.get('Description') || '',
        price: record.get('Price') || 0,
        salePrice: record.get('SalePrice') || null,
        category: record.get('Category') || 'Uncategorized',
        images: record.get('Images') || [],
        inStock: record.get('InStock') !== false,
        featured: record.get('Featured') === true,
        keywords: record.get('Keywords') || '',
        slug: record.get('Slug') || name.toLowerCase().replace(/\s+/g, '-'),
        sizes: record.get('Sizes') || [],
        colors: record.get('Colors') || [],
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch single product by ID
export async function getProductById(id) {
  try {
    const record = await base(PRODUCTS_TABLE).find(id);
    const name = record.get('Name') || 'Untitled Product';
    return {
      id: record.id,
      name: name,
      description: record.get('Description') || '',
      price: record.get('Price') || 0,
      salePrice: record.get('SalePrice') || null,
      category: record.get('Category') || 'Uncategorized',
      images: record.get('Images') || [],
      inStock: record.get('InStock') !== false,
      featured: record.get('Featured') === true,
      keywords: record.get('Keywords') || '',
      slug: record.get('Slug') || name.toLowerCase().replace(/\s+/g, '-'),
      sizes: record.get('Sizes') || [],
      colors: record.get('Colors') || [],
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Fetch product by slug
export async function getProductBySlug(slug) {
  try {
    const records = await base(PRODUCTS_TABLE)
      .select({
        filterByFormula: `{Slug} = '${slug}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const name = record.get('Name') || 'Untitled Product';
    return {
      id: record.id,
      name: name,
      description: record.get('Description') || '',
      price: record.get('Price') || 0,
      salePrice: record.get('SalePrice') || null,
      category: record.get('Category') || 'Uncategorized',
      images: record.get('Images') || [],
      inStock: record.get('InStock') !== false,
      featured: record.get('Featured') === true,
      keywords: record.get('Keywords') || '',
      slug: record.get('Slug') || slug,
      sizes: record.get('Sizes') || [],
      colors: record.get('Colors') || [],
    };
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// Validate promo code
export async function validatePromoCode(code) {
  try {
    const records = await base(PROMO_CODES_TABLE)
      .select({
        filterByFormula: `AND({Code} = '${code.toUpperCase()}', {Active} = TRUE())`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const expiryDate = record.get('ExpiryDate');

    if (expiryDate && new Date(expiryDate) < new Date()) {
      return null;
    }

    return {
      id: record.id,
      code: record.get('Code'),
      discountType: record.get('DiscountType'), // 'percentage' or 'fixed'
      discountValue: record.get('DiscountValue'),
      minPurchase: record.get('MinPurchase') || 0,
      maxDiscount: record.get('MaxDiscount'),
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return null;
  }
}

// Create referral
export async function createReferral(referrerEmail, referredEmail) {
  try {
    const record = await base(REFERRALS_TABLE).create({
      ReferrerEmail: referrerEmail,
      ReferredEmail: referredEmail,
      CreatedAt: new Date().toISOString(),
      Status: 'Pending',
    });

    return {
      id: record.id,
      success: true,
    };
  } catch (error) {
    console.error('Error creating referral:', error);
    return { success: false };
  }
}

// Get product reviews
export async function getProductReviews(productId) {
  try {
    const records = await base(REVIEWS_TABLE)
      .select({
        filterByFormula: `AND({ProductId} = '${productId}', {Approved} = TRUE())`,
        sort: [{ field: 'CreatedAt', direction: 'desc' }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      productId: record.get('ProductId'),
      name: record.get('Name'),
      email: record.get('Email'),
      rating: record.get('Rating'),
      comment: record.get('Comment'),
      createdAt: record.get('CreatedAt'),
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// Submit product review
export async function submitReview(productId, name, email, rating, comment) {
  try {
    const record = await base(REVIEWS_TABLE).create({
      ProductId: productId,
      Name: name,
      Email: email,
      Rating: rating,
      Comment: comment,
      CreatedAt: new Date().toISOString(),
      Approved: false, // Reviews need approval
    });

    return {
      id: record.id,
      success: true,
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false };
  }
}

export default {
  getAllProducts,
  getProductById,
  getProductBySlug,
  validatePromoCode,
  createReferral,
  getProductReviews,
  submitReview,
};
