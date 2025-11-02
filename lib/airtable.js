const Airtable = require('airtable');

const PRODUCTS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || 'Products';
const REVIEWS_TABLE = 'Reviews';
const PROMO_CODES_TABLE = 'PromoCodes';
const REFERRALS_TABLE = 'Referrals';
const USERS_TABLE = 'Users';
const ORDERS_TABLE = 'Orders';
const ADDRESSES_TABLE = 'Addresses';
const WISHLISTS_TABLE = 'Wishlists';

// Lazy initialization of Airtable base
let baseInstance = null;
function getBase() {
  if (!baseInstance) {
    const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
    const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      // Return null to allow graceful degradation during build
      return null;
    }

    baseInstance = new Airtable({ apiKey }).base(baseId);
  }
  return baseInstance;
}

// Fetch all products
export async function getAllProducts() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured, returning empty products array');
      return [];
    }

    const records = await base(PRODUCTS_TABLE)
      .select({
        view: 'Grid view',
      })
      .all();

    return records.map(record => {
      const name = record.get('Name') || 'Untitled Product';
      const keywords = record.get('Keywords');

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
        keywords: keywords || '', // Keep as-is (can be string or array)
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
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }

    const record = await base(PRODUCTS_TABLE).find(id);
    const name = record.get('Name') || 'Untitled Product';
    const keywords = record.get('Keywords');

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
      keywords: keywords || '', // Keep as-is (can be string or array)
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
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }

    const records = await base(PRODUCTS_TABLE)
      .select({
        filterByFormula: `{Slug} = '${slug}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const name = record.get('Name') || 'Untitled Product';
    const keywords = record.get('Keywords');

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
      keywords: keywords || '', // Keep as-is (can be string or array)
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
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }

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
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    const record = await base(REFERRALS_TABLE).create({
      ReferrerEmail: referrerEmail,
      ReferredEmail: referredEmail,
      Created_At: new Date().toISOString(),
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
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }

    const records = await base(REVIEWS_TABLE)
      .select({
        filterByFormula: `AND({ProductId} = '${productId}', {Approved} = TRUE())`,
        sort: [{ field: 'Created_At', direction: 'desc' }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      productId: record.get('ProductId'),
      name: record.get('Name'),
      email: record.get('Email'),
      rating: record.get('Rating'),
      comment: record.get('Comment'),
      created_At: record.get('Created_At'),
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// Submit product review
export async function submitReview(productId, name, email, rating, comment) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    const record = await base(REVIEWS_TABLE).create({
      ProductId: productId,
      Name: name,
      Email: email,
      Rating: rating,
      Comment: comment,
      Created_At: new Date().toISOString(),
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

// === USER MANAGEMENT ===

// Create user
export async function createUser(email, passwordHash, firstName, lastName, phone = '') {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false, error: 'Database not configured' };
    }

    const record = await base(USERS_TABLE).create({
      Email: email.toLowerCase(),
      PasswordHash: passwordHash,
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      CreatedAt: new Date().toISOString(),
      Active: true,
    });

    return {
      success: true,
      user: {
        id: record.id,
        email: record.get('Email'),
        firstName: record.get('FirstName'),
        lastName: record.get('LastName'),
        phone: record.get('Phone'),
      },
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

// Find user by email
export async function findUserByEmail(email) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }

    const records = await base(USERS_TABLE)
      .select({
        filterByFormula: `{Email} = '${email.toLowerCase()}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      email: record.get('Email'),
      passwordHash: record.get('PasswordHash'),
      firstName: record.get('FirstName'),
      lastName: record.get('LastName'),
      phone: record.get('Phone'),
      active: record.get('Active'),
    };
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(userId, updates) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    const updateFields = {};
    if (updates.firstName) updateFields.FirstName = updates.firstName;
    if (updates.lastName) updateFields.LastName = updates.lastName;
    if (updates.phone !== undefined) updateFields.Phone = updates.phone;

    await base(USERS_TABLE).update(userId, updateFields);

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
}

// Store password reset token
export async function storeResetToken(userId, token, expiry) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    await base(USERS_TABLE).update(userId, {
      ResetToken: token,
      ResetTokenExpiry: expiry,
    });

    return { success: true };
  } catch (error) {
    console.error('Error storing reset token:', error);
    return { success: false, error: error.message };
  }
}

