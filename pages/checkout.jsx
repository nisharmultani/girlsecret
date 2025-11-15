import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getCart, getCartTotal, clearCart } from '../lib/cart';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import PostcodeAutocomplete from '../components/PostcodeAutocomplete';
import { getActiveReferralCode } from '../lib/referral-tracking';
import { useReferral } from '../hooks/useReferral';

export default function Checkout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { influencerName, referralCode: activeReferralCode } = useReferral();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [createAccount, setCreateAccount] = useState(false); // For guest account creation

  // User addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(!isAuthenticated);
  const [saveAddress, setSaveAddress] = useState(false);
  const [postcodeValue, setPostcodeValue] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // Format card number with spaces (4-4-4-4)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setValue('cardNumber', formatted.replace(/\s/g, ''));
  };

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      router.push('/cart');
    }
    setCart(cartItems);
  }, [router]);

  // Fetch saved addresses if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAddresses();
      // Pre-fill contact info
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('email', user.email);
      setValue('phone', user.phone || '');
    }
  }, [isAuthenticated, user, setValue]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`/api/user/addresses?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setSavedAddresses(data.addresses);
        // Auto-select default address if exists
        const defaultAddr = data.addresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          selectAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const selectAddress = (address) => {
    setSelectedAddressId(address.id);
    setValue('addressLine1', address.addressLine1);
    setValue('addressLine2', address.addressLine2 || '');
    setValue('city', address.city);
    setValue('postcode', address.postcode);
    setValue('country', address.country || 'United Kingdom');
    setShowAddressForm(false);
  };

  const handleAddressChange = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);

    if (addressId === 'new') {
      setShowAddressForm(true);
      // Clear address fields
      setValue('addressLine1', '');
      setValue('addressLine2', '');
      setValue('city', '');
      setValue('postcode', '');
      setValue('country', 'United Kingdom');
    } else if (addressId) {
      const address = savedAddresses.find(addr => addr.id === addressId);
      if (address) {
        selectAddress(address);
      }
    }
  };

  const handlePostcodeSelect = (addressData) => {
    // Auto-fill city, postcode, and country when address is found
    setValue('city', addressData.city);
    setValue('postcode', addressData.postcode);
    setValue('country', addressData.country);
    setPostcodeValue(addressData.postcode);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 4.95; // Updated to GBP
  const total = subtotal + shipping;

  const onSubmit = async (data) => {
    setIsProcessing(true);

    // Validate address is provided
    if (!data.addressLine1 || !data.city || !data.postcode || !data.country) {
      alert('Please provide a complete shipping address');
      setIsProcessing(false);
      return;
    }

    try {
      // Get active referral code if any
      const referralCode = getActiveReferralCode();

      // Prepare order data
      const orderData = {
        items: cart,
        subtotal: subtotal,
        shippingCost: shipping,
        discount: 0,
        total: total,
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        shippingAddress: {
          fullName: `${data.firstName} ${data.lastName}`,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || '',
          city: data.city,
          postcode: data.postcode,
          country: data.country || 'United Kingdom',
          phone: data.phone,
        },
        billingAddress: {
          fullName: `${data.firstName} ${data.lastName}`,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || '',
          city: data.city,
          postcode: data.postcode,
          country: data.country || 'United Kingdom',
        },
      };

      // Add referral code if present
      if (referralCode) {
        orderData.referralCode = referralCode;
      }

      // Handle order creation for both logged-in and guest users
      if (isAuthenticated && user) {
        // Logged-in user checkout
        const response = await fetch('/api/user/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            orderData: orderData,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setOrderNumber(result.order.orderNumber);

          // Save address if checkbox is checked
          if (saveAddress && selectedAddressId === 'new') {
            await fetch('/api/user/addresses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                addressData: {
                  label: 'Home',
                  fullName: `${data.firstName} ${data.lastName}`,
                  addressLine1: data.addressLine1,
                  addressLine2: data.addressLine2 || '',
                  city: data.city,
                  postcode: data.postcode,
                  country: data.country || 'United Kingdom',
                  phone: data.phone,
                  isDefault: savedAddresses.length === 0,
                },
              }),
            });
          }
        }
      } else {
        // Guest checkout - create order with guest email as userId
        const guestUserId = `guest_${data.email}`;

        const response = await fetch('/api/user/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: guestUserId,
            orderData: orderData,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setOrderNumber(result.order.orderNumber);

          // If guest wants to create an account, do it now
          if (createAccount && data.password) {
            try {
              const registerResponse = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: data.email,
                  password: data.password,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  phone: data.phone || '',
                }),
              });

              if (registerResponse.ok) {
                // Account created - they can log in later
                console.log('Account created successfully');
              }
            } catch (error) {
              console.error('Failed to create account:', error);
              // Don't fail the order if account creation fails
            }
          }
        }
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart
      clearCart();

      // Show success
      setOrderComplete(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        if (isAuthenticated) {
          router.push('/account/orders');
        } else {
          router.push('/');
        }
      }, 5000);
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Order processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          {orderNumber && (
            <div className="bg-luxury-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-lg font-semibold text-luxury-700">{orderNumber}</p>
            </div>
          )}
          <p className="text-sm text-gray-600 mb-4">
            You will receive an order confirmation email shortly.
          </p>
          {createAccount && !isAuthenticated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800 font-medium">
                ✅ Account created successfully!
              </p>
              <p className="text-xs text-green-700 mt-1">
                You can now log in to track your order
              </p>
            </div>
          )}
          {isAuthenticated ? (
            <Link href="/account/orders" className="btn-primary inline-block">
              View My Orders
            </Link>
          ) : createAccount ? (
            <Link href="/login" className="btn-primary inline-block">
              Log In to Track Order
            </Link>
          ) : (
            <p className="text-sm text-gray-500">Redirecting to homepage...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Checkout</h1>
          {!isAuthenticated && (
            <p className="mt-2 text-gray-600">
              Already have an account?{' '}
              <Link href="/login?returnUrl=/checkout" className="text-luxury-600 hover:text-luxury-700 font-medium">
                Sign in
              </Link>
              {' '}for faster checkout
            </p>
          )}
        </div>

        {/* Referral Banner for Guest Users */}
        {!isAuthenticated && influencerName && activeReferralCode && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-purple-900">
              🎉 You&apos;re shopping through {influencerName}&apos;s link!
            </p>
            <p className="text-xs text-purple-700 mt-1">
              Create an account to track your order and never miss exclusive offers from your favorite influencers
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="input-field"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="input-field"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="input-field"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone is required' })}
                      className="input-field"
                      placeholder="+44 20 1234 5678"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Create Account Option for Guests */}
                  {!isAuthenticated && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="bg-luxury-50 rounded-lg p-4">
                        <div className="flex items-start">
                          <input
                            id="createAccount"
                            type="checkbox"
                            checked={createAccount}
                            onChange={(e) => setCreateAccount(e.target.checked)}
                            className="w-4 h-4 mt-1 border border-gray-300 rounded bg-white focus:ring-3 focus:ring-luxury-300"
                          />
                          <label htmlFor="createAccount" className="ml-3">
                            <span className="text-sm font-medium text-gray-900">
                              Create an account to track your order
                            </span>
                            <p className="text-xs text-gray-600 mt-1">
                              Get order updates, faster checkout next time, and exclusive offers
                            </p>
                          </label>
                        </div>

                        {createAccount && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Create Password *
                            </label>
                            <input
                              type="password"
                              {...register('password', {
                                required: createAccount ? 'Password is required' : false,
                                minLength: {
                                  value: 6,
                                  message: 'Password must be at least 6 characters',
                                },
                              })}
                              className="input-field"
                              placeholder="Minimum 6 characters"
                            />
                            {errors.password && (
                              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                    <p className="text-sm text-gray-600">Where should we deliver your order?</p>
                  </div>
                </div>

                {/* Saved Addresses Dropdown */}
                {isAuthenticated && savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Saved Address *
                    </label>
                    <select
                      value={selectedAddressId}
                      onChange={handleAddressChange}
                      className="input-field"
                    >
                      <option value="">Choose an address...</option>
                      {savedAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.label} - {address.addressLine1}, {address.city}, {address.postcode}
                          {address.isDefault && ' (Default)'}
                        </option>
                      ))}
                      <option value="new">+ Add New Address</option>
                    </select>
                  </div>
                )}

                {/* Or add new address button for logged-in users without addresses */}
                {isAuthenticated && savedAddresses.length === 0 && !showAddressForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full mb-6 px-6 py-4 bg-black/5 hover:bg-black/10 border-2 border-dashed border-gray-300 hover:border-black rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <MapPinIcon className="w-5 h-5" />
                    Add Shipping Address
                  </button>
                )}

                {/* Address Form */}
                {(showAddressForm || !isAuthenticated) && (
                  <div className="space-y-4 p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        {...register('addressLine1', { required: 'Address is required' })}
                        className="input-field"
                        placeholder="Street address"
                      />
                      {errors.addressLine1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        {...register('addressLine2')}
                        className="input-field"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postcode *
                      </label>
                      <input type="hidden" {...register('postcode', { required: 'Postcode is required' })} value={postcodeValue} />
                      <PostcodeAutocomplete
                        value={postcodeValue}
                        onChange={setPostcodeValue}
                        onAddressFound={handlePostcodeSelect}
                        error={errors.postcode?.message}
                        className="input-field w-full"
                        placeholder="Start typing postcode (e.g., SW1A)"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register('city', { required: 'City is required' })}
                        className="input-field"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        {...register('country', { required: 'Country is required' })}
                        className="input-field"
                        defaultValue="United Kingdom"
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                      )}
                    </div>

                    {/* Save Address Checkbox for logged-in users with new address */}
                    {isAuthenticated && selectedAddressId === 'new' && (
                      <div className="flex items-center pt-2">
                        <input
                          id="saveAddress"
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-luxury-300"
                        />
                        <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-600">
                          Save this address to my account
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {!showAddressForm && selectedAddressId && selectedAddressId !== 'new' && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="text-luxury-600 hover:text-luxury-700 text-sm font-medium"
                  >
                    Edit address
                  </button>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode:</strong> This is a demonstration. In production, integrate with Stripe, PayPal, or other secure payment gateways.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      className="input-field"
                    />
                    <input type="hidden" {...register('cardNumber', { required: 'Card number is required' })} />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        {...register('expiry', { required: 'Expiry date is required' })}
                        className="input-field"
                      />
                      {errors.expiry && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiry.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        {...register('cvv', { required: 'CVV is required' })}
                        className="input-field"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image && (
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-t border-b border-gray-200 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 50 && (
                    <p className="text-xs text-gray-500">
                      Spend £{(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-luxury-600">£{total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  By placing your order, you agree to our{' '}
                  <Link href="/terms" className="text-luxury-600 hover:underline">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
