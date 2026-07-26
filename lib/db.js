import { getSupabase } from './supabase';

// Same function names/signatures as the old lib/airtable.js, so callers only
// need an import-path swap. Internals are rewritten against the Postgres
// schema in supabase/schema.sql.

// Simple in-memory cache for full-table reads, same rationale as the old
// Airtable layer: pages assume a `revalidate: 60` staleness window, so
// reusing data for that window avoids re-fetching on every request in dev
// and across the many pages that read the same data during a single build.
const CACHE_TTL_MS = 60 * 1000;
const cacheStore = new Map();

function getCached(key) {
  const entry = cacheStore.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL_MS) {
    return entry.value;
  }
  return null;
}

function setCached(key, value) {
  cacheStore.set(key, { value, time: Date.now() });
  return value;
}

// === MAPPERS (snake_case columns -> the camelCase shape the app expects) ===

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name || 'Untitled Product',
    description: row.description || '',
    price: row.price || 0,
    salePrice: row.sale_price || null,
    category: row.category || 'Uncategorized',
    images: row.images || [],
    Available_Products: row.available_product_ids || [],
    inStock: row.in_stock !== false,
    featured: row.featured === true,
    keywords: row.keywords || '',
    slug: row.slug,
    sizes: row.sizes || [],
    colors: row.colors || [],
    soldCount: row.sold_count || 0,
    averageRating: row.average_rating || 0,
    reviewCount: row.review_count || 0,
    specifications: row.specifications || '',
    videoUrls: row.video_urls || [],
    created_At: row.created_at || new Date(0).toISOString(),
  };
}

function mapOrderItem(row) {
  return {
    id: row.product_id,
    name: row.product_name,
    price: row.unit_price,
    image: row.image,
    slug: row.product_slug,
    quantity: row.quantity,
    size: row.size,
    color: row.color,
  };
}

function mapOrder(row) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    items: (row.order_items || []).map(mapOrderItem),
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    discount: row.discount,
    total: row.total,
    status: row.status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    createdAt: row.created_at,
    shippingAddress: row.shipping_address || {},
    billingAddress: row.billing_address || {},
    trackingNumber: row.tracking_number || null,
    carrier: row.carrier || null,
  };
}

function mapBlogPost(row) {
  return {
    id: row.id,
    title: row.title || '',
    slug: row.slug || '',
    content: row.content || '',
    excerpt: row.excerpt || '',
    featuredImage: row.featured_image || null,
    category: row.category || 'Uncategorized',
    tags: row.tags || [],
    author: row.author || 'Admin',
    publishedDate: row.published_date || new Date().toISOString(),
    status: row.status || 'Draft',
    metaDescription: row.meta_description || '',
    readTime: row.read_time || 5,
    views: row.views || 0,
  };
}

// === PRODUCTS ===

export async function getAllProducts() {
  const cached = getCached('allProducts');
  if (cached) return cached;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured, returning empty products array');
      return [];
    }
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;

    return setCached('allProducts', data.map(mapProduct));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return mapProduct(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductBySlug(slug) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return mapProduct(data);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

// === PROMO CODES ===

export async function validatePromoCode(code) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const now = new Date();
    if (data.valid_until && new Date(data.valid_until) < now) return null;
    if (data.valid_from && new Date(data.valid_from) > now) return null;

    return {
      id: data.id,
      code: data.code,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      minPurchase: data.min_purchase || 0,
      maxDiscount: data.max_discount,
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return null;
  }
}

// === REFERRALS ===

export async function createReferral(referrerEmail, referredEmail) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data, error } = await supabase
      .from('referrals')
      .insert({ referrer_email: referrerEmail, referred_email: referredEmail, status: 'Pending' })
      .select()
      .single();
    if (error) throw error;

    return { id: data.id, success: true };
  } catch (error) {
    console.error('Error creating referral:', error);
    return { success: false };
  }
}

