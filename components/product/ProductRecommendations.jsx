import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductGrid from './ProductGrid';
import { getAllProducts, getAllReviewStats } from '../../lib/airtable';

export default function ProductRecommendations({ currentProduct, maxItems = 4 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const allProducts = await getAllProducts();
        const reviewStats = await getAllReviewStats();

        // Merge review stats with products
        const productsWithReviews = allProducts.map(product => ({
          ...product,
          averageRating: reviewStats[product.id]?.averageRating || 0,
          reviewCount: reviewStats[product.id]?.count || 0,
        }));

        // Filter out current product
        let relatedProducts = productsWithReviews.filter(
          (p) => p.id !== currentProduct.id
        );

        // Priority 1: Same category
        let sameCategoryProducts = relatedProducts.filter(
          (p) => p.category === currentProduct.category
        );

        // Priority 2: Similar price range (within 20%)
        const priceRange = {
          min: currentProduct.price * 0.8,
          max: currentProduct.price * 1.2,
        };

        sameCategoryProducts = sameCategoryProducts.map((p) => {
          const price = p.salePrice || p.price;
          const inPriceRange =
            price >= priceRange.min && price <= priceRange.max;
          return { ...p, inPriceRange };
        });

        // Sort: prioritize same category + price range, then featured
        sameCategoryProducts.sort((a, b) => {
          // First by price range match
          if (a.inPriceRange && !b.inPriceRange) return -1;
          if (!a.inPriceRange && b.inPriceRange) return 1;

          // Then by featured status
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;

          return 0;
        });

        // Take top matches
        let finalRecommendations = sameCategoryProducts.slice(0, maxItems);

        // If not enough, fill with other products
        if (finalRecommendations.length < maxItems) {
          const remaining = relatedProducts
            .filter(
              (p) =>
                !finalRecommendations.find((rec) => rec.id === p.id) &&
                p.category !== currentProduct.category
            )
            .slice(0, maxItems - finalRecommendations.length);

          finalRecommendations = [...finalRecommendations, ...remaining];
        }

        setRecommendations(finalRecommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchRecommendations();
    }
  }, [currentProduct, maxItems]);

  if (loading) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: maxItems }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse rounded-lg"
              style={{ height: '400px' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="my-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
          You May Also Like
        </h2>
        <Link
          href={`/shop?category=${currentProduct.category}`}
          className="text-rose-600 hover:text-rose-700 font-medium text-sm"
        >
          View All {currentProduct.category} →
        </Link>
      </div>
      <ProductGrid products={recommendations} />
    </div>
  );
}