// Find user by reset token
export async function findUserByResetToken(token) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }

    const records = await base(USERS_TABLE)
      .select({
        filterByFormula: `{ResetToken} = '${token}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const expiry = record.get('ResetTokenExpiry');

    // Check if token is expired
    if (expiry && new Date(expiry) < new Date()) {
      return null;
    }

    return {
      id: record.id,
      email: record.get('Email'),
      firstName: record.get('FirstName'),
      lastName: record.get('LastName'),
    };
  } catch (error) {
    console.error('Error finding user by reset token:', error);
    return null;
  }
}

// Update user password
export async function updateUserPassword(userId, newPasswordHash) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    await base(USERS_TABLE).update(userId, {
      PasswordHash: newPasswordHash,
      ResetToken: '',
      ResetTokenExpiry: '',
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error: error.message };
  }
}

// === ORDER MANAGEMENT ===

// Create order
export async function createOrder(userId, orderData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const record = await base(ORDERS_TABLE).create({
      UserId: userId,
      OrderNumber: orderNumber,
      Items: JSON.stringify(orderData.items),
      Subtotal: orderData.subtotal,
      ShippingCost: orderData.shippingCost,
      Discount: orderData.discount || 0,
      Total: orderData.total,
      Status: 'Pending',
      CustomerName: orderData.customerName,
      CustomerEmail: orderData.customerEmail,
      ShippingAddress: JSON.stringify(orderData.shippingAddress),
      BillingAddress: JSON.stringify(orderData.billingAddress),
      PromoCode: orderData.promoCode || '',
      CreatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      order: {
        id: record.id,
        orderNumber: orderNumber,
      },
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}

// Get user orders
export async function getUserOrders(userId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }

    const records = await base(ORDERS_TABLE)
      .select({
        filterByFormula: `{UserId} = '${userId}'`,
        sort: [{ field: 'CreatedAt', direction: 'desc' }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      orderNumber: record.get('OrderNumber'),
      items: JSON.parse(record.get('Items') || '[]'),
      subtotal: record.get('Subtotal'),
      shippingCost: record.get('ShippingCost'),
      discount: record.get('Discount'),
      total: record.get('Total'),
      status: record.get('Status'),
      createdAt: record.get('CreatedAt'),
      shippingAddress: JSON.parse(record.get('ShippingAddress') || '{}'),
      trackingNumber: record.get('TrackingNumber') || null,
      carrier: record.get('Carrier') || null,
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }

    const records = await base(ORDERS_TABLE)
      .select({
        filterByFormula: `{OrderNumber} = '${orderNumber}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      orderNumber: record.get('OrderNumber'),
      items: JSON.parse(record.get('Items') || '[]'),
      subtotal: record.get('Subtotal'),
      shippingCost: record.get('ShippingCost'),
      discount: record.get('Discount'),
      total: record.get('Total'),
      status: record.get('Status'),
      customerName: record.get('CustomerName'),
      customerEmail: record.get('CustomerEmail'),
      createdAt: record.get('CreatedAt'),
      shippingAddress: JSON.parse(record.get('ShippingAddress') || '{}'),
      billingAddress: JSON.parse(record.get('BillingAddress') || '{}'),
      trackingNumber: record.get('TrackingNumber') || null,
      carrier: record.get('Carrier') || null,
    };
  } catch (error) {
    console.error('Error finding order by number:', error);
    return null;
  }
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    await base(ORDERS_TABLE).update(orderId, {
      Status: status,
      UpdatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

// Update order tracking
export async function updateOrderTracking(orderId, trackingNumber, carrier) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    await base(ORDERS_TABLE).update(orderId, {
      TrackingNumber: trackingNumber,
      Carrier: carrier,
      Status: 'Shipped',
      UpdatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating order tracking:', error);
    return { success: false, error: error.message };
  }
}

// === ADDRESS MANAGEMENT ===

// Create address
export async function createAddress(userId, addressData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    const record = await base(ADDRESSES_TABLE).create({
      UserId: userId,
      Label: addressData.label || 'Home',
      FullName: addressData.fullName,
      AddressLine1: addressData.addressLine1,
      AddressLine2: addressData.addressLine2 || '',
      City: addressData.city,
      Postcode: addressData.postcode,
      Country: addressData.country || 'United Kingdom',
      Phone: addressData.phone || '',
      IsDefault: addressData.isDefault || false,
      CreatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      address: {
        id: record.id,
      },
    };
  } catch (error) {
    console.error('Error creating address:', error);
    return { success: false, error: error.message };
  }
}

// Get user addresses
export async function getUserAddresses(userId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }

    const records = await base(ADDRESSES_TABLE)
      .select({
        filterByFormula: `{UserId} = '${userId}'`,
        sort: [{ field: 'IsDefault', direction: 'desc' }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      label: record.get('Label'),
      fullName: record.get('FullName'),
      addressLine1: record.get('AddressLine1'),
      addressLine2: record.get('AddressLine2'),
      city: record.get('City'),
      postcode: record.get('Postcode'),
      country: record.get('Country'),
      phone: record.get('Phone'),
      isDefault: record.get('IsDefault'),
    }));
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
}

// Update address
export async function updateAddress(addressId, addressData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    const updateFields = {};
    if (addressData.label) updateFields.Label = addressData.label;
    if (addressData.fullName) updateFields.FullName = addressData.fullName;
    if (addressData.addressLine1) updateFields.AddressLine1 = addressData.addressLine1;
    if (addressData.addressLine2 !== undefined) updateFields.AddressLine2 = addressData.addressLine2;
    if (addressData.city) updateFields.City = addressData.city;
    if (addressData.postcode) updateFields.Postcode = addressData.postcode;
    if (addressData.country) updateFields.Country = addressData.country;
    if (addressData.phone !== undefined) updateFields.Phone = addressData.phone;
    if (addressData.isDefault !== undefined) updateFields.IsDefault = addressData.isDefault;

    await base(ADDRESSES_TABLE).update(addressId, updateFields);

    return { success: true };
  } catch (error) {
    console.error('Error updating address:', error);
    return { success: false, error: error.message };
  }
}

