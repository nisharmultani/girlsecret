import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;

  const [searchQuery, setSearchQuery] = useState(q || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sort: 'featured',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Perform search
  const performSearch = async (query, currentFilters) => {
    if (!query || query.trim() === '') {
      setProducts([]);
      setResultCount(0);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        ...currentFilters,
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

  // Update search when query param changes
  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      performSearch(q, filters);
    }
  }, [q]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (searchQuery) {
      performSearch(searchQuery, newFilters);
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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for bras, panties, lingerie..."
                  className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-300 rounded-full focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Results Count */}
            {searchQuery && (
              <div className="mt-6 text-center">
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
                      ) : (
                        <>
                          No results found for "
                          <span className="font-semibold">{searchQuery}</span>"
                        </>
                      )}
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
              {/* Filters Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <FunnelIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  <div
                    className={`space-y-6 ${
                      showFilters ? 'block' : 'hidden lg:block'
                    }`}
                  >
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) =>
                          handleFilterChange('category', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="all">All Categories</option>
                        <option value="Bras">Bras</option>
                        <option value="Panties">Panties</option>
                        <option value="Lingerie">Lingerie</option>
                        <option value="Sleepwear">Sleepwear</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice}
                          onChange={(e) =>
                            handleFilterChange('minPrice', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          min="0"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            handleFilterChange('maxPrice', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sort}
                        onChange={(e) =>
                          handleFilterChange('sort', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setFilters({
                          category: 'all',
                          minPrice: '',
                          maxPrice: '',
                          sort: 'featured',
                        });
                        if (searchQuery) {
                          performSearch(searchQuery, {
                            category: 'all',
                            minPrice: '',
                            maxPrice: '',
                            sort: 'featured',
                          });
                        }
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
                  </div>
                ) : products.length > 0 ? (
                  <ProductGrid products={products} />
                ) : searchQuery ? (
                  <div className="text-center py-20">
                    <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No products found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Start searching
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Enter a search term to find products
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
