import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  UserIcon,
  ShoppingBagIcon,
  MapPinIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Account() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?returnUrl=/account');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    {
      title: 'My Orders',
      description: 'View and track your orders',
      href: '/account/orders',
      icon: ShoppingBagIcon,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Saved Addresses',
      description: 'Manage your delivery addresses',
      href: '/account/addresses',
      icon: MapPinIcon,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Account Settings',
      description: 'Update your personal information',
      href: '/account/settings',
      icon: Cog6ToothIcon,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your account and view your orders
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-luxury-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-luxury-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div className={`${item.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/shop"
              className="btn-secondary text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="btn-secondary text-center"
            >
              Track Orders
            </Link>
            <Link
              href="/account/addresses"
              className="btn-secondary text-center"
            >
              Manage Addresses
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 bg-luxury-50 rounded-2xl p-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
            )}
          </div>
          <div className="mt-6">
            <Link
              href="/account/settings"
              className="text-luxury-600 hover:text-luxury-700 font-medium text-sm"
            >
              Edit account information →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      seo: {
        title: 'My Account',
        description: 'Manage your GirlSecret UK account, view orders, and update your information.',
        path: '/account',
      },
    },
  };
}
