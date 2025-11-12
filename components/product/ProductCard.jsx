import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { formatPrice, formatDiscount } from '../../utils/format';
import { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { imageSkeletonClass } from '../../utils/imageOptimization';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist: toggleWishlistContext } = useWishlist();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Show Available_Products first (variant images), then fall back to main images
  const availableProducts = product.Available_Products || [];
  const mainImages = product.images || [];
  const firstImage = availableProducts.length > 0 ? availableProducts[0] : mainImages[0];
  const imageUrl = firstImage?.thumbnails?.large?.url || firstImage?.url;

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? formatDiscount(product.price, product.salePrice) : 0;

  // Check if product is in wishlist
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    setIsTogglingWishlist(true);
    await toggleWishlistContext(product.id);
    setIsTogglingWishlist(false);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className={`absolute inset-0 ${imageSkeletonClass}`} />
          )}

          {/* Image with subtle zoom on hover */}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            quality={85}
          />

          {/* Badges Container - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <div className="bg-black text-white text-xs font-bold px-2 py-1">
                -{discountPercent}%
              </div>
            )}
            {product.isNew && (
              <div className="bg-white text-black text-xs font-bold px-2 py-1">
                NEW
              </div>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="bg-black text-white text-sm font-bold px-4 py-2">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Wishlist Button - Top Right */}
          <button
            onClick={toggleWishlist}
            disabled={isTogglingWishlist}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {inWishlist ? (
              <HeartSolidIcon className="h-5 w-5 text-black" />
            ) : (
              <HeartIcon className="h-5 w-5 text-black" />
            )}
          </button>
        </div>

        {/* Product Info - Below image */}
        <div className="space-y-2">
          {/* Category - Small, uppercase */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating and Sold Count - Single Line */}
          <div className="flex items-center gap-3 text-xs">
            {/* Star Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarSolidIcon
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(product.averageRating || 0)
                          ? 'text-black'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {(product.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-gray-400">
                  ({product.reviewCount})
                </span>
              </div>
            )}

            {/* Sold Count */}
            {product.soldCount > 0 && (
              <div className="text-gray-500">
                {product.soldCount.toLocaleString()} sold
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-black">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-black">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
