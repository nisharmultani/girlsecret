/**
 * Utility functions for managing recently viewed products
 * Uses localStorage to persist viewed products across sessions
 */

const STORAGE_KEY = 'girlsecret_recently_viewed';
const MAX_ITEMS = 10; // Keep track of last 10 viewed products

/**
 * Add a product to recently viewed list
 * @param {Object} product - Product object with at least id, name, slug, price, images
 */
export function addToRecentlyViewed(product) {
  if (typeof window === 'undefined') return; // Server-side guard

  try {
    // Get existing viewed products
    const existingData = localStorage.getItem(STORAGE_KEY);
    let recentlyViewed = existingData ? JSON.parse(existingData) : [];

    // Remove product if it already exists (to move it to front)
    recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);

    // Add product to front of array (most recent first)
    const firstImage = product.Available_Products?.[0] || product.images?.[0] || null;

    recentlyViewed.unshift({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      category: product.category,
      inStock: product.inStock !== false,
      images: firstImage ? [firstImage] : [], // ProductCard expects array
      Available_Products: product.Available_Products || [],
      viewedAt: new Date().toISOString()
    });

    // Keep only MAX_ITEMS most recent
    recentlyViewed = recentlyViewed.slice(0, MAX_ITEMS);

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
}

/**
 * Get all recently viewed products
 * @param {number} limit - Optional limit on number of products to return
 * @returns {Array} Array of recently viewed products
 */
export function getRecentlyViewed(limit = MAX_ITEMS) {
  if (typeof window === 'undefined') return []; // Server-side guard

  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const recentlyViewed = existingData ? JSON.parse(existingData) : [];
    return recentlyViewed.slice(0, limit);
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
}

/**
 * Remove a product from recently viewed
 * @param {string} productId - ID of product to remove
 */
export function removeFromRecentlyViewed(productId) {
  if (typeof window === 'undefined') return;

  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return;

    let recentlyViewed = JSON.parse(existingData);
    recentlyViewed = recentlyViewed.filter(item => item.id !== productId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error removing from recently viewed:', error);
  }
}

/**
 * Clear all recently viewed products
 */
export function clearRecentlyViewed() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
}
