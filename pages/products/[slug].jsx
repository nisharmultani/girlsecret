import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts, getProductBySlug, getProductReviews } from '../../lib/airtable';
import { addToCart } from '../../lib/cart';
import { formatPrice, formatDiscount } from '../../utils/format';
import { generateProductSchema, generateBreadcrumbSchema } from '../../lib/seo';
import { addToRecentlyViewed } from '../../utils/recentlyViewed';
import { parseVideoUrl, getVideoThumbnail } from '../../utils/videoHelper';
import SocialShare from '../../components/ui/SocialShare';
import ReviewForm from '../../components/product/ReviewForm';
import ReviewsModal from '../../components/product/ReviewsModal';
import SizeGuideModal from '../../components/product/SizeGuideModal';
import ImageZoom from '../../components/product/ImageZoom';
import ProductRecommendations from '../../components/product/ProductRecommendations';
import RecentlyViewed from '../../components/product/RecentlyViewed';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon, HeartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useWishlist } from '../../context/WishlistContext';
import Head from 'next/head';

export default function ProductDetail({ product, reviews = [] }) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Track product view in recently viewed
  useEffect(() => {
    if (product && product.id) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  // Check wishlist after product validation
  const inWishlist = isInWishlist(product.id);

  // Parse sizes from product data (from Airtable)
  const sizes = product.sizes || [];

  // General product images (all angles, lifestyle, etc.) from "Images" column
  const generalImages = product.images || [];

  // Available product images from "Available_Products" column in Airtable
  const availableProductImages = product.Available_Products || [];

  // Parse video URLs
  const videoUrls = product.videoUrls || [];
  const parsedVideos = videoUrls.map(url => ({
    type: 'video',
    ...parseVideoUrl(url)
  })).filter(v => v.embedUrl);

  // Merge all media (videos first for prominence, then available products, then general images)
  const allMedia = [
    ...parsedVideos,
    ...availableProductImages.map(img => ({ type: 'image', ...img })),
    ...generalImages.map(img => ({ type: 'image', ...img }))
  ];

  // Keep legacy allImages for backward compatibility
  const allImages = [...availableProductImages, ...generalImages];

  // Count of available product variants
  const availableProductCount = availableProductImages.length;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const discountAmount = hasDiscount ? product.price - product.salePrice : 0;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Determine stock urgency for dropshipping (without showing exact numbers)
  const getStockUrgency = () => {
    if (!product.inStock) return null;

    // Different urgency levels based on sold count and product attributes
    if (product.soldCount > 100) {
      return {
        level: 'high',
        icon: '🔥',
        message: 'Trending! High Demand - Order Now',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200'
      };
    } else if (product.soldCount > 50) {
      return {
        level: 'medium',
        icon: '⚡',
        message: 'Selling Fast - Limited Availability',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200'
      };
    } else if (product.featured || hasDiscount) {
      return {
        level: 'medium',
        icon: '⭐',
        message: 'Popular Choice - Order Soon',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200'
      };
    } else if (product.soldCount > 10) {
      return {
        level: 'low',
        icon: '📦',
        message: 'In Stock - Ready to Ship',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      };
    }

    return null;
  };

  const stockUrgency = getStockUrgency();

  // Handle available product image selection
  const handleAvailableProductClick = (index) => {
    // Available products are now first in the array
    setSelectedImage(index);
  };

  // Add to Cart - directly adds current selection
  const handleAddToCart = () => {
    // Validate size selection if sizes are available
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    // Get the currently selected image URL
    const currentImage = allImages[selectedImage];
    const selectedImageUrl = currentImage?.url || currentImage?.thumbnails?.large?.url || '';

    setIsAdding(true);
    addToCart(product, 1, selectedSize || null, null, selectedImageUrl);
    setTimeout(() => {
      setIsAdding(false);
      router.push('/cart');
    }, 500);
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://girlsecret.com');
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const productImage = allImages[0]?.url || allImages[0]?.thumbnails?.large?.url || '';

  return (
    <>
      <Head>
        {/* Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductSchema(product)),
          }}
        />
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateBreadcrumbSchema([
                { name: 'Home', url: baseUrl },
                { name: 'Shop', url: `${baseUrl}/shop` },
                { name: product.name, url: productUrl },
              ])
            ),
          }}
        />
      </Head>

      <div className="min-h-screen bg-white pb-24 lg:pb-0">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex text-sm overflow-hidden">
            <Link href="/" className="text-gray-500 hover:text-gray-700 flex-shrink-0">Home</Link>
            <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-gray-700 flex-shrink-0">Shop</Link>
            <span className="mx-2 text-gray-400 flex-shrink-0">/</span>
            <span className="text-gray-900 truncate" title={product.name}>{product.name}</span>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Media Gallery - AliExpress style with thumbnails on left */}
            <div className="flex gap-4">
              {/* Thumbnails - Left Side with scroll */}
              {allMedia.length > 1 && (
                <div className="flex flex-col gap-3 w-20 flex-shrink-0 max-h-[600px] overflow-y-auto pr-1" style={{scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6'}}>
                  {allMedia.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === index
                          ? 'ring-2 ring-rose-500 border-rose-500 shadow-lg'
                          : 'border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      {media.type === 'video' ? (
                        // Video thumbnail
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          {getVideoThumbnail(media) ? (
                            <Image
                              src={getVideoThumbnail(media)}
                              alt={`Video ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        // Image thumbnail
                        <Image
                          src={media.thumbnails?.large?.url || media.url}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Display - Right Side */}
              <div className="flex-1 space-y-4">
                {allMedia[selectedImage]?.type === 'video' ? (
                  // Video Player
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={allMedia[selectedImage].embedUrl}
                      title="Product video"
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-full text-lg font-bold z-10">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                ) : (
                  // Image Zoom
                  <ImageZoom
                    src={allMedia[selectedImage]?.url || allMedia[selectedImage]?.thumbnails?.large?.url}
                    alt={product.name}
                    priority
                  >
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                        -{discountPercent}%
                      </div>
                    )}
                  </ImageZoom>
                )}

                {/* Trust Badges Below Gallery */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Discreet Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {product.category && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.category}
                </p>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating and Sold Count */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {/* Star Rating */}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        star <= Math.round(averageRating) ? (
                          <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                        ) : (
                          <StarOutlineIcon key={star} className="h-5 w-5 text-gray-300" />
                        )
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}

                {/* Sold Count - Clean Badge */}
                {product.soldCount > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">
                      {product.soldCount.toLocaleString()} sold
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-4xl font-bold text-rose-600">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-2xl text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-800">
                        SAVE {discountPercent}%
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-sm text-rose-600 mt-2">
                    You save {formatPrice(discountAmount)} on this item!
                  </p>
                )}
              </div>

              {/* Stock Urgency Indicator */}
              {stockUrgency && (
                <div className={`mb-6 ${stockUrgency.bgColor} ${stockUrgency.borderColor} border-2 rounded-lg p-4 animate-pulse`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{stockUrgency.icon}</span>
                    <div className="flex-1">
                      <p className={`${stockUrgency.textColor} font-bold text-base`}>
                        {stockUrgency.message}
                      </p>
                      {stockUrgency.level === 'high' && (
                        <p className="text-xs text-gray-600 mt-1">
                          This item is in high demand. Don't miss out!
                        </p>
                      )}
                    </div>
                    <svg className={`w-5 h-5 ${stockUrgency.textColor} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <p className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                  {product.description}
                </p>
                {product.description && product.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-rose-600 hover:text-rose-700 font-medium text-sm mt-2 inline-flex items-center gap-1"
                  >
                    {showFullDescription ? (
                      <>
                        Show Less
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Read More
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Product Specifications */}
              {product.specifications && (
                <div className="mb-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Product Specifications
                  </h3>
                  <div className="space-y-2">
                    {product.specifications.split('\n').filter(line => line.trim()).map((spec, index) => {
                      const parts = spec.split(':');
                      if (parts.length === 2) {
                        return (
                          <div key={index} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0">
                            <span className="text-sm font-medium text-gray-700 flex-shrink-0 mr-4">
                              {parts[0].trim()}
                            </span>
                            <span className="text-sm text-gray-600 text-right">
                              {parts[1].trim()}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div key={index} className="py-1">
                          <span className="text-sm text-gray-700">{spec}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900">
                      Select Size {selectedSize && <span className="text-rose-600">: {selectedSize}</span>}
                    </label>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                      type="button"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-md'
                            : 'border-gray-300 hover:border-rose-300 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Products Section */}
              {availableProductCount > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-900 mb-3 block">
                    Available Products ({availableProductCount})
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableProductImages.map((image, index) => {
                      const imageUrl = image.url || image.thumbnails?.large?.url;
                      const isSelected = selectedImage === index;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAvailableProductClick(index)}
                          className={`relative group overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                            isSelected
                              ? 'border-rose-500 ring-2 ring-rose-200 shadow-lg scale-105'
                              : 'border-gray-300 hover:border-rose-300'
                          }`}
                          type="button"
                          title={`Available product ${index + 1}`}
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={imageUrl}
                              alt={`Available product ${index + 1}`}
                              fill
                              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              className="object-cover"
                            />
                            {/* Selected Checkmark */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-rose-500 bg-opacity-20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBagIcon className="w-5 h-5 inline mr-2" />
                  {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <button
                  onClick={async () => {
                    setIsTogglingWishlist(true);
                    await toggleWishlist(product.id);
                    setIsTogglingWishlist(false);
                  }}
                  disabled={isTogglingWishlist}
                  className="btn-secondary px-4 disabled:opacity-50"
                  title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {inWishlist ? (
                    <HeartSolidIcon className="w-6 h-6 text-rose-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6 border-t border-b border-gray-200 py-6">
                <div className="flex items-start gap-3 text-gray-700">
                  <TruckIcon className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Free shipping on orders over £50</div>
                    <div className="text-sm text-gray-600">Ships in plain, unmarked packaging for your privacy</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <ShieldCheckIcon className="w-6 h-6 text-rose-500" />
                  <span>Easy exchanges & 30-day returns</span>
                </div>
              </div>

              {/* Social Share */}
              <SocialShare
                url={productUrl}
                title={product.name}
                description={product.description}
                image={productImage}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold">Customer Reviews</h2>
              {reviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-2"
                >
                  View All {reviews.length} Reviews
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {reviews.length > 0 ? (
              <>
                <div className="space-y-6 mb-8">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold">
                            {review.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{review.name}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_At).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                star <= review.rating ? (
                                  <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                                ) : (
                                  <StarOutlineIcon key={star} className="h-4 w-4 text-gray-300" />
                                )
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-3">
                          {review.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                              <Image
                                src={image.url || image.thumbnails?.large?.url}
                                alt={`Review image ${index + 1}`}
                                fill
                                sizes="(max-width: 640px) 16vw, 12vw"
                                className="object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                                onClick={() => window.open(image.url, '_blank')}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Review Comment */}
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="w-full btn-secondary mb-6"
                  >
                    Show All {reviews.length} Reviews
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-600 mb-8">No reviews yet. Be the first to review!</p>
            )}

            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-secondary"
              >
                Write a Review
              </button>
            )}

            {showReviewForm && (
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
                <ReviewForm
                  productId={product.id}
                  onSubmitSuccess={() => setShowReviewForm(false)}
                />
              </div>
            )}
          </div>

          {/* Product Recommendations */}
          <ProductRecommendations currentProduct={product} maxItems={4} />

          {/* Recently Viewed Products */}
          <RecentlyViewed currentProductId={product.id} maxItems={6} />
        </div>

        {/* Size Guide Modal */}
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          category={product.category}
        />

        {/* Reviews Modal */}
        <ReviewsModal
          isOpen={showAllReviews}
          onClose={() => setShowAllReviews(false)}
          reviews={reviews}
          averageRating={averageRating}
          productName={product.name}
        />

        {/* Mobile Sticky Add to Cart Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Price */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
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
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={async () => {
                  setIsTogglingWishlist(true);
                  await toggleWishlist(product.id);
                  setIsTogglingWishlist(false);
                }}
                disabled={isTogglingWishlist}
                className="flex-shrink-0 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist ? (
                  <HeartSolidIcon className="w-6 h-6 text-rose-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const products = await getAllProducts();
    const paths = products.map(product => ({
      params: { slug: product.slug },
    }));

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const product = await getProductBySlug(params.slug);

    if (!product) {
      return { notFound: true };
    }

    const reviews = await getProductReviews(product.id);

    // Ensure image URL is a string or empty string to avoid serialization errors
    const imageUrl = product.images?.[0]?.url
      || product.images?.[0]?.thumbnails?.large?.url
      || '';

    return {
      props: {
        product,
        reviews,
        seo: {
          title: product.name,
          description: product.description,
          keywords: product.keywords || `${product.name}, ${product.category}, intimate apparel, lingerie`,
          path: `/products/${product.slug}`,
          image: imageUrl,
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}
