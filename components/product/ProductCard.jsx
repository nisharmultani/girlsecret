import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid';
import { formatPrice, formatDiscount } from '../../utils/format';
import { addToCart } from '../../lib/cart';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const imageUrl = product.images[0]?.thumbnails?.large?.url || product.images[0]?.url;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? formatDiscount(product.price, product.salePrice) : 0;

  // Parse sizes and colors from product data
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const displaySizes = sizes.slice(0, 5); // Show first 5 sizes
  const displayColors = colors.slice(0, 8).map(color => {
    if (color.includes('-')) {
      const [name, hex] = color.split('-');
      return { name: name.trim(), hex: hex.trim() };
    }
    // If only hex code, try to guess name or use hex
    return { name: color, hex: color };
  });

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group card cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={toggleWishlist}
              className="bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors"
              aria-label="Add to wishlist"
            >
              {isWishlisted ? (
                <HeartSolidIcon className="h-5 w-5 text-rose-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.inStock}
              className="bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors disabled:opacity-50"
              aria-label="Add to cart"
            >
              <ShoppingBagIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-lg font-semibold text-gray-900">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              {product.category}
            </p>
          )}

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating and Sold Count */}
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.averageRating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Sold Count - Prominent Badge */}
            {product.soldCount > 0 && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-200 rounded-full">
                <svg className="w-3 h-3 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-rose-600">
                  {product.soldCount}
                </span>
              </div>
            )}
          </div>

          {/* Sizes - More compact */}
          {displaySizes.length > 0 && (
            <div className="mb-2">
              <div className="flex flex-wrap gap-1">
                {displaySizes.slice(0, 3).map((size, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 text-xs border border-gray-300 rounded text-gray-600"
                  >
                    {size}
                  </span>
                ))}
                {sizes.length > 3 && (
                  <span className="px-1.5 py-0.5 text-xs text-gray-500">
                    +{sizes.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Colors - More compact */}
          {displayColors.length > 0 && (
            <div className="mb-2">
              <div className="flex gap-1">
                {displayColors.slice(0, 5).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex  }}
                    title={color.name}
                  />
                ))}
                {colors.length > 5 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{colors.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-rose-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button (visible on mobile) */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className="mt-4 w-full btn-primary lg:hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
}
