import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
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
        {/* Image Container - No card styling, just image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            quality={85}
          />

          {/* Discount Badge - Simple, top-left */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1">
              -{discountPercent}%
            </div>
          )}

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

        {/* Product Info - Below image, no padding container */}
        <div className="mt-3">
          {/* Category - Small, uppercase */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
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

          {/* Reviews - Optional, very subtle */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">
                ★ {(product.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
