import { useRouter } from 'next/router';
import { getCurrentAdmin, clearAdminSession } from '../../lib/adminAuth';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function AdminNavbar() {
  const router = useRouter();
  const admin = getCurrentAdmin();

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });

      // Clear session
      clearAdminSession();

      // Redirect to login
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear session anyway
      clearAdminSession();
      router.push('/admin/login');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-serif font-bold text-gray-900">
              GirlSecret Admin
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <UserCircleIcon className="h-5 w-5" />
              <span>{admin?.email || 'Admin'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
