import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getCart, updateCartQuantity, removeFromCart, getCartTotal } from '../lib/cart';
import { formatPrice } from '../utils/format';
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

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

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsValidating(true);
    try {
      const response = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });

      const data = await response.json();

      if (data.valid) {
        setDiscount(data.discount);
        alert('Promo code applied successfully!');
      } else {
        alert(data.message || 'Invalid promo code');
        setDiscount(0);
      }
    } catch (error) {
      alert('Failed to validate promo code');
      setDiscount(0);
    } finally {
      setIsValidating(false);
    }
  };

  const subtotal = getCartTotal();
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
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
                        <p className="text-luxury-600 font-bold mt-1">
                          {formatPrice(item.price)}
                        </p>
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

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
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
