import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getAllProducts, getAllReviewStats } from '../lib/airtable';
import ProductGrid from '../components/product/ProductGrid';
import FilterBar from '../components/product/FilterBar';
import MobileFilterDrawer from '../components/product/MobileFilterDrawer';
import { ProductGridSkeleton } from '../components/ui/SkeletonLoader';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Shop({ products: initialProducts, categories }) {
  const router = useRouter();
  const { search: urlSearch, category: urlCategory } = router.query;

  const [products] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortValue, setSortValue] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load search query and category from URL
  useEffect(() => {
    // Handle URL category parameter
    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategory(urlCategory);
    } else if (urlSearch) {
      setSearchQuery(urlSearch);

      // Auto-detect category from search query if not explicitly set
      if (!urlCategory) {
        const query = urlSearch.toLowerCase();
        if (query.includes('bra')) {
          setSelectedCategory('Bras');
        } else if (query.includes('panty') || query.includes('panties') || query.includes('underwear')) {
          setSelectedCategory('Panties');
        } else if (query.includes('lingerie')) {
          setSelectedCategory('Lingerie');
        } else if (query.includes('sleep') || query.includes('nightwear')) {
          setSelectedCategory('Sleepwear');
        } else {
          setSelectedCategory('all');
        }
      }
    } else {
      // Reset to defaults when no URL parameters
      setSelectedCategory('all');
      setSearchQuery('');
    }
  }, [urlSearch, urlCategory, categories]);

  // Perform search or filter products
  useEffect(() => {
    const performSearch = async () => {
      // If there's a search query, use the search API
      if (urlSearch && urlSearch.trim()) {
        setIsSearching(true);
        try {
          const params = new URLSearchParams({
            q: urlSearch,
            category: selectedCategory,
            sort: sortValue,
            minPrice: minPrice,
            maxPrice: maxPrice,
          });

          const response = await fetch(`/api/search?${params}`);
          const data = await response.json();

          if (data.success) {
            setFilteredProducts(data.results);
          } else {
            setFilteredProducts([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setFilteredProducts([]);
        } finally {
          setIsSearching(false);
        }
        return;
      }

      // Otherwise, filter products client-side
      let filtered = [...products];

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }

      // Filter by price range
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) {
          filtered = filtered.filter((p) => {
            const price = p.salePrice || p.price || 0;
            return price >= min;
          });
        }
      }

      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) {
          filtered = filtered.filter((p) => {
            const price = p.salePrice || p.price || 0;
            return price <= max;
          });
        }
      }

      // Sort products
      switch (sortValue) {
        case 'price-asc':
          filtered.sort((a, b) => {
            const priceA = a.salePrice || a.price || 0;
            const priceB = b.salePrice || b.price || 0;
            return priceA - priceB;
          });
          break;
        case 'price-desc':
          filtered.sort((a, b) => {
            const priceA = a.salePrice || a.price || 0;
            const priceB = b.salePrice || b.price || 0;
            return priceB - priceA;
          });
          break;
        case 'name-asc':
          filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'name-desc':
          filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          break;
        case 'newest':
          filtered.sort((a, b) => {
            const dateA = new Date(a.createdTime || 0);
            const dateB = new Date(b.createdTime || 0);
            return dateB - dateA;
          });
          break;
        case 'featured':
        default:
          filtered.sort((a, b) => {
            const aFeatured = a.featured ? 1 : 0;
            const bFeatured = b.featured ? 1 : 0;
            return bFeatured - aFeatured;
          });
      }

      setFilteredProducts(filtered);
    };

    performSearch();
  }, [urlSearch, selectedCategory, sortValue, minPrice, maxPrice, products]);

  // Handle price change
  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    router.push('/shop');
  };

  // Handle category change - if searching, clear search and filter by category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // If user is actively searching and changes category, clear the search
    // This prevents "no results" when search query doesn't match new category
    if (urlSearch) {
      router.push(category === 'all' ? '/shop' : `/shop?category=${category}`);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSortValue('featured');
    router.push('/shop');
  };

  return (
    <>
      <Head>
        <title>Shop Intimate Apparel - GirlSecret</title>
        <meta
          name="description"
          content="Browse our complete collection of beautiful bras, panties, lingerie, and intimate apparel."
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
              {urlSearch
                ? 'Search Results'
                : selectedCategory !== 'all'
                ? `${selectedCategory} Collection`
                : 'Shop Collection'}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              {urlSearch ? (
                <>
                  Showing results for &quot;<span className="font-semibold">{urlSearch}</span>&quot;
                  {selectedCategory !== 'all' && (
                    <> in <span className="font-semibold">{selectedCategory}</span></>
                  )}
                </>
              ) : selectedCategory !== 'all' ? (
                <>Shop our complete collection of {selectedCategory.toLowerCase()}</>
              ) : (
                'Beautiful bras, panties, and lingerie designed for comfort and confidence'
              )}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2.5 pl-11 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-sm md:text-base"
                />
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Clear Search/Filter Links */}
            {(urlSearch || (urlCategory && selectedCategory !== 'all')) && (
              <div className="mt-3 flex gap-4">
                {urlSearch && (
                  <button
                    onClick={clearSearch}
                    className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                  >
                    ✕ Clear search
                  </button>
                )}
                {urlCategory && selectedCategory !== 'all' && !urlSearch && (
                  <button
                    onClick={() => router.push('/shop')}
                    className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                  >
                    ✕ Show all categories
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs - Sticky */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Bar - Sticky */}
        <FilterBar
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          sortValue={sortValue}
          onSortChange={setSortValue}
          onOpenFilters={() => setShowFilters(true)}
          onClearFilters={handleClearFilters}
          selectedCategory={selectedCategory}
          resultCount={filteredProducts.length}
          totalCount={products.length}
        />

        {/* Products Grid - Full Width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isSearching ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                {urlSearch
                  ? 'Try a different search term or adjust your filters.'
                  : 'Try adjusting your filters to find what you\'re looking for.'}
              </p>
              {urlSearch && (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
                >
                  View all products
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          sortValue={sortValue}
          onSortChange={setSortValue}
          onClearFilters={handleClearFilters}
        />
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const products = await getAllProducts();
    const reviewStats = await getAllReviewStats();

    // Merge review stats with products
    const productsWithReviews = products.map(product => ({
      ...product,
      averageRating: reviewStats[product.id]?.averageRating || 0,
      reviewCount: reviewStats[product.id]?.count || 0,
    }));

    const categories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];

    return {
      props: {
        products: productsWithReviews,
        categories,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        categories: [],
      },
      revalidate: 60,
    };
  }
}