export async function createInfluencerReferral(influencerData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const code = influencerData.referralCode.toUpperCase();

    const { data: existing, error: checkError } = await supabase
      .from('referrals')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle();
    if (checkError) throw checkError;
    if (existing) {
      return { success: false, error: 'Referral code already exists' };
    }

    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referral_code: code,
        influencer_name: influencerData.influencerName,
        influencer_email: influencerData.influencerEmail,
        promo_code: influencerData.promoCode || '',
        commission_rate: influencerData.commissionRate || 10,
        is_active: true,
        type: 'Influencer',
      })
      .select()
      .single();
    if (error) throw error;

    return {
      success: true,
      referral: { id: data.id, referralCode: data.referral_code },
    };
  } catch (error) {
    console.error('Error creating influencer referral:', error);
    return { success: false, error: error.message };
  }
}

export async function getReferralByCode(referralCode) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', referralCode.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      referralCode: data.referral_code,
      influencerName: data.influencer_name,
      influencerEmail: data.influencer_email,
      promoCode: data.promo_code,
      commissionRate: data.commission_rate || 0,
      totalClicks: data.total_clicks || 0,
      totalConversions: data.total_conversions || 0,
      totalRevenue: data.total_revenue || 0,
      totalCommission: data.total_commission || 0,
      isActive: data.is_active !== false,
      type: data.type || 'Influencer',
    };
  } catch (error) {
    console.error('Error fetching referral by code:', error);
    return null;
  }
}

export async function incrementReferralClicks(referralCode) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data, error } = await supabase
      .from('referrals')
      .select('id, total_clicks')
      .eq('referral_code', referralCode.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Referral code not found' };
    }

    const { error: updateError } = await supabase
      .from('referrals')
      .update({ total_clicks: (data.total_clicks || 0) + 1 })
      .eq('id', data.id);
    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error incrementing referral clicks:', error);
    return { success: false, error: error.message };
  }
}

export async function trackReferralConversion(referralCode, orderTotal, orderId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data, error } = await supabase
      .from('referrals')
      .select('id, total_conversions, total_revenue, total_commission, commission_rate')
      .eq('referral_code', referralCode.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Referral code not found' };
    }

    const newCommission = (orderTotal * (data.commission_rate || 0)) / 100;

    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        total_conversions: (data.total_conversions || 0) + 1,
        total_revenue: (data.total_revenue || 0) + orderTotal,
        total_commission: (data.total_commission || 0) + newCommission,
      })
      .eq('id', data.id);
    if (updateError) throw updateError;

    return { success: true, commission: newCommission };
  } catch (error) {
    console.error('Error tracking referral conversion:', error);
    return { success: false, error: error.message };
  }
}

export async function getAllInfluencerReferrals() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('type', 'Influencer')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      referralCode: row.referral_code,
      influencerName: row.influencer_name,
      influencerEmail: row.influencer_email,
      promoCode: row.promo_code,
      commissionRate: row.commission_rate || 0,
      totalClicks: row.total_clicks || 0,
      totalConversions: row.total_conversions || 0,
      totalRevenue: row.total_revenue || 0,
      totalCommission: row.total_commission || 0,
      isActive: row.is_active !== false,
    }));
  } catch (error) {
    console.error('Error fetching influencer referrals:', error);
    return [];
  }
}

// === REVIEWS ===

export async function getAllReviewStats() {
  const cached = getCached('allReviewStats');
  if (cached) return cached;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return {};
    }
    const { data, error } = await supabase.from('reviews').select('product_id, rating').eq('approved', true);
    if (error) throw error;

    const stats = {};
    data.forEach(row => {
      if (!row.product_id) return;
      if (!stats[row.product_id]) {
        stats[row.product_id] = { totalRating: 0, count: 0, averageRating: 0 };
      }
      stats[row.product_id].totalRating += row.rating;
      stats[row.product_id].count += 1;
    });

    Object.keys(stats).forEach(productId => {
      stats[productId].averageRating = stats[productId].totalRating / stats[productId].count;
    });

    return setCached('allReviewStats', stats);
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return {};
  }
}

