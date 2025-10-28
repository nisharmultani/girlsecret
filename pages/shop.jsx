import { useState, useEffect } from 'react';
import { getAllProducts } from '../lib/airtable';
import ProductGrid from '../components/product/ProductGrid';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon, FunnelIcon } from '@heroicons/react/24/outline';

const sortOptions = [
  { name: 'Featured', value: 'featured' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Newest', value: 'newest' },
];

export default function Shop({ products: initialProducts, categories }) {
  // const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort products
    if (selectedSort.value === 'price-asc') {
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (selectedSort.value === 'price-desc') {
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (selectedSort.value === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSort, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="section-title">Shop All Products</h1>
          <p className="section-subtitle">
            Discover our complete collection of luxury beauty and lifestyle products
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-luxury-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Products ({products.length})
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-luxury-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>

              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary flex items-center justify-center flex-1 sm:flex-initial"
                >
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filters
                </button>

                <Listbox value={selectedSort} onChange={setSelectedSort}>
                  <div className="relative flex-1 sm:flex-initial sm:w-56">
                    <Listbox.Button className="relative w-full btn-secondary cursor-pointer text-left">
                      <span className="block truncate">{selectedSort.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {sortOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 px-4 ${
                              active ? 'bg-luxury-50 text-luxury-900' : 'text-gray-900'
                            }`
                          }
                          value={option}
                        >
                          {({ selected }) => (
                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                              {option.name}
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>

            {/* Products */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const products = await getAllProducts();
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    return {
      props: {
        products,
        categories,
        seo: {
          title: 'Shop All Products',
          description: 'Browse our complete collection of luxury beauty and lifestyle products.',
          keywords: 'shop beauty products, buy cosmetics, luxury beauty store, skincare products',
          path: '/shop',
        },
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        categories: [],
        seo: { title: 'Shop', path: '/shop' },
      },
      revalidate: 60,
    };
  }
}
