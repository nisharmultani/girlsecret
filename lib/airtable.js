const Airtable = require('airtable');
const PRODUCTS_TABLE = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME || 'Products';
const REVIEWS_TABLE = 'Reviews';
const PROMO_CODES_TABLE = 'PromoCodes';
const REFERRALS_TABLE = 'Referrals';
const USERS_TABLE = 'Users';
const ORDERS_TABLE = 'Orders';
const ADDRESSES_TABLE = 'Addresses';
const NEWSLETTER_TABLE = 'Newsletter';
const WISHLISTS_TABLE = 'Wishlists';
const CONTACT_MESSAGES_TABLE = 'ContactMessages';
const INFO_BANNERS_TABLE = 'InfoBanners';
const BLOG_POSTS_TABLE = 'BlogPosts';
const HERO_BANNERS_TABLE = 'HeroBanners';
const PROMO_BANNERS_TABLE = 'PromoBanners';
const todayIsoDate = new Date().toJSON().slice(0, 10); // Example Output: "2025-11-02"

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
        Available_Products: record.get('Available_Products') || [],
        inStock: record.get('InStock') !== false,
        featured: record.get('Featured') === true,
        keywords: keywords || '', // Keep as-is (can be string or array)
        slug: record.get('Slug') || name.toLowerCase().replace(/\s+/g, '-'),
        sizes: record.get('Sizes') || [],
        colors: record.get('Colors') || [],
        soldCount: record.get('SoldCount') || 0,
        averageRating: record.get('AverageRating') || 0,
        reviewCount: record.get('ReviewCount') || 0,
        specifications: record.get('Specifications') || record.get('ProductSpecifications') || '',
        videoUrls: record.get('VideoUrls') || record.get('Video_URLs') || [],
        created_At: record.get('Created_At') || record.get('CreatedAt') || new Date(0).toISOString(),
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
      Available_Products: record.get('Available_Products') || [],
      inStock: record.get('InStock') !== false,
      featured: record.get('Featured') === true,
      keywords: keywords || '', // Keep as-is (can be string or array)
      slug: record.get('Slug') || name.toLowerCase().replace(/\s+/g, '-'),
      sizes: record.get('Sizes') || [],
      colors: record.get('Colors') || [],
      soldCount: record.get('SoldCount') || 0,
      averageRating: record.get('AverageRating') || 0,
      reviewCount: record.get('ReviewCount') || 0,
      specifications: record.get('Specifications') || record.get('ProductSpecifications') || '',
      videoUrls: record.get('VideoUrls') || record.get('Video_URLs') || [],
      created_At: record.get('Created_At') || record.get('CreatedAt') || new Date(0).toISOString(),
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
      Available_Products: record.get('Available_Products') || [],
      inStock: record.get('InStock') !== false,
      featured: record.get('Featured') === true,
      keywords: keywords || '', // Keep as-is (can be string or array)
      slug: record.get('Slug') || slug,
      sizes: record.get('Sizes') || [],
      colors: record.get('Colors') || [],
      soldCount: record.get('SoldCount') || 0,
      averageRating: record.get('AverageRating') || 0,
      reviewCount: record.get('ReviewCount') || 0,
      specifications: record.get('Specifications') || record.get('ProductSpecifications') || '',
      videoUrls: record.get('VideoUrls') || record.get('Video_URLs') || [],
      created_At: record.get('Created_At') || record.get('CreatedAt') || new Date(0).toISOString(),
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
      return {
        success: false
      };
    }
    const record = await base(REFERRALS_TABLE).create({
      ReferrerEmail: referrerEmail,
      ReferredEmail: referredEmail,
      Created_At: todayIsoDate, // Changed from new Date().toISOString()
      Status: 'Pending',
    });

    return {
      id: record.id,
      success: true,
    };
  } catch (error) {
    console.error('Error creating referral:', error);
    return {
      success: false
    };
  }
}