export async function getProductReviews(productId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('approved', true)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      productId: row.product_id,
      name: row.name,
      email: row.email,
      rating: row.rating,
      comment: row.comment,
      created_At: row.created_at,
      images: row.images || [],
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function submitReview(productId, name, email, rating, comment, images = []) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        name,
        email,
        rating,
        comment,
        images: images.map(url => ({ url })),
        approved: false,
      })
      .select()
      .single();
    if (error) throw error;

    return { id: data.id, success: true };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: error.message };
  }
}

// === USER MANAGEMENT ===

export async function createUser(email, passwordHash, firstName, lastName, phone = '', verificationToken = null, verificationExpiry = null) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const userData = {
      email: email.toLowerCase(),
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      active: true,
      email_verified: !verificationToken,
    };
    if (verificationToken) {
      userData.verification_token = verificationToken;
      userData.verification_token_expiry = verificationExpiry;
    }

    const { data, error } = await supabase.from('users').insert(userData).select().single();
    if (error) throw error;

    return {
      success: true,
      user: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        emailVerified: data.email_verified || false,
      },
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

export async function findUserByEmail(email) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      active: data.active,
    };
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

export async function getUserById(userId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      password: data.password_hash, // Alias for compatibility
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      active: data.active,
      emailVerified: data.email_verified,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const updateFields = {};
    if (updates.firstName) updateFields.first_name = updates.firstName;
    if (updates.lastName) updateFields.last_name = updates.lastName;
    if (updates.phone !== undefined) updateFields.phone = updates.phone;

    const { error } = await supabase.from('users').update(updateFields).eq('id', userId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
}

export async function storeResetToken(userId, token, expiry) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { error } = await supabase
      .from('users')
      .update({ reset_token: token, reset_token_expiry: expiry })
      .eq('id', userId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error storing reset token:', error);
    return { success: false, error: error.message };
  }
}

export async function findUserByResetToken(token) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase.from('users').select('*').eq('reset_token', token).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    if (data.reset_token_expiry && new Date(data.reset_token_expiry) < new Date()) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
    };
  } catch (error) {
    console.error('Error finding user by reset token:', error);
    return null;
  }
}

export async function updateUserPassword(userId, newPasswordHash) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { error } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash, reset_token: null, reset_token_expiry: null })
      .eq('id', userId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error: error.message };
  }
}

export async function findUserByVerificationToken(token) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase.from('users').select('*').eq('verification_token', token).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    if (data.verification_token_expiry && new Date(data.verification_token_expiry) < new Date()) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      emailVerified: data.email_verified || false,
    };
  } catch (error) {
    console.error('Error finding user by verification token:', error);
    return null;
  }
}

export async function verifyUserEmail(userId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { error } = await supabase
      .from('users')
      .update({ email_verified: true, verification_token: null, verification_token_expiry: null })
      .eq('id', userId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error verifying email:', error);
    return { success: false, error: error.message };
  }
}

// === ORDER MANAGEMENT ===

// Order objects (from checkout.jsx) don't yet get created via a real
// account for guest checkouts - the "guest_<email>" convention was baked
// into every caller (checkout.jsx, pages/api/user/orders.js), so it's
// decoded here rather than changing those call sites: it now maps to a
// real user_id FK (or null + guest_email) instead of Airtable's overloaded
// text field.
const GUEST_PREFIX = 'guest_';

