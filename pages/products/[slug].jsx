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

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  // Parse sizes and colors from product data
  const sizes = product.sizes || [];
  const colors = product.colors || [];

  const images = product.images || [];
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? formatDiscount(product.price, product.salePrice) : 0;
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      router.push('/cart');
    }, 500);
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

      <div className="min-h-screen bg-white">
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
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={images[selectedImage]?.url || images[selectedImage]?.thumbnails?.large?.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                    -{discountPercent}%
                  </div>
                )}
              </div>

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
              <div className="flex items-center gap-4 mb-6">
                {hasDiscount ? (
                  <>
                    <span className="text-4xl font-bold text-rose-600">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
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
                      Select Size {selectedSize && `- ${selectedSize}`}
                    </label>
                    <button className="text-sm text-rose-600 hover:text-rose-700 font-medium">
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
                            ? 'border-rose-500 bg-rose-50 text-rose-700'
                            : 'border-gray-300 hover:border-rose-300'
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
                    Select Color {selectedColor && `- ${selectedColor}`}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-rose-500 ring-2 ring-rose-200'
                            : 'border-gray-300 hover:border-rose-300'
                        }`}
                        title={color}
                      >
                        <div
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </button>
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
                  <span>Free shipping on orders over $50 in discreet packaging</span>
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

    return {
      props: {
        product,
        reviews,
        seo: {
          title: product.name,
          description: product.description,
          keywords: product.keywords || `${product.name}, ${product.category}, intimate apparel, lingerie`,
          path: `/products/${product.slug}`,
          image: product.images[0]?.url || product.images[0]?.thumbnails?.large?.url,
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}
