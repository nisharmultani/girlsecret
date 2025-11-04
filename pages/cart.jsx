import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCart, updateCartQuantity, removeFromCart, getCartTotal } from '../lib/cart';
import { formatPrice } from '../utils/format';
import { TrashIcon, ShoppingBagIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useReferral } from '../hooks/useReferral';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [referralApplied, setReferralApplied] = useState(false);
  const { referralData, promoCode: referralPromoCode, influencerName } = useReferral();

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  // Auto-apply promo code from referral link
  useEffect(() => {
    if (referralPromoCode && !promoCode && !referralApplied) {
      setPromoCode(referralPromoCode);
      setReferralApplied(true);
      // Auto-validate the promo code
      setTimeout(() => {
        handleApplyPromo(referralPromoCode);
      }, 500);
    }
  }, [referralPromoCode, referralApplied]);

  const loadCart = () => {
    setCart(getCart());
  };

  const handleUpdateQuantity = (productId, newQuantity, size, color) => {
    updateCartQuantity(productId, newQuantity, size, color);
    loadCart();
  };

  const handleRemove = (productId, size, color) => {
    removeFromCart(productId, size, color);
    loadCart();
  };

  const handleApplyPromo = async (codeToApply = null) => {
    const code = codeToApply || promoCode;
    if (!code.trim()) return;

    setIsValidating(true);
    try {
      const response = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, subtotal }),
      });

      const data = await response.json();

      if (data.valid) {
        setDiscount(data.discount);
        // Don't show alert for auto-applied referral codes
        if (!codeToApply) {
          alert('Promo code applied successfully!');
        }
      } else {
        if (!codeToApply) {
          alert(data.message || 'Invalid promo code');
        }
        setDiscount(0);
      }
    } catch (error) {
      if (!codeToApply) {
        alert('Failed to validate promo code');
      }
      setDiscount(0);
    } finally {
      setIsValidating(false);
    }
  };

  const subtotal = getCartTotal();

  // Calculate total product savings (original price - sale price)
  const productSavings = cart.reduce((total, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return total + ((item.originalPrice - item.price) * item.quantity);
    }
    return total;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal - discount + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBagIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Link href="/shop" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {/* Referral Banner */}
        {referralApplied && influencerName && discount > 0 && (
          <div className="bg-gradient-to-r from-luxury-50 to-pink-50 border border-luxury-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-luxury-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-luxury-900">
                Special discount applied! 🎉
              </p>
              <p className="text-sm text-luxury-700">
                You&apos;re using {influencerName}&apos;s link - {formatPrice(discount)} discount applied automatically
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-luxury-600">
                            {item.name}
                          </h3>
                        </Link>
                        {/* Display size and color */}
                        {(item.size || item.color) && (
                          <div className="flex gap-2 mt-1 text-sm text-gray-600">
                            {item.size && (
                              <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
                            )}
                            {item.color && (
                              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                Color:
                                <span
                                  className="inline-block w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.color }}
                                ></span>
                                {item.color}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mt-2">
                          {item.originalPrice && item.originalPrice > item.price ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-luxury-600 font-bold text-lg">
                                  {formatPrice(item.price)}
                                </span>
                                <span className="text-gray-500 line-through text-sm">
                                  {formatPrice(item.originalPrice)}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  Save {formatPrice(item.originalPrice - item.price)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-luxury-600 font-bold text-lg">
                              {formatPrice(item.price)}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id, item.size, item.color)}
                        className="text-red-600 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-gray-600">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={isValidating}
                    className="btn-secondary disabled:opacity-50"
                  >
                    {isValidating ? 'Checking...' : 'Apply'}
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {productSavings > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 -mx-2 px-2 py-1.5 rounded">
                    <span className="font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Product Savings
                    </span>
                    <span className="font-semibold">-{formatPrice(productSavings)}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Code Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>

                {subtotal < 50 && (
                  <p className="text-sm text-gray-500">
                    Add {formatPrice(50 - subtotal)} more for free shipping!
                  </p>
                )}
              </div>

              {/* Total Savings Summary */}
              {(productSavings > 0 || discount > 0) && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800 flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Total Savings
                    </span>
                    <span className="text-lg font-bold text-green-700">
                      {formatPrice(productSavings + discount)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-rose-600">{formatPrice(total)}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full btn-primary mb-3"
              >
                Proceed to Checkout
              </button>

              <Link href="/shop" className="block w-full">
                <button className="w-full btn-secondary">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
