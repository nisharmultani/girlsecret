import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { addToCart } from '../../lib/cart';
import { formatPrice } from '../../utils/format';
import { getAllProducts } from '../../lib/airtable';
import { getLocalWishlist } from '../../lib/wishlist';

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);

  useEffect(() => {
    loadWishlistProducts();
  }, [wishlistItems]);

  const loadWishlistProducts = async () => {
    try {
      setLoading(true);

      if (wishlistItems.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      // Fetch all products
      const allProducts = await getAllProducts();

      // Filter products that are in wishlist
      const productsInWishlist = allProducts.filter(product =>
        wishlistItems.includes(product.id)
      );

      setWishlistProducts(productsInWishlist);
    } catch (error) {
      console.error('Error loading wishlist products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingId(productId);
    await removeFromWishlist(productId);
    setRemovingId(null);
  };

  const handleAddToCart = async (product) => {
    setAddingToCartId(product.id);
    addToCart(product);
    setTimeout(() => {
      setAddingToCartId(null);
    }, 1000);
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach(product => {
      if (product.inStock) {
        addToCart(product);
      }
    });
  };

  if (wishlistLoading || loading) {
    return (
      <div className="min-h-screen py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title flex items-center gap-3">
              <HeartSolidIcon className="h-8 w-8 text-rose-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-2">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="btn-primary hidden md:flex items-center gap-2"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Add All to Cart
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding your favorite items to your wishlist! Click the heart icon on any product to save it for later.
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Add All Button */}
            <div className="md:hidden mb-6">
              <button
                onClick={handleAddAllToCart}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                Add All to Cart
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlistProducts.map((product) => {
                const imageUrl = product.images[0]?.thumbnails?.large?.url || product.images[0]?.url;
                const hasDiscount = product.salePrice && product.salePrice < product.price;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={removingId === product.id}
                        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all disabled:opacity-50"
                        aria-label="Remove from wishlist"
                      >
                        {removingId === product.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-rose-500 border-t-transparent rounded-full"></div>
                        ) : (
                          <XMarkIcon className="h-4 w-4 text-gray-700 hover:text-red-500 transition-colors" />
                        )}
                      </button>

                      <Link href={`/products/${product.slug}`}>
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />

                          {/* Out of Stock Overlay */}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="bg-white px-5 py-2.5 rounded-full font-bold text-gray-900 text-sm shadow-lg">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Category */}
                      {product.category && (
                        <span className="inline-block text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                          {product.category}
                        </span>
                      )}

                      {/* Name */}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 hover:text-rose-600 transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center gap-2.5 mb-5">
                        {hasDiscount ? (
                          <>
                            <span className="text-2xl font-bold text-rose-600">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCartId === product.id || !product.inStock}
                        className="mt-auto w-full py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {addingToCartId === product.id ? (
                          <>
                            <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></div>
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBagIcon className="h-5 w-5" />
                            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Continue Shopping */}
        {wishlistProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Link href="/shop" className="btn-outline inline-block">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
