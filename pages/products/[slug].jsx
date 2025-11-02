import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts, getProductBySlug, getProductReviews } from '../../lib/airtable';
import { addToCart } from '../../lib/cart';
import { formatPrice, formatDiscount } from '../../utils/format';
import { generateProductSchema, generateBreadcrumbSchema } from '../../lib/seo';
import SocialShare from '../../components/ui/SocialShare';
import ReviewForm from '../../components/product/ReviewForm';
import SizeGuideModal from '../../components/product/SizeGuideModal';
import ImageZoom from '../../components/product/ImageZoom';
import ProductRecommendations from '../../components/product/ProductRecommendations';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon, HeartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';

export default function ProductDetail({ product, reviews = [] }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]); // Store multiple variant selections

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  // Parse sizes and colors from product data (from Airtable)
  const sizes = product.sizes || [];
  const rawColors = product.colors || [];

  // Parse colors - supports formats: "ColorName-#HexCode" or just "#HexCode"
  const colors = rawColors.map(color => {
    if (color.includes('-')) {
      const [name, hex] = color.split('-');
      return { name: name.trim(), hex: hex.trim() };
    }
    // If only hex code, try to guess name or use hex
    return { name: color, hex: color };
  });

  const images = product.images || [];
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;
  const discountAmount = hasDiscount ? product.price - product.salePrice : 0;

  // Quantity-based pricing tiers for upselling
  const getQuantityPrice = (qty) => {
    const basePrice = product.salePrice || product.price;

    // Define quantity discount tiers
    if (qty >= 3) {
      return basePrice * 0.85; // 15% off for 3+
    } else if (qty >= 2) {
      return basePrice * 0.90; // 10% off for 2+
    }
    return basePrice;
  };

  const currentPrice = getQuantityPrice(quantity);
  const totalPrice = currentPrice * quantity;
  const savings = ((product.salePrice || product.price) - currentPrice) * quantity;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Add current selection to variants list
  const handleAddVariant = () => {
    // Validate size selection if sizes are available
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    // Validate color selection if colors are available
    if (colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    // Check if this variant combination already exists
    const variantExists = selectedVariants.some(
      v => v.size === selectedSize && v.color === selectedColor
    );

    if (variantExists) {
      alert('This size and color combination is already added');
      return;
    }

    // Add to variants list
    setSelectedVariants([
      ...selectedVariants,
      {
        size: selectedSize || null,
        color: selectedColor || null,
        quantity: 1,
      },
    ]);

    // Reset selections for next variant
    setSelectedSize('');
    setSelectedColor('');
  };

  // Remove a variant from the list
  const handleRemoveVariant = (index) => {
    setSelectedVariants(selectedVariants.filter((_, i) => i !== index));
  };

  // Update variant quantity
  const handleUpdateVariantQuantity = (index, newQty) => {
    const updated = [...selectedVariants];
    updated[index].quantity = Math.max(1, newQty);
    setSelectedVariants(updated);
  };

  // Add all selected variants to cart
  const handleAddToCart = () => {
    if (selectedVariants.length === 0) {
      // If no variants selected, add the current selection
      if (sizes.length > 0 && !selectedSize) {
        alert('Please select a size');
        return;
      }
      if (colors.length > 0 && !selectedColor) {
        alert('Please select a color');
        return;
      }

      setIsAdding(true);
      addToCart(product, quantity, selectedSize || null, selectedColor || null);
      setTimeout(() => {
        setIsAdding(false);
        router.push('/cart');
      }, 500);
    } else {
      // Add all variants to cart
      setIsAdding(true);
      selectedVariants.forEach(variant => {
        addToCart(product, variant.quantity, variant.size, variant.color);
      });
      setTimeout(() => {
        setIsAdding(false);
        router.push('/cart');
      }, 500);
    }
  };

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`;
  const productImage = images[0]?.url || images[0]?.thumbnails?.large?.url || '';

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
                { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL },
                { name: 'Shop', url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop` },
                { name: product.name, url: productUrl },
              ])
            ),
          }}
        />
      </Head>

      <div className="min-h-screen bg-white pb-24 lg:pb-0">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-gray-700">Shop</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <ImageZoom
                src={images[selectedImage]?.url || images[selectedImage]?.thumbnails?.large?.url}
                alt={product.name}
                priority
              >
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                    -{discountPercent}%
                  </div>
                )}
              </ImageZoom>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-rose-500' : ''
                      }`}
                    >
                      <Image
                        src={image.thumbnails?.large?.url || image.url}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.category && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.category}
                </p>
              )}

              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      star <= Math.round(averageRating) ? (
                        <StarIcon key={star} className="h-5 w-5 text-rose-400" />
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

              {/* Quantity-Based Upselling */}
              <div className="bg-gradient-to-r from-luxury-50 to-rose-50 rounded-xl p-5 mb-6 border border-luxury-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Buy More, Save More!
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Buy 1:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(product.salePrice || product.price)} each</span>
                  </div>
                  <div className="flex items-center justify-between bg-white bg-opacity-60 rounded px-2 py-1">
                    <span className="text-gray-700 flex items-center gap-1">
                      Buy 2:
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">10% OFF</span>
                    </span>
                    <span className="font-semibold text-green-700">{formatPrice(getQuantityPrice(2))} each</span>
                  </div>
                  <div className="flex items-center justify-between bg-white bg-opacity-60 rounded px-2 py-1">
                    <span className="text-gray-700 flex items-center gap-1">
                      Buy 3+:
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">15% OFF</span>
                    </span>
                    <span className="font-semibold text-green-700">{formatPrice(getQuantityPrice(3))} each</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900">
                      Size {selectedSize && <span className="text-rose-600">- {selectedSize}</span>}
                      <span className="text-gray-500 font-normal ml-2">({sizes.length} sizes available)</span>
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

              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-900 mb-3 block">
                    Color {selectedColor && <span className="text-rose-600">- {selectedColor}</span>}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.name)}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'border-rose-500 ring-4 ring-rose-200 shadow-lg'
                            : 'border-gray-300 hover:border-rose-300 hover:shadow-md'
                        }`}
                        title={color.name}
                        type="button"
                      >
                        <div
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        {selectedColor === color.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Variant Button (for selecting multiple size/color combinations) */}
              {(sizes.length > 0 || colors.length > 0) && (
                <div className="mb-6">
                  <button
                    onClick={handleAddVariant}
                    type="button"
                    className="w-full px-4 py-3 border-2 border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add This Variant (to select multiple sizes/colors)
                  </button>
                </div>
              )}

              {/* Selected Variants List */}
              {selectedVariants.length > 0 && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Selected Variants ({selectedVariants.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedVariants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-sm">
                            {variant.size && (
                              <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                                Size: <strong>{variant.size}</strong>
                              </span>
                            )}
                            {variant.color && (
                              <span className="inline-block bg-gray-100 px-2 py-1 rounded">
                                Color: <strong>{variant.color}</strong>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateVariantQuantity(index, variant.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                              type="button"
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-sm font-medium">{variant.quantity}</span>
                            <button
                              onClick={() => handleUpdateVariantQuantity(index, variant.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          type="button"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBagIcon className="w-5 h-5 inline mr-2" />
                  {isAdding ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <button className="btn-secondary px-4">
                  <HeartIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6 border-t border-b border-gray-200 py-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <TruckIcon className="w-6 h-6 text-rose-500" />
                  <span>Free shipping on orders over £50 in discreet packaging</span>
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
            <h2 className="text-3xl font-serif font-bold mb-8">Customer Reviews</h2>

            {reviews.length > 0 ? (
              <div className="space-y-6 mb-8">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            star <= review.rating ? (
                              <StarIcon key={star} className="h-5 w-5 text-rose-400" />
                            ) : (
                              <StarOutlineIcon key={star} className="h-5 w-5 text-gray-300" />
                            )
                          ))}
                        </div>
                        <span className="font-semibold">{review.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_At).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
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
        </div>

        {/* Size Guide Modal */}
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          category={product.category}
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
                {quantity > 1 && (
                  <p className="text-xs text-gray-600">
                    {quantity} items • {formatPrice(totalPrice)} total
                  </p>
                )}
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
              <button className="flex-shrink-0 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <HeartIcon className="w-6 h-6 text-gray-700" />
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
