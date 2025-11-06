import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminAuthGuard from '../../components/admin/AdminAuthGuard';
import AdminNavbar from '../../components/admin/AdminNavbar';

export default function AdminDashboard() {
  const router = useRouter();

  const dashboards = [
    {
      title: 'Order Management',
      description: 'Manage orders, update shipping status, and send customer notifications',
      icon: '📦',
      href: '/admin/orders',
      color: 'bg-blue-500'
    },
    {
      title: 'Product Management',
      description: 'Add, edit, and manage your product catalog',
      icon: '🛍️',
      href: '/admin/products',
      color: 'bg-pink-500'
    },
    {
      title: 'Referral Management',
      description: 'Manage influencer referrals and track commissions',
      icon: '💰',
      href: '/admin/referrals',
      color: 'bg-purple-500'
    },
    {
      title: 'Import Products',
      description: 'Import products from AliExpress or other sources',
      icon: '📥',
      href: '/admin/import-product',
      color: 'bg-green-500'
    }
  ];

  return (
    <AdminAuthGuard>
      <Head>
        <title>Admin Dashboard - GirlSecret</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Admin Navbar */}
        <AdminNavbar />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your e-commerce platform</p>
            <Link
              href="/"
              className="inline-flex items-center mt-4 text-luxury-600 hover:text-luxury-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Store
            </Link>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-pink-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Products</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboards.map((dashboard) => (
                <Link
                  key={dashboard.href}
                  href={dashboard.href}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className={`${dashboard.color} rounded-lg p-3 text-3xl`}>
                        {dashboard.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {dashboard.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {dashboard.description}
                        </p>
                        <div className="mt-4">
                          <span className="text-pink-600 font-medium text-sm hover:text-pink-700">
                            Open Dashboard →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity Section (Optional - can be implemented later) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-gray-500 text-center py-8">
              Activity feed coming soon...
            </p>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
