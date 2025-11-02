// Wishlist management utilities using localStorage (for guest users)

export const getLocalWishlist = () => {
  if (typeof window !== 'undefined') {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }
  return [];
};

export const saveLocalWishlist = (wishlist) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    // Dispatch custom event for wishlist updates
    window.dispatchEvent(new Event('wishlistUpdated'));
  }
};

export const addToLocalWishlist = (productId) => {
  const wishlist = getLocalWishlist();

  // Check if already in wishlist
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    saveLocalWishlist(wishlist);
  }

  return wishlist;
};

export const removeFromLocalWishlist = (productId) => {
  const wishlist = getLocalWishlist();
  const updatedWishlist = wishlist.filter(id => id !== productId);
  saveLocalWishlist(updatedWishlist);
  return updatedWishlist;
};

export const isInLocalWishlist = (productId) => {
  const wishlist = getLocalWishlist();
  return wishlist.includes(productId);
};

export const clearLocalWishlist = () => {
  saveLocalWishlist([]);
  return [];
};

export const getLocalWishlistCount = () => {
  const wishlist = getLocalWishlist();
  return wishlist.length;
};