export async function createOrder(userId, orderData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const isGuest = typeof userId === 'string' && userId.startsWith(GUEST_PREFIX);

    const orderFields = {
      order_number: orderNumber,
      user_id: isGuest ? null : userId,
      guest_email: isGuest ? userId.slice(GUEST_PREFIX.length) : null,
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shippingCost,
      discount: orderData.discount || 0,
      total: orderData.total,
      status: 'Pending',
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      shipping_address: orderData.shippingAddress,
      billing_address: orderData.billingAddress,
      promo_code: orderData.promoCode || null,
      referral_code: orderData.referralCode || null,
    };

    const { data: order, error } = await supabase.from('orders').insert(orderFields).select().single();
    if (error) throw error;

    const items = orderData.items || [];
    if (items.length > 0) {
      const itemRows = items.map(item => ({
        order_id: order.id,
        product_id: item.id || null,
        product_name: item.name,
        product_slug: item.slug || null,
        image: item.image || null,
        quantity: item.quantity,
        unit_price: item.price,
        size: item.size || null,
        color: item.color || null,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
      if (itemsError) throw itemsError;
    }

    if (orderData.referralCode) {
      await trackReferralConversion(orderData.referralCode, orderData.total, order.id);
    }

    return { success: true, order: { id: order.id, orderNumber } };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserOrders(userId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const isGuest = typeof userId === 'string' && userId.startsWith(GUEST_PREFIX);
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    query = isGuest ? query.eq('guest_email', userId.slice(GUEST_PREFIX.length)) : query.eq('user_id', userId);

    const { data, error } = await query;
    if (error) throw error;

    return data.map(mapOrder);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function getOrderByNumber(orderNumber) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return mapOrder(data);
  } catch (error) {
    console.error('Error finding order by number:', error);
    return null;
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderTracking(orderId, trackingNumber, carrier) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber, carrier, status: 'Shipped' })
      .eq('id', orderId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating order tracking:', error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderPaymentStatus(orderNumber, paymentStatus, paymentData = {}) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Supabase not configured' };
    }
    const updateData = { payment_status: paymentStatus };
    if (paymentData.paymentIntentId) updateData.payment_intent_id = paymentData.paymentIntentId;
    if (paymentData.paymentMethod) updateData.payment_method = paymentData.paymentMethod;
    if (paymentData.amountReceived) updateData.amount_received = paymentData.amountReceived;
    if (paymentData.error) updateData.payment_error = paymentData.error;
    if (paymentStatus === 'Paid') updateData.status = 'Processing';

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_number', orderNumber)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error('Order not found:', orderNumber);
      return { success: false, error: 'Order not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating order payment status:', error);
    return { success: false, error: error.message };
  }
}

// Generic multi-field update, called by pages/api/admin/orders/update.js
// with Airtable-style PascalCase keys - translated here so that call site
// doesn't need to change.
const ORDER_FIELD_MAP = {
  Status: 'status',
  TrackingNumber: 'tracking_number',
  Carrier: 'carrier',
  AliExpressStatus: 'supplier_status',
  Notes: 'notes',
};

export async function updateOrder(orderId, updateData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const mapped = {};
    Object.entries(updateData).forEach(([key, value]) => {
      const column = ORDER_FIELD_MAP[key];
      if (column) mapped[column] = value;
    });

    const { data, error } = await supabase.from('orders').update(mapped).eq('id', orderId).select().single();
    if (error) throw error;

    return { success: true, order: mapOrder(data) };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error: error.message };
  }
}

// === ADDRESS MANAGEMENT ===

export async function createAddress(userId, addressData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        label: addressData.label || 'Home',
        full_name: addressData.fullName,
        address_line1: addressData.addressLine1,
        address_line2: addressData.addressLine2 || '',
        city: addressData.city,
        postcode: addressData.postcode,
        country: addressData.country || 'United Kingdom',
        phone: addressData.phone || '',
        is_default: addressData.isDefault || false,
      })
      .select()
      .single();
    if (error) throw error;

    return { success: true, address: { id: data.id } };
  } catch (error) {
    console.error('Error creating address:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserAddresses(userId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      label: row.label,
      fullName: row.full_name,
      addressLine1: row.address_line1,
      addressLine2: row.address_line2,
      city: row.city,
      postcode: row.postcode,
      country: row.country,
      phone: row.phone,
      isDefault: row.is_default,
    }));
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
}

