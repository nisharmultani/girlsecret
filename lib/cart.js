// Cart management utilities using localStorage

export const getCart = () => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

export const saveCart = (cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event('cartUpdated'));
  }
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      originalPrice: product.price,
      image: product.images[0]?.url || product.images[0]?.thumbnails?.large?.url || '',
      quantity: quantity,
      slug: product.slug,
    });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const applyPromoCode = (promoCode, subtotal) => {
  // This will be enhanced with Airtable validation
  if (!promoCode) return 0;

  const { discountType, discountValue, minPurchase, maxDiscount } = promoCode;

  if (subtotal < minPurchase) {
    return 0;
  }

  let discount = 0;

  if (discountType === 'percentage') {
    discount = (subtotal * discountValue) / 100;
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else if (discountType === 'fixed') {
    discount = discountValue;
  }

  return Math.min(discount, subtotal);
};
