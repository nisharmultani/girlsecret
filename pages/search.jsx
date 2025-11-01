import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Define common categories for search filtering
const CATEGORIES = ['Bras', 'Panties', 'Lingerie', 'Sleepwear'];

export default function Search() {
  const router = useRouter();
  const { q } = router.query;

  const [searchQuery, setSearchQuery] = useState(q || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortValue, setSortValue] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Perform search
  const performSearch = async (query, category, sort, minP, maxP) => {
    if (!query || query.trim() === '') {
      setProducts([]);
      setResultCount(0);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        category: category,
        sort: sort,
        minPrice: minP,
        maxPrice: maxP,
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.results);
        setResultCount(data.count);
      } else {
        console.error('Search failed:', data.error);
        setProducts([]);
        setResultCount(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
      setResultCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Update search when query param or filters change
  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      performSearch(q, selectedCategory, sortValue, minPrice, maxPrice);
    }
  }, [q, selectedCategory, sortValue, minPrice, maxPrice]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle price change
  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
  };

  return (
    <Layout>
      <Head>
        <title>
          {searchQuery ? `Search results for "${searchQuery}"` : 'Search'} -
          GirlSecret
        </title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Search Products
            </h1>
            <p className="text-gray-600 mb-6">
              Find the perfect bras, panties, and lingerie for you
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Results Count */}
            {searchQuery && (
              <div className="mt-4">
                <p className="text-gray-600">
                  {loading ? (
                    'Searching...'
                  ) : (
                    <>
                      {resultCount > 0 ? (
                        <>
                          Found <span className="font-semibold">{resultCount}</span>{' '}
                          {resultCount === 1 ? 'result' : 'results'} for "
                          <span className="font-semibold">{searchQuery}</span>"
                        </>
                      ) : searchQuery ? (
                        <>
                          No results found for "
                          <span className="font-semibold">{searchQuery}</span>"
                        </>
                      ) : null}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Results */}
        {searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Sidebar */}
              <FilterSidebar
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                sortValue={sortValue}
                onSortChange={setSortValue}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
                productCount={resultCount}
              />

              {/* Results */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{products.length}</span>{' '}
                    {products.length === 1 ? 'result' : 'results'}
                  </p>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Filters
                  </button>
                </div>

                {/* Products */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
                  </div>
                ) : products.length > 0 ? (
                  <ProductGrid products={products} />
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No products found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State - No Search Query */}
        {!searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Start searching
              </h3>
              <p className="text-gray-500 mb-8">
                Enter a search term above to find products
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm text-gray-500">Popular searches:</span>
                {['Bras', 'Panties', 'Lingerie', 'Sleepwear'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:border-rose-500 hover:text-rose-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
