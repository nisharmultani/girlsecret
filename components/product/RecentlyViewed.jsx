import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { getRecentlyViewed } from '../../utils/recentlyViewed';

/**
 * RecentlyViewed Component
 * Displays products that the user has recently viewed
 * Uses localStorage to persist across sessions
 */
export default function RecentlyViewed({ currentProductId = null, maxItems = 6 }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recently viewed products
    const loadRecentlyViewed = () => {
      try {
        let viewed = getRecentlyViewed(maxItems + 1); // Get one extra in case we filter current

        // Filter out the current product if provided
        if (currentProductId) {
          viewed = viewed.filter(item => item.id !== currentProductId);
        }

        // Take only maxItems after filtering
        viewed = viewed.slice(0, maxItems);

        setRecentlyViewed(viewed);
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure component is client-side
    const timer = setTimeout(loadRecentlyViewed, 100);

    return () => clearTimeout(timer);
  }, [currentProductId, maxItems]);

  // Don't render if no recently viewed products
  if (!loading && recentlyViewed.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recently Viewed
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: Math.min(maxItems, 6) }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-lg"
              style={{ height: '300px' }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 border-t border-gray-200 pt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recently Viewed
        </h2>
        <Link
          href="/shop"
          className="text-rose-600 hover:text-rose-700 font-medium text-sm"
        >
          Continue Shopping →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {recentlyViewed.map((product) => (
          <ProductCard key={product.id} product={product} compact={true} />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Your recently viewed products are stored locally and only visible to you
      </p>
    </div>
  );
}