export async function updateAddress(addressId, addressData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const updateFields = {};
    if (addressData.label) updateFields.label = addressData.label;
    if (addressData.fullName) updateFields.full_name = addressData.fullName;
    if (addressData.addressLine1) updateFields.address_line1 = addressData.addressLine1;
    if (addressData.addressLine2 !== undefined) updateFields.address_line2 = addressData.addressLine2;
    if (addressData.city) updateFields.city = addressData.city;
    if (addressData.postcode) updateFields.postcode = addressData.postcode;
    if (addressData.country) updateFields.country = addressData.country;
    if (addressData.phone !== undefined) updateFields.phone = addressData.phone;
    if (addressData.isDefault !== undefined) updateFields.is_default = addressData.isDefault;

    const { error } = await supabase.from('addresses').update(updateFields).eq('id', addressId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating address:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAddress(addressId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { error } = await supabase.from('addresses').delete().eq('id', addressId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, error: error.message };
  }
}

// === NEWSLETTER MANAGEMENT ===

export async function subscribeToNewsletter(subscriberData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', subscriberData.email)
      .maybeSingle();
    if (checkError) throw checkError;

    if (existing) {
      if (existing.is_active) {
        return { success: false, error: 'Email already subscribed to newsletter' };
      }

      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: true, resubscribed_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (updateError) throw updateError;

      return { success: true, subscriber: { id: existing.id, email: existing.email } };
    }

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: subscriberData.email,
        first_name: subscriberData.firstName || '',
        source: subscriberData.source || 'website',
        is_active: true,
      })
      .select()
      .single();
    if (error) throw error;

    return { success: true, subscriber: { id: data.id, email: data.email } };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: error.message };
  }
}

export async function unsubscribeFromNewsletter(emailOrToken) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', emailOrToken)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return { success: false, error: 'Email not found in newsletter' };
    }

    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('id', data.id);
    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return { success: false, error: error.message };
  }
}

export async function getNewsletterSubscribers() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });
    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      source: row.source,
    }));
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}

// === CONTACT MESSAGES ===

export async function createContactMessage(contactData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        submitted_at: contactData.submittedAt || new Date().toISOString(),
        status: 'New',
      })
      .select()
      .single();
    if (error) throw error;

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error creating contact message:', error);
    return { success: false, error: error.message };
  }
}

export async function getContactMessages() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      submittedAt: row.submitted_at,
      status: row.status,
    }));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

export async function updateContactMessageStatus(messageId, status) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false };
    }
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', messageId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating contact message status:', error);
    return { success: false, error: error.message };
  }
}

// === WISHLIST MANAGEMENT ===

export async function addToWishlist(userId, productId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const { data: existing, error: checkError } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    if (checkError) throw checkError;
    if (existing) {
      return { success: true, message: 'Already in wishlist' };
    }

    const { data, error } = await supabase
      .from('wishlists')
      .insert({ user_id: userId, product_id: productId })
      .select()
      .single();
    if (error) throw error;

    return { success: true, wishlistItem: { id: data.id } };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: error.message };
  }
}

export async function removeFromWishlist(userId, productId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserWishlist(userId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('wishlists')
      .select('id, product_id, added_at, products(*)')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    if (error) throw error;

    return data
      .filter(row => row.products)
      .map(row => ({
        id: row.id,
        productId: row.product_id,
        product: mapProduct(row.products),
        addedAt: row.added_at,
      }));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export async function isInWishlist(userId, productId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return false;
    }
    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    if (error) throw error;

    return !!data;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}

export async function getWishlistProductIds(userId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase.from('wishlists').select('product_id').eq('user_id', userId);
    if (error) throw error;

    return data.map(row => row.product_id);
  } catch (error) {
    console.error('Error fetching wishlist IDs:', error);
    return [];
  }
}

// === INFO BANNERS ===

export async function getActiveInfoBanners() {
  const cached = getCached('activeInfoBanners');
  if (cached) return cached;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('info_banners')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false });
    if (error) throw error;

    const banners = data.map(row => ({
      id: row.id,
      message: row.message || '',
      link: row.link || '',
      linkText: row.link_text || '',
      backgroundColor: row.background_color || 'bg-black',
      textColor: row.text_color || 'text-white',
      dismissible: row.dismissible === true,
      storageKey: row.storage_key || `infoBanner_${row.id}`,
      priority: row.priority || 0,
      active: row.active === true,
    }));

    return setCached('activeInfoBanners', banners);
  } catch (error) {
    console.error('Error fetching info banners:', error);
    return [];
  }
}