// Create influencer referral code
export async function createInfluencerReferral(influencerData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false,
        error: 'Database not configured'
      };
    }
    // Check if referral code already exists
    const existing = await base(REFERRALS_TABLE)
      .select({
        filterByFormula: `{ReferralCode} = '${influencerData.referralCode.toUpperCase()}'`,
        maxRecords: 1,
      })
      .all();

    if (existing.length > 0) {
      return {
        success: false,
        error: 'Referral code already exists'
      };
    }

    const record = await base(REFERRALS_TABLE).create({
      ReferralCode: influencerData.referralCode.toUpperCase(),
      InfluencerName: influencerData.influencerName,
      InfluencerEmail: influencerData.influencerEmail,
      PromoCode: influencerData.promoCode || '',
      CommissionRate: influencerData.commissionRate || 10,
      TotalClicks: 0,
      TotalConversions: 0,
      TotalRevenue: 0,
      TotalCommission: 0,
      IsActive: true,
      Type: 'Influencer',
      Created_At: todayIsoDate,
    });

    return {
      success: true,
      referral: {
        id: record.id,
        referralCode: record.get('ReferralCode'),
      },
    };
  } catch (error) {
    console.error('Error creating influencer referral:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get referral by code
export async function getReferralByCode(referralCode) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }
    const records = await base(REFERRALS_TABLE)
      .select({
        filterByFormula: `{ReferralCode} = '${referralCode.toUpperCase()}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    return {
      id: record.id,
      referralCode: record.get('ReferralCode'),
      influencerName: record.get('InfluencerName'),
      influencerEmail: record.get('InfluencerEmail'),
      promoCode: record.get('PromoCode'),
      commissionRate: record.get('CommissionRate') || 0,
      totalClicks: record.get('TotalClicks') || 0,
      totalConversions: record.get('TotalConversions') || 0,
      totalRevenue: record.get('TotalRevenue') || 0,
      totalCommission: record.get('TotalCommission') || 0,
      isActive: record.get('IsActive') !== false,
      type: record.get('Type') || 'Influencer',
    };
  } catch (error) {
    console.error('Error fetching referral by code:', error);
    return null;
  }
}

// Update referral clicks
export async function incrementReferralClicks(referralCode) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    const records = await base(REFERRALS_TABLE)
      .select({
        filterByFormula: `{ReferralCode} = '${referralCode.toUpperCase()}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return {
        success: false,
        error: 'Referral code not found'
      };
    }

    const record = records[0];
    const currentClicks = record.get('TotalClicks') || 0;

    await base(REFERRALS_TABLE).update(record.id, {
      TotalClicks: currentClicks + 1,
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error incrementing referral clicks:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Track referral conversion
export async function trackReferralConversion(referralCode, orderTotal, orderId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    const records = await base(REFERRALS_TABLE)
      .select({
        filterByFormula: `{ReferralCode} = '${referralCode.toUpperCase()}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return {
        success: false,
        error: 'Referral code not found'
      };
    }

    const record = records[0];
    const currentConversions = record.get('TotalConversions') || 0;
    const currentRevenue = record.get('TotalRevenue') || 0;
    const currentCommission = record.get('TotalCommission') || 0;
    const commissionRate = record.get('CommissionRate') || 0;

    const newCommission = (orderTotal * commissionRate) / 100;

    await base(REFERRALS_TABLE).update(record.id, {
      TotalConversions: currentConversions + 1,
      TotalRevenue: currentRevenue + orderTotal,
      TotalCommission: currentCommission + newCommission,
    });

    return {
      success: true,
      commission: newCommission,
    };
  } catch (error) {
    console.error('Error tracking referral conversion:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get all active influencer referrals
export async function getAllInfluencerReferrals() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(REFERRALS_TABLE)
      .select({
        filterByFormula: `AND({Type} = 'Influencer', {IsActive} = TRUE())`,
        sort: [{
          field: 'Created_At',
          direction: 'desc'
        }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      referralCode: record.get('ReferralCode'),
      influencerName: record.get('InfluencerName'),
      influencerEmail: record.get('InfluencerEmail'),
      promoCode: record.get('PromoCode'),
      commissionRate: record.get('CommissionRate') || 0,
      totalClicks: record.get('TotalClicks') || 0,
      totalConversions: record.get('TotalConversions') || 0,
      totalRevenue: record.get('TotalRevenue') || 0,
      totalCommission: record.get('TotalCommission') || 0,
      isActive: record.get('IsActive') !== false,
    }));
  } catch (error) {
    console.error('Error fetching influencer referrals:', error);
    return [];
  }
}

// Get all reviews with stats grouped by product
export async function getAllReviewStats() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {};
    }
    const allRecords = await base(REVIEWS_TABLE)
      .select({
        filterByFormula: `{Approved} = TRUE()`,
      })
      .all();

    // Group reviews by productId and calculate stats
    const stats = {};

    allRecords.forEach(record => {
      const productIds = record.get('ProductId');
      const rating = record.get('Rating');

      // Handle both array and single value
      const productIdArray = Array.isArray(productIds) ? productIds : [productIds];

      productIdArray.forEach(productId => {
        if (!productId) return;

        if (!stats[productId]) {
          stats[productId] = {
            totalRating: 0,
            count: 0,
            averageRating: 0,
          };
        }

        stats[productId].totalRating += rating;
        stats[productId].count += 1;
      });
    });

    // Calculate averages
    Object.keys(stats).forEach(productId => {
      stats[productId].averageRating = stats[productId].totalRating / stats[productId].count;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return {};
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
    // Try different filter approaches
    // First, let's try without filtering to see what we get
    const allRecords = await base(REVIEWS_TABLE)
      .select({
        filterByFormula: `{Approved} = TRUE()`,
        sort: [{
          field: 'Created_At',
          direction: 'desc'
        }],
      })
      .all();

    // Filter in JavaScript instead
    const records = allRecords.filter(record => {
      const recordProductId = record.get('ProductId');
      // console.log('Checking review:', {
      //   reviewId: record.id,
      //   productIdField: recordProductId,
      //   isArray: Array.isArray(recordProductId),
      //   matches: Array.isArray(recordProductId)
      //     ? recordProductId.includes(productId)
      //     : recordProductId === productId
      // });

      // Handle both array and string cases
      if (Array.isArray(recordProductId)) {
        return recordProductId.includes(productId);
      }
      return recordProductId === productId;
    });

    return records.map(record => {
      const productId = record.get('ProductId');
      return {
        id: record.id,
        productId: productId,
        name: record.get('Name'),
        email: record.get('Email'),
        rating: record.get('Rating'),
        comment: record.get('Comment'),
        created_At: record.get('Created_At'),
        images: record.get('Images') || [],
      };
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// Submit product review
export async function submitReview(productId, name, email, rating, comment, images = []) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    console.log('submitReview - ProductId:', productId);
    console.log('submitReview - ProductId type:', typeof productId);
    console.log('submitReview - ProductId as array:', [productId]);
    console.log('submitReview - Images:', images);

    // Convert image URLs to Airtable attachment format
    // Images from Cloudinary are already full URLs, so use them directly
    const imageAttachments = images.map(url => ({
      url
    }));

    const reviewData = {
      ProductId: [productId], // Airtable linked records must be in array format
      Name: name,
      Email: email,
      Rating: rating,
      Comment: comment,
      Created_At: todayIsoDate, // Changed from new Date().toISOString()
      Approved: false, // Reviews need approval
    };

    // Add images if present
    if (imageAttachments.length > 0) {
      reviewData.Images = imageAttachments;
    }

    const record = await base(REVIEWS_TABLE).create(reviewData);

    return {
      id: record.id,
      success: true,
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// === USER MANAGEMENT ===
// Create user
export async function createUser(email, passwordHash, firstName, lastName, phone = '', verificationToken = null, verificationExpiry = null) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false,
        error: 'Database not configured'
      };
    }
    const userData = {
      Email: email.toLowerCase(),
      PasswordHash: passwordHash,
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      Active: true,
      EmailVerified: !verificationToken, // If no token, consider verified (for backward compatibility)
    };

    // Add verification fields if provided
    if (verificationToken) {
      userData.VerificationToken = verificationToken;
      userData.VerificationTokenExpiry = verificationExpiry;
    }

    const record = await base(USERS_TABLE).create(userData);

    return {
      success: true,
      user: {
        id: record.id,
        email: record.get('Email'),
        firstName: record.get('FirstName'),
        lastName: record.get('LastName'),
        phone: record.get('Phone'),
        emailVerified: record.get('EmailVerified') || false,
      },
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.message
    };
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
      return {
        success: false
      };
    }
    const updateFields = {};
    if (updates.firstName) updateFields.FirstName = updates.firstName;
    if (updates.lastName) updateFields.LastName = updates.lastName;
    if (updates.phone !== undefined) updateFields.Phone = updates.phone;

    await base(USERS_TABLE).update(userId, updateFields);

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Store password reset token
export async function storeResetToken(userId, token, expiry) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    await base(USERS_TABLE).update(userId, {
      ResetToken: token,
      ResetTokenExpiry: expiry,
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error storing reset token:', error);
    return {
      success: false,
      error: error.message
    };
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
      return {
        success: false
      };
    }
    await base(USERS_TABLE).update(userId, {
      PasswordHash: newPasswordHash,
      ResetToken: '',
      ResetTokenExpiry: null, // Use null to clear date fields in Airtable
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Find user by verification token
export async function findUserByVerificationToken(token) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }
    const records = await base(USERS_TABLE)
      .select({
        filterByFormula: `{VerificationToken} = '${token}'`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) return null;

    const record = records[0];
    const expiry = record.get('VerificationTokenExpiry');

    // Check if token is expired
    if (expiry && new Date(expiry) < new Date()) {
      return null;
    }

    return {
      id: record.id,
      email: record.get('Email'),
      firstName: record.get('FirstName'),
      lastName: record.get('LastName'),
      emailVerified: record.get('EmailVerified') || false,
    };
  } catch (error) {
    console.error('Error finding user by verification token:', error);
    return null;
  }
}

// Verify user email
export async function verifyUserEmail(userId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    await base(USERS_TABLE).update(userId, {
      EmailVerified: true,
      VerificationToken: '',
      VerificationTokenExpiry: null, // Use null to clear date fields in Airtable
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// === ORDER MANAGEMENT ===
// Create order
export async function createOrder(userId, orderData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderFields = {
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
      CreatedAt: new Date().toISOString(), // This is fine for a precise 'Created At' field
    };

    // Add referral code if present
    if (orderData.referralCode) {
      orderFields.ReferralCode = orderData.referralCode;
    }

    const record = await base(ORDERS_TABLE).create(orderFields);

    // Track referral conversion if referral code is present
    if (orderData.referralCode) {
      await trackReferralConversion(orderData.referralCode, orderData.total, record.id);
    }

    return {
      success: true,
      order: {
        id: record.id,
        orderNumber: orderNumber,
      },
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message
    };
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
        sort: [{
          field: 'CreatedAt',
          direction: 'desc'
        }],
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
      return {
        success: false
      };
    }
    await base(ORDERS_TABLE).update(orderId, {
      Status: status,
      UpdatedAt: todayIsoDate,
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update order tracking
export async function updateOrderTracking(orderId, trackingNumber, carrier) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    await base(ORDERS_TABLE).update(orderId, {
      TrackingNumber: trackingNumber,
      Carrier: carrier,
      Status: 'Shipped',
      UpdatedAt: todayIsoDate,
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating order tracking:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Update order with multiple fields
export async function updateOrder(orderId, updateData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false,
        error: 'Airtable not configured'
      };
    }
    const record = await base(ORDERS_TABLE).update(orderId, updateData);

    return {
      success: true,
      order: record
    };
  } catch (error) {
    console.error('Error updating order:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// === ADDRESS MANAGEMENT ===
// Create address
export async function createAddress(userId, addressData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
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
      CreatedAt: new Date().toISOString(), // This is fine for a precise 'Created At' field
    });

    return {
      success: true,
      address: {
        id: record.id,
      },
    };
  } catch (error) {
    console.error('Error creating address:', error);
    return {
      success: false,
      error: error.message
    };
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
        sort: [{
          field: 'IsDefault',
          direction: 'desc'
        }],
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
      return {
        success: false
      };
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

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating address:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Delete address
export async function deleteAddress(addressId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    await base(ADDRESSES_TABLE).destroy(addressId);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting address:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// === NEWSLETTER MANAGEMENT ===
// Subscribe to newsletter
export async function subscribeToNewsletter(subscriberData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    // Check if email already exists
    const existingRecords = await base(NEWSLETTER_TABLE)
      .select({
        filterByFormula: `{Email} = '${subscriberData.email}'`,
      })
      .all();

    if (existingRecords.length > 0) {
      const existingRecord = existingRecords[0];
      const isActive = existingRecord.get('IsActive');

      if (isActive) {
        return {
          success: false,
          error: 'Email already subscribed to newsletter',
        };
      }

      // Reactivate subscription
      await base(NEWSLETTER_TABLE).update(existingRecord.id, {
        IsActive: true,
        ResubscribedAt: todayIsoDate,
      });

      return {
        success: true,
        subscriber: {
          id: existingRecord.id,
          email: existingRecord.get('Email'),
        },
      };
    }

    // Create new subscription
    const record = await base(NEWSLETTER_TABLE).create({
      Email: subscriberData.email,
      FirstName: subscriberData.firstName || '',
      Source: subscriberData.source || 'website',
      // SubscribedAt: new Date().toISOString(), // Keeping this commented, using todayIsoDate in your ResubscribedAt
      IsActive: true,
    });

    return {
      success: true,
      subscriber: {
        id: record.id,
        email: record.get('Email'),
      },
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(emailOrToken) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    const records = await base(NEWSLETTER_TABLE)
      .select({
        filterByFormula: `{Email} = '${emailOrToken}'`,
        maxRecords: 1, // Added maxRecords: 1 for efficiency
      })
      .all();

    if (records.length === 0) {
      return {
        success: false,
        error: 'Email not found in newsletter'
      };
    }

    await base(NEWSLETTER_TABLE).update(records[0].id, {
      IsActive: false,
      UnsubscribedAt: todayIsoDate,
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get all active newsletter subscribers (for admin use)
export async function getNewsletterSubscribers() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(NEWSLETTER_TABLE)
      .select({
        filterByFormula: '{IsActive} = TRUE()',
        sort: [{
          field: 'SubscribedAt',
          direction: 'desc'
        }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      email: record.get('Email'),
      firstName: record.get('FirstName'),
      source: record.get('Source'),
      // subscribedAt: record.get('SubscribedAt'),
    }));
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}

// === CONTACT MESSAGES ===
// Store contact form submission
export async function createContactMessage(contactData) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    const record = await base(CONTACT_MESSAGES_TABLE).create({
      Name: contactData.name,
      Email: contactData.email,
      Subject: contactData.subject,
      Message: contactData.message,
      SubmittedAt: contactData.submittedAt || new Date().toISOString(),
      Status: 'New', // New, Read, Replied, Resolved
    });

    return {
      success: true,
      messageId: record.id,
    };
  } catch (error) {
    console.error('Error creating contact message:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get all contact messages (for admin use)
export async function getContactMessages() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(CONTACT_MESSAGES_TABLE)
      .select({
        sort: [{
          field: 'SubmittedAt',
          direction: 'desc'
        }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      name: record.get('Name'),
      email: record.get('Email'),
      subject: record.get('Subject'),
      message: record.get('Message'),
      submittedAt: record.get('SubmittedAt'),
      status: record.get('Status'),
    }));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

// Update contact message status
export async function updateContactMessageStatus(messageId, status) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false
      };
    }
    await base(CONTACT_MESSAGES_TABLE).update(messageId, {
      Status: status,
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating contact message status:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// === WISHLIST MANAGEMENT ===
// Add product to wishlist
export async function addToWishlist(userId, productId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false,
        error: 'Database not configured'
      };
    }
    // Check if already in wishlist
    const existing = await base(WISHLISTS_TABLE)
      .select({
        filterByFormula: `AND(FIND('${userId}', ARRAYJOIN({UserId})), FIND('${productId}', ARRAYJOIN({ProductId})))`,
        maxRecords: 1,
      })
      .all();

    if (existing.length > 0) {
      return {
        success: true,
        message: 'Already in wishlist'
      };
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
    return {
      success: false,
      error: error.message
    };
  }
}

// Remove product from wishlist
export async function removeFromWishlist(userId, productId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return {
        success: false,
        error: 'Database not configured'
      };
    }
    const records = await base(WISHLISTS_TABLE)
      .select({
        filterByFormula: `AND(FIND('${userId}', ARRAYJOIN({UserId})), FIND('${productId}', ARRAYJOIN({ProductId})))`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return {
        success: true,
        message: 'Not in wishlist'
      };
    }

    await base(WISHLISTS_TABLE).destroy(records[0].id);
    return {
      success: true
    };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return {
      success: false,
      error: error.message
    };
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
        sort: [{
          field: 'AddedAt',
          direction: 'desc'
        }],
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

// ========================================
// INFO BANNERS
// ========================================
// Get active info banners
export async function getActiveInfoBanners() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(INFO_BANNERS_TABLE)
      .select({
        filterByFormula: `{Active} = TRUE()`,
        sort: [{
          field: 'Priority',
          direction: 'desc'
        }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      message: record.get('Message') || '',
      link: record.get('Link') || '',
      linkText: record.get('LinkText') || '',
      backgroundColor: record.get('BackgroundColor') || 'bg-black',
      textColor: record.get('TextColor') || 'text-white',
      dismissible: record.get('Dismissible') === true,
      storageKey: record.get('StorageKey') || `infoBanner_${record.id}`,
      priority: record.get('Priority') || 0,
      active: record.get('Active') === true,
    }));
  } catch (error) {
    console.error('Error fetching info banners:', error);
    return [];
  }
}

// ========================================
// BLOG POSTS
// ========================================
// Get all published blog posts
export async function getAllBlogPosts(options = {}) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const {
      category,
      tag,
      limit,
      offset = 0
    } = options;
    let filterFormula = `{Status} = 'Published'`;

    if (category) {
      filterFormula = `AND(${filterFormula}, {Category} = '${category}')`;
    }

    if (tag) {
      filterFormula = `AND(${filterFormula}, FIND('${tag}', ARRAYJOIN({Tags})))`;
    }

    const selectOptions = {
      filterByFormula: filterFormula,
      sort: [{
        field: 'PublishedDate',
        direction: 'desc'
      }],
    };

    if (limit) {
      selectOptions.pageSize = limit;
    }

    const records = await base(BLOG_POSTS_TABLE)
      .select(selectOptions)
      .all();

    const posts = records.map(record => ({
      id: record.id,
      title: record.get('Title') || '',
      slug: record.get('Slug') || '',
      content: record.get('Content') || '',
      excerpt: record.get('Excerpt') || '',
      featuredImage: record.get('FeaturedImage') || null,
      category: record.get('Category') || 'Uncategorized',
      tags: record.get('Tags') || [],
      author: record.get('Author') || 'Admin',
      publishedDate: record.get('PublishedDate') || new Date().toISOString(),
      status: record.get('Status') || 'Draft',
      metaDescription: record.get('MetaDescription') || '',
      readTime: record.get('ReadTime') || 5,
      views: record.get('Views') || 0,
    }));

    // Apply offset and limit manually if needed
    if (offset > 0 || limit) {
      return posts.slice(offset, limit ? offset + limit : undefined);
    }

    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Get single blog post by slug
export async function getBlogPostBySlug(slug) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }
    const records = await base(BLOG_POSTS_TABLE)
      .select({
        filterByFormula: `AND({Slug} = '${slug}', {Status} = 'Published')`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return null;
    }

    const record = records[0];

    return {
      id: record.id,
      title: record.get('Title') || '',
      slug: record.get('Slug') || '',
      content: record.get('Content') || '',
      excerpt: record.get('Excerpt') || '',
      featuredImage: record.get('FeaturedImage') || null,
      category: record.get('Category') || 'Uncategorized',
      tags: record.get('Tags') || [],
      author: record.get('Author') || 'Admin',
      publishedDate: record.get('PublishedDate') || new Date().toISOString(),
      status: record.get('Status') || 'Draft',
      metaDescription: record.get('MetaDescription') || '',
      readTime: record.get('ReadTime') || 5,
      views: record.get('Views') || 0,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Get blog post by ID
export async function getBlogPostById(id) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return null;
    }
    const record = await base(BLOG_POSTS_TABLE).find(id);

    return {
      id: record.id,
      title: record.get('Title') || '',
      slug: record.get('Slug') || '',
      content: record.get('Content') || '',
      excerpt: record.get('Excerpt') || '',
      featuredImage: record.get('FeaturedImage') || null,
      category: record.get('Category') || 'Uncategorized',
      tags: record.get('Tags') || [],
      author: record.get('Author') || 'Admin',
      publishedDate: record.get('PublishedDate') || new Date().toISOString(),
      status: record.get('Status') || 'Draft',
      metaDescription: record.get('MetaDescription') || '',
      readTime: record.get('ReadTime') || 5,
      views: record.get('Views') || 0,
    };
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }
}

// Get all blog categories
export async function getBlogCategories() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(BLOG_POSTS_TABLE)
      .select({
        filterByFormula: `{Status} = 'Published'`,
        fields: ['Category'],
      })
      .all();

    const categories = [...new Set(records.map(record => record.get('Category')).filter(Boolean))];
    return categories;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

// ========================================
// HERO BANNERS
// ========================================
// Get active hero banners for carousel
export async function getActiveHeroBanners() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(HERO_BANNERS_TABLE)
      .select({
        filterByFormula: `{Active} = TRUE()`,
        sort: [{
          field: 'Order',
          direction: 'asc'
        }],
      })
      .all();

    return records.map(record => {
      const imageField = record.get('Image');
      const imageUrl = imageField && imageField.length > 0 ? imageField[0].url : '';

      return {
        id: record.id,
        title: record.get('Title') || '',
        subtitle: record.get('Subtitle') || '',
        description: record.get('Description') || '',
        cta: record.get('CTAText') || '',
        ctaLink: record.get('CTALink') || '',
        image: imageUrl,
        order: record.get('Order') || 0,
        active: record.get('Active') === true,
      };
    });
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    return [];
  }
}

// Get all blog tags
export async function getBlogTags() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(BLOG_POSTS_TABLE)
      .select({
        filterByFormula: `{Status} = 'Published'`,
        fields: ['Tags'],
      })
      .all();

    const allTags = records.flatMap(record => record.get('Tags') || []);
    const uniqueTags = [...new Set(allTags)].filter(Boolean);
    return uniqueTags;
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return [];
  }
}

// Get related blog posts
export async function getRelatedBlogPosts(currentPostId, category, limit = 3) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(BLOG_POSTS_TABLE)
      .select({
        filterByFormula: `AND({Status} = 'Published', {Category} = '${category}', {RecordID} != '${currentPostId}')`,
        sort: [{
          field: 'PublishedDate',
          direction: 'desc'
        }],
        maxRecords: limit,
      })
      .all();

    return records.map(record => ({
      id: record.id,
      title: record.get('Title') || '',
      slug: record.get('Slug') || '',
      excerpt: record.get('Excerpt') || '',
      featuredImage: record.get('FeaturedImage') || null,
      category: record.get('Category') || 'Uncategorized',
      publishedDate: record.get('PublishedDate') || new Date().toISOString(),
      readTime: record.get('ReadTime') || 5,
    }));
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}

// Increment blog post views
export async function incrementBlogPostViews(postId) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return;
    }
    const record = await base(BLOG_POSTS_TABLE).find(postId);
    const currentViews = record.get('Views') || 0;

    await base(BLOG_POSTS_TABLE).update(postId, {
      Views: currentViews + 1,
    });
  } catch (error) {
    console.error('Error incrementing blog post views:', error);
  }
}

// Search blog posts
export async function searchBlogPosts(query) {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(BLOG_POSTS_TABLE)
      .select({
        filterByFormula: `AND(
      {Status} = 'Published',
      OR(
        FIND(LOWER('${query}'), LOWER({Title})),
        FIND(LOWER('${query}'), LOWER({Content})),
        FIND(LOWER('${query}'), LOWER({Excerpt}))
      )
    )`,
        sort: [{
          field: 'PublishedDate',
          direction: 'desc'
        }],
      })
      .all();

    return records.map(record => ({
      id: record.id,
      title: record.get('Title') || '',
      slug: record.get('Slug') || '',
      excerpt: record.get('Excerpt') || '',
      featuredImage: record.get('FeaturedImage') || null,
      category: record.get('Category') || 'Uncategorized',
      publishedDate: record.get('PublishedDate') || new Date().toISOString(),
      readTime: record.get('ReadTime') || 5,
    }));
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

// ========================================
// PROMOTIONAL BANNERS
// ========================================
// Get active promotional banners
export async function getActivePromoBanners() {
  try {
    const base = getBase();
    if (!base) {
      console.warn('Airtable not configured');
      return [];
    }
    const records = await base(PROMO_BANNERS_TABLE)
      .select({
        filterByFormula: `{Active} = TRUE()`,
        sort: [{
          field: 'Order',
          direction: 'asc'
        }],
      })
      .all();

    return records.map(record => {
      const imageField = record.get('Image');
      const imageUrl = imageField && imageField.length > 0 ? imageField[0].url : '';

      return {
        id: record.id,
        title: record.get('Title') || '',
        subtitle: record.get('Subtitle') || '',
        buttonText: record.get('ButtonText') || 'Learn More',
        buttonLink: record.get('ButtonLink') || '/shop',
        image: imageUrl,
        imageAlt: record.get('ImageAlt') || 'Promotional Banner',
        height: record.get('Height') || 'h-80 md:h-96',
        order: record.get('Order') || 0,
        active: record.get('Active') === true,
      };
    });
  } catch (error) {
    console.error('Error fetching promotional banners:', error);
    return [];
  }
}

const airtableAPI = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  validatePromoCode,
  createReferral,
  createInfluencerReferral,
  getReferralByCode,
  incrementReferralClicks,
  trackReferralConversion,
  getAllInfluencerReferrals,
  getProductReviews,
  submitReview,
  createUser,
  findUserByEmail,
  updateUserProfile,
  storeResetToken,
  findUserByResetToken,
  updateUserPassword,
  findUserByVerificationToken,
  verifyUserEmail,
  createOrder,
  getUserOrders,
  getOrderByNumber,
  updateOrderStatus,
  updateOrderTracking,
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscribers,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  isInWishlist,
  getWishlistProductIds,
  getActiveInfoBanners,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  getBlogCategories,
  getBlogTags,
  getRelatedBlogPosts,
  incrementBlogPostViews,
  searchBlogPosts,
  getActiveHeroBanners,
  getActivePromoBanners,
};
export default airtableAPI;