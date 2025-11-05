import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid';
import { formatPrice, formatDiscount } from '../../utils/format';
import { addToCart } from '../../lib/cart';
import { useState, useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist: toggleWishlistContext } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Show Available_Products first (variant images), then fall back to main images
  // This prevents size guides or extra images from showing in card
  const availableProducts = product.Available_Products || [];
  const mainImages = product.images || [];
  const firstImage = availableProducts.length > 0 ? availableProducts[0] : mainImages[0];
  const imageUrl = firstImage?.thumbnails?.large?.url || firstImage?.url;

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? formatDiscount(product.price, product.salePrice) : 0;

  // Check if product is in wishlist
  const inWishlist = isInWishlist(product.id);

  // Parse sizes from product data
  const sizes = product.sizes || [];
  const displaySizes = sizes.slice(0, 5); // Show first 5 sizes

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    setIsTogglingWishlist(true);
    await toggleWishlistContext(product.id);
    setIsTogglingWishlist(false);
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
              disabled={isTogglingWishlist}
              className="bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors disabled:opacity-50"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {inWishlist ? (
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

            {/* Sold Count - Improved Badge with "sold" text */}
            {product.soldCount > 0 && (
              <div className="flex items-center gap-1 text-gray-600">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs font-medium">
                  {product.soldCount.toLocaleString()} sold
                </span>
              </div>
            )}
          </div>

          {/* Sizes Info */}
          {displaySizes.length > 0 && (
            <div className="mb-2 flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span>{sizes.length} size{sizes.length > 1 ? 's' : ''} available</span>
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