// === BLOG POSTS ===

export async function getAllBlogPosts(options = {}) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { category, tag, limit, offset = 0 } = options;
    let query = supabase.from('blog_posts').select('*').eq('status', 'Published').order('published_date', { ascending: false });

    if (category) query = query.eq('category', category);
    if (tag) query = query.contains('tags', [tag]);
    if (limit || offset) {
      query = query.range(offset, limit ? offset + limit - 1 : offset + 999);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(mapBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'Published')
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return mapBlogPost(data);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getBlogPostById(id) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return null;
    }
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    return mapBlogPost(data);
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }
}

export async function getBlogCategories() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase.from('blog_posts').select('category').eq('status', 'Published');
    if (error) throw error;

    return [...new Set(data.map(row => row.category).filter(Boolean))];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

// === HERO BANNERS ===

export async function getActiveHeroBanners() {
  const cached = getCached('activeHeroBanners');
  if (cached) return cached;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;

    const banners = data.map(row => ({
      id: row.id,
      title: row.title || '',
      subtitle: row.subtitle || '',
      description: row.description || '',
      cta: row.cta_text || '',
      ctaLink: row.cta_link || '',
      image: row.image || '',
      order: row.display_order || 0,
      active: row.active === true,
    }));

    return setCached('activeHeroBanners', banners);
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    return [];
  }
}

export async function getBlogTags() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase.from('blog_posts').select('tags').eq('status', 'Published');
    if (error) throw error;

    const allTags = data.flatMap(row => row.tags || []);
    return [...new Set(allTags)].filter(Boolean);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return [];
  }
}

export async function getRelatedBlogPosts(currentPostId, category, limit = 3) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'Published')
      .eq('category', category)
      .neq('id', currentPostId)
      .order('published_date', { ascending: false })
      .limit(limit);
    if (error) throw error;

    return data.map(mapBlogPost);
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}

export async function incrementBlogPostViews(postId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return;
    }
    const { data, error } = await supabase.from('blog_posts').select('views').eq('id', postId).maybeSingle();
    if (error) throw error;
    if (!data) return;

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', postId);
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error incrementing blog post views:', error);
  }
}

export async function searchBlogPosts(query) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    // Strip characters that are structurally significant in PostgREST's
    // filter syntax (`,` separates OR conditions, `(` `)` group them) so a
    // search term containing them can't break or extend the filter.
    const safeQuery = query.replace(/[,()]/g, ' ').trim();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'Published')
      .or(`title.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%,excerpt.ilike.%${safeQuery}%`)
      .order('published_date', { ascending: false });
    if (error) throw error;

    return data.map(mapBlogPost);
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

// === PROMOTIONAL BANNERS ===

export async function getActivePromoBanners() {
  const cached = getCached('activePromoBanners');
  if (cached) return cached;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase
      .from('promo_banners')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;

    const banners = data.map(row => ({
      id: row.id,
      title: row.title || '',
      subtitle: row.subtitle || '',
      buttonText: row.button_text || 'Learn More',
      buttonLink: row.button_link || '/shop',
      image: row.image || '',
      imageAlt: row.image_alt || 'Promotional Banner',
      height: row.height || 'h-80 md:h-96',
      order: row.display_order || 0,
      active: row.active === true,
    }));

    return setCached('activePromoBanners', banners);
  } catch (error) {
    console.error('Error fetching promotional banners:', error);
    return [];
  }
}

// === INFLUENCER / AMBASSADOR APPLICATIONS ===
// New in this migration: pages/api/influencer/apply.js and
// pages/api/ambassador/apply.js used to call Airtable directly via
// getBase() instead of going through lib/airtable.js. These give that code
// a proper data-layer function to call instead.

