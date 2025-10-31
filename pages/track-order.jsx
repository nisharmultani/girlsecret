import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

export default function TrackOrder() {
  const router = useRouter();
  const { number } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (number) {
      trackOrder(number);
    }
  }, [number]);

  const onSubmit = async (data) => {
    await trackOrder(data.orderNumber);
  };

  const trackOrder = async (orderNumber) => {
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setOrder(data.order);
        // Update URL without reload
        router.push(`/track-order?number=${orderNumber}`, undefined, { shallow: true });
      } else {
        setError(data.error || 'Order not found. Please check your order number.');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <ClockIcon className="w-8 h-8" />,
      Processing: <InboxIcon className="w-8 h-8" />,
      Shipped: <TruckIcon className="w-8 h-8" />,
      Delivered: <CheckCircleIcon className="w-8 h-8" />,
      Cancelled: <XCircleIcon className="w-8 h-8" />,
    };
    return icons[status] || <ClockIcon className="w-8 h-8" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Processing: 'bg-blue-100 text-blue-800 border-blue-300',
      Shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      Delivered: 'bg-green-100 text-green-800 border-green-300',
      Cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getProgressWidth = (status) => {
    const progress = {
      Pending: '25%',
      Processing: '50%',
      Shipped: '75%',
      Delivered: '100%',
      Cancelled: '0%',
    };
    return progress[status] || '25%';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
              Track Your Order
            </h1>
            <p className="text-gray-600">
              Enter your order number to see the status and tracking details
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter your order number (e.g., ORD-123456)"
                  {...register('orderNumber', {
                    required: 'Order number is required',
                  })}
                  className="input-field w-full"
                  defaultValue={number || ''}
                />
                {errors.orderNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.orderNumber.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">
                      Order #{order.orderNumber}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-lg font-semibold">{order.status}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.status !== 'Cancelled' && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Order Progress</span>
                      <span className="text-sm text-gray-600">{getProgressWidth(order.status)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-luxury-600 to-luxury-700 h-3 rounded-full transition-all duration-500"
                        style={{ width: getProgressWidth(order.status) }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Tracking Information */}
                {order.trackingNumber && order.carrier && (
                  <div className="bg-luxury-50 border-l-4 border-luxury-600 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Tracking Information</h3>
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        <span className="font-medium">Carrier:</span> {order.carrier}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                      </p>
                    </div>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-luxury-600 hover:text-luxury-700 font-medium"
                      >
                        Track on carrier website →
                      </a>
                    )}
                  </div>
                )}

                {/* Timeline */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Timeline</h3>
                  <div className="space-y-4">
                    {order.status === 'Delivered' && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Delivered</p>
                          <p className="text-sm text-gray-600">Your order has been delivered</p>
                        </div>
                      </div>
                    )}

                    {(order.status === 'Shipped' || order.status === 'Delivered') && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <TruckIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Shipped</p>
                          <p className="text-sm text-gray-600">Your order is on the way</p>
                        </div>
                      </div>
                    )}

                    {(order.status !== 'Pending' && order.status !== 'Cancelled') && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <InboxIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Processing</p>
                          <p className="text-sm text-gray-600">Your order is being prepared</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Order Confirmed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString('en-GB')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="divide-y">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-4 flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        {item.size && (
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-gray-600">Color: {item.color}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>£{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>£{order.shippingCost.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-£{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>£{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.postcode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-luxury-50 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about your order, our customer service team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact" className="btn-primary">
                    Contact Support
                  </Link>
                  <a
                    href="mailto:support@girlsecretuk.com"
                    className="btn-secondary"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!order && !loading && !error && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Find Your Order
              </h3>
              <p className="text-gray-600">
                Enter your order number above to track your order
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'Track Your Order',
        description: 'Track your GirlSecret UK order status and delivery information.',
        path: '/track-order',
      },
    },
  };
}
