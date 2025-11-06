import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember: formData.remember,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save admin session
        const session = {
          user: data.admin,
          token: data.token,
          isAdmin: true,
          remember: formData.remember,
        };

        if (formData.remember) {
          localStorage.setItem('adminSession', JSON.stringify(session));
        } else {
          sessionStorage.setItem('adminSession', JSON.stringify(session));
        }

        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-luxury-100">
            <LockClosedIcon className="h-10 w-10 text-luxury-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-lg shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
              className="h-4 w-4 text-luxury-600 focus:ring-luxury-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-luxury-600 hover:text-luxury-500"
            >
              ← Back to website
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Security Notice:</strong> This is the admin login. Only authorized personnel should access this area.
            All login attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
