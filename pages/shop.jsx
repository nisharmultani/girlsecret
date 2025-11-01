import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getAllProducts } from '../lib/airtable';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Shop({ products: initialProducts, categories }) {
  const router = useRouter();
  const [products] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortValue, setSortValue] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort products
  useEffect(() => {
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
  }, [selectedCategory, sortValue, minPrice, maxPrice, products]);

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
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Intimate Apparel Collection
            </h1>
            <p className="text-gray-600 mb-6">
              Beautiful bras, panties, and lingerie designed for comfort and
              confidence
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
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              sortValue={sortValue}
              onSortChange={setSortValue}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              productCount={products.length}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold">{products.length}</span> products
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
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const products = await getAllProducts();
    const categories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];

    return {
      props: {
        products,
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
