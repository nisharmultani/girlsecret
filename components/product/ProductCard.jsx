import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon } from '@heroicons/react/24/solid';
import { formatPrice, formatDiscount } from '../../utils/format';
import { addToCart } from '../../lib/cart';
import { useState, useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { imageSkeletonClass } from '../../utils/imageOptimization';
import Badge, { DiscountBadge, BadgeContainer } from '../ui/Badge';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist: toggleWishlistContext } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Determine product badges
  const isNew = product.isNew || (product.createdTime && new Date(product.createdTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const isHot = product.isHot || (product.soldCount && product.soldCount > 100);
  const isTrending = product.isTrending || (product.averageRating >= 4.5 && product.reviewCount > 50);
  const isLimited = product.isLimited || (product.stock && product.stock < 10 && product.stock > 0);

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group card cursor-pointer h-full flex flex-col relative">
        {/* Image Container with Zoom */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className={`absolute inset-0 ${imageSkeletonClass}`} />
          )}

          {/* Premium Image with Zoom Effect */}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-[1.15] transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            quality={85}
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges Container - Top Left */}
          <BadgeContainer className="absolute top-3 left-3 z-10">
            {isNew && <Badge type="new" />}
            {isHot && <Badge type="hot" />}
            {isTrending && <Badge type="trending" />}
            {isLimited && <Badge type="limited" />}
            {hasDiscount && <DiscountBadge percent={discountPercent} />}
          </BadgeContainer>

          {/* Premium Quick Actions - Top Right */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={toggleWishlist}
              disabled={isTogglingWishlist}
              className="glass bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-xl hover:shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-50"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {inWishlist ? (
                <HeartSolidIcon className="h-5 w-5 text-rose-500 animate-pulse" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.inStock}
              className="glass bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-xl hover:shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 disabled:opacity-50"
              aria-label="Add to cart"
            >
              <ShoppingBagIcon className="h-5 w-5 text-gray-700" />
            </button>

            <button
              className="glass bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-xl hover:shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300"
              aria-label="Quick view"
            >
              <EyeIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Out of Stock Overlay - Premium */}
          {!product.inStock && (
            <div className="absolute inset-0 glass-dark flex items-center justify-center z-20">
              <div className="glass bg-white/95 px-6 py-3 rounded-2xl font-bold text-gray-900 shadow-2xl border-2 border-white">
                <Badge type="sold-out" />
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category Badge */}
          {product.category && (
            <div className="inline-flex items-center self-start mb-3">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
                {product.category}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Premium Rating and Social Proof */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Star Rating with Glow */}
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-3.5 w-3.5 -ml-0.5 first:ml-0 ${
                      star <= Math.round(product.averageRating || 0)
                        ? 'text-amber-400 drop-shadow-sm'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">
                {product.reviewCount || 0}
              </span>
            </div>

            {/* Sold Count Badge */}
            {product.soldCount > 0 && (
              <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-bold text-green-700">
                  {product.soldCount.toLocaleString()} sold
                </span>
              </div>
            )}
          </div>

          {/* Sizes Info - Simple */}
          {sizes.length > 0 && (
            <div className="mb-3 text-sm text-gray-600">
              <span className="font-medium">Available sizes: </span>
              <span>{sizes.join(', ')}</span>
            </div>
          )}

          {/* Premium Price with Gradient */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            {hasDiscount ? (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-base text-gray-400 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-black text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Premium Add to Cart Button (visible on mobile) */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className="mt-4 w-full btn-blush lg:hidden disabled:opacity-50 disabled:cursor-not-allowed text-base font-bold py-3.5 shadow-xl"
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Added!
              </span>
            ) : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
}