// Delete address
export async function deleteAddress(addressId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    await base(ADDRESSES_TABLE).destroy(addressId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, error: error.message };
  }
}

// === WISHLIST MANAGEMENT ===

// Add product to wishlist
export async function addToWishlist(userId, productId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    // Check if already in wishlist
    const existing = await base(WISHLISTS_TABLE)
      .select({
        filterByFormula: `AND(FIND('${userId}', ARRAYJOIN({UserId})), FIND('${productId}', ARRAYJOIN({ProductId})))`,
        maxRecords: 1,
      })
      .all();

    if (existing.length > 0) {
      return { success: true, message: 'Already in wishlist' };
    }

    const record = await base(WISHLISTS_TABLE).create({
      UserId: [userId], // Array for linked record fields
      ProductId: [productId], // Array for linked record fields
      AddedAt: new Date().toISOString(),
    });

    return {
      success: true,
      wishlistItem: {
        id: record.id,
      },
    };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: error.message };
  }
}

// Remove product from wishlist
export async function removeFromWishlist(userId, productId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return { success: false };
    }

    const records = await base(WISHLISTS_TABLE)
      .select({
        filterByFormula: `AND(FIND('${userId}', ARRAYJOIN({UserId})), FIND('${productId}', ARRAYJOIN({ProductId})))`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return { success: true, message: 'Not in wishlist' };
    }

    await base(WISHLISTS_TABLE).destroy(records[0].id);
    return { success: true };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: error.message };
  }
}

// Get user wishlist with product details
export async function getUserWishlist(userId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }

    const records = await base(WISHLISTS_TABLE)
      .select({
        filterByFormula: `FIND('${userId}', ARRAYJOIN({UserId}))`,
        sort: [{ field: 'AddedAt', direction: 'desc' }],
      })
      .all();

    // Fetch product details for each wishlist item
    const wishlistWithProducts = await Promise.all(
      records.map(async (record) => {
        // ProductId might be an array (linked record) or string (text field)
        const productIdField = record.get('ProductId');
        const productId = Array.isArray(productIdField) ? productIdField[0] : productIdField;
        const product = await getProductById(productId);

        return {
          id: record.id,
          productId: productId,
          product: product,
          addedAt: record.get('AddedAt'),
        };
      })
    );

    return wishlistWithProducts.filter(item => item.product !== null);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

// Check if product is in wishlist
export async function isInWishlist(userId, productId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return false;
    }

    const records = await base(WISHLISTS_TABLE)
      .select({
        filterByFormula: `AND(FIND('${userId}', ARRAYJOIN({UserId})), FIND('${productId}', ARRAYJOIN({ProductId})))`,
        maxRecords: 1,
      })
      .all();

    return records.length > 0;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}

// Get wishlist product IDs only (for quick checks)
export async function getWishlistProductIds(userId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }

    console.log(`Airtable: Querying wishlist for userId: ${userId}`);

    const records = await base(WISHLISTS_TABLE)
      .select({
        filterByFormula: `FIND('${userId}', ARRAYJOIN({UserId}))`,
        fields: ['ProductId', 'UserId'],
      })
      .all();

    console.log(`Airtable: Found ${records.length} wishlist records for user ${userId}`);

    if (records.length > 0) {
      console.log('Airtable: Sample record:', {
        userId: records[0].get('UserId'),
        productId: records[0].get('ProductId'),
      });
    }

    const productIds = records.map(record => {
      const productIdField = record.get('ProductId');
      console.log('Airtable: Raw ProductId field:', productIdField);
      // Handle both array (linked record) and string (text field)
      const extractedId = Array.isArray(productIdField) ? productIdField[0] : productIdField;
      console.log('Airtable: Extracted ID:', extractedId);
      return extractedId;
    });

    console.log('Airtable: Returning product IDs:', productIds);
    return productIds;
  } catch (error) {
    console.error('Error fetching wishlist IDs:', error);
    return [];
  }
}

const airtableAPI = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  validatePromoCode,
  createReferral,
  getProductReviews,
  submitReview,
  createUser,
  findUserByEmail,
  updateUserProfile,
  storeResetToken,
  findUserByResetToken,
  updateUserPassword,
  createOrder,
  getUserOrders,
  getOrderByNumber,
  updateOrderStatus,
  updateOrderTracking,
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  isInWishlist,
  getWishlistProductIds,
};

export default airtableAPI;