export async function createInfluencerApplication(applicationData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const { error } = await supabase.from('influencer_applications').insert({
      name: applicationData.name,
      email: applicationData.email,
      instagram: applicationData.instagram,
      follower_count: applicationData.followers,
      niche: applicationData.niche,
      message: applicationData.message,
      referral_code: applicationData.referralCode,
      status: 'Pending',
      commission_rate: 15,
    });
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error creating influencer application:', error);
    return { success: false, error: error.message };
  }
}

export async function createAmbassadorApplication(applicationData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const { error } = await supabase.from('ambassador_applications').insert({
      name: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      city: applicationData.city,
      university: applicationData.university || '',
      why_you: applicationData.whyYou,
      experience: applicationData.experience,
      referral_code: applicationData.referralCode,
      status: 'Pending',
      commission_rate: 10,
    });
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error creating ambassador application:', error);
    return { success: false, error: error.message };
  }
}

// === ADMIN: PROMO CODES ===
// New in this migration: pages/api/admin/promo-codes.js and
// pages/api/admin/promo-codes/[id].js used to call Airtable directly via
// getBase() instead of going through lib/airtable.js.

export async function getAllPromoCodes() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return [];
    }
    const { data, error } = await supabase.from('promo_codes').select('*').order('code', { ascending: true });
    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      code: row.code,
      discountType: row.discount_type,
      discountValue: row.discount_value,
      minPurchase: row.min_purchase || 0,
      maxDiscount: row.max_discount,
      active: row.active,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      description: row.description,
      usageCount: row.usage_count || 0,
    }));
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return [];
  }
}

export async function createPromoCode(promoData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const code = promoData.code.toUpperCase();

    const { data: existing, error: checkError } = await supabase
      .from('promo_codes')
      .select('id')
      .eq('code', code)
      .maybeSingle();
    if (checkError) throw checkError;
    if (existing) {
      return { success: false, error: 'Promo code already exists' };
    }

    const { data, error } = await supabase
      .from('promo_codes')
      .insert({
        code,
        discount_type: promoData.discountType,
        discount_value: parseFloat(promoData.discountValue),
        min_purchase: parseFloat(promoData.minPurchase) || 0,
        max_discount: promoData.maxDiscount ? parseFloat(promoData.maxDiscount) : null,
        active: promoData.active !== undefined ? promoData.active : true,
        valid_from: promoData.validFrom || null,
        valid_until: promoData.validUntil || null,
        description: promoData.description || '',
        usage_count: 0,
      })
      .select()
      .single();
    if (error) throw error;

    return {
      success: true,
      promoCode: { id: data.id, code: data.code, discountType: data.discount_type, discountValue: data.discount_value },
    };
  } catch (error) {
    console.error('Error creating promo code:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePromoCode(promoCodeId, promoData) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const updateData = {};
    if (promoData.code) updateData.code = promoData.code.toUpperCase();
    if (promoData.discountType) updateData.discount_type = promoData.discountType;
    if (promoData.discountValue !== undefined) updateData.discount_value = parseFloat(promoData.discountValue);
    if (promoData.minPurchase !== undefined) updateData.min_purchase = parseFloat(promoData.minPurchase);
    if (promoData.maxDiscount !== undefined) updateData.max_discount = promoData.maxDiscount ? parseFloat(promoData.maxDiscount) : null;
    if (promoData.active !== undefined) updateData.active = promoData.active;
    if (promoData.validFrom !== undefined) updateData.valid_from = promoData.validFrom || null;
    if (promoData.validUntil !== undefined) updateData.valid_until = promoData.validUntil || null;
    if (promoData.description !== undefined) updateData.description = promoData.description;

    const { error } = await supabase.from('promo_codes').update(updateData).eq('id', promoCodeId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating promo code:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePromoCode(promoCodeId) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured');
      return { success: false, error: 'Database not configured' };
    }
    const { error } = await supabase.from('promo_codes').delete().eq('id', promoCodeId);
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return { success: false, error: error.message };
  }
}
