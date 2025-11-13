import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { formatPrice, formatDiscount } from '../../utils/format';
import { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { imageSkeletonClass } from '../../utils/imageOptimization';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist: toggleWishlistContext } = useWishlist();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show Available_Products first (variant images), then fall back to main images
  const availableProducts = product.Available_Products || [];
  const mainImages = product.images || [];

  // Use availableProducts only if there are 2+ images, otherwise use mainImages
  // This ensures hover effect works for single-variant products with multiple images
  const allImages = availableProducts.length >= 2 ? availableProducts : mainImages;
  const firstImage = allImages[0];
  const secondImage = allImages[1]; // Second image for hover effect

  const firstImageUrl = firstImage?.thumbnails?.large?.url || firstImage?.url;
  const secondImageUrl = secondImage?.thumbnails?.large?.url || secondImage?.url;

  // Use second image on hover if available, otherwise keep first image
  const displayImageUrl = isHovered && secondImageUrl ? secondImageUrl : firstImageUrl;

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
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container - Proper cover with overflow hidden */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-3 rounded-sm">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className={`absolute inset-0 ${imageSkeletonClass}`} />
          )}

          {/* Image - covers entire area, zooms on hover */}
          <Image
            src={displayImageUrl}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-110 transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            quality={85}
          />

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges Container - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <div className="bg-black text-white text-xs font-bold px-2.5 py-1 shadow-lg">
                -{discountPercent}%
              </div>
            )}
            {product.isNew && (
              <div className="bg-white text-black text-xs font-bold px-2.5 py-1 border border-black shadow-md">
                NEW
              </div>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-black text-white text-sm font-bold px-5 py-2.5">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Wishlist Button - Top Right */}
          <button
            onClick={toggleWishlist}
            disabled={isTogglingWishlist}
            className="absolute top-2 right-2 bg-white/95 hover:bg-white p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-110"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {inWishlist ? (
              <HeartSolidIcon className="h-4 w-4 text-black" />
            ) : (
              <HeartIcon className="h-4 w-4 text-black" />
            )}
          </button>
        </div>

        {/* Product Info - Below image */}
        <div className="space-y-1.5">
          {/* Category - Small, uppercase */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating and Sold Count - Single Line */}
          <div className="flex items-center gap-2.5 text-xs min-h-[1.25rem]">
            {/* Star Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center -space-x-0.5">
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
                <span className="text-gray-700 font-semibold">
                  {(product.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-gray-400">
                  ({product.reviewCount})
                </span>
              </div>
            )}

            {/* Sold Count */}
            {product.soldCount > 0 && (
              <div className="text-gray-500 font-medium">
                {product.soldCount.toLocaleString()} sold
              </div>
            )}
          </div>

          {/* Price - Prominent and attractive */}
          <div className="flex items-baseline gap-2 pt-0.5">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-black">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-400 line-through font-normal">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-black">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
