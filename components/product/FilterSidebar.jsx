import { FunnelIcon } from '@heroicons/react/24/outline';

export default function FilterSidebar({
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  sortValue = 'featured',
  onSortChange,
  showFilters = true,
  onToggleFilters,
  productCount = 0,
}) {
  const sortOptions = [
    { name: 'Featured', value: 'featured' },
    { name: 'Price: Low to High', value: 'price-asc' },
    { name: 'Price: High to Low', value: 'price-desc' },
    { name: 'Name: A to Z', value: 'name-asc' },
    { name: 'Name: Z to A', value: 'name-desc' },
    { name: 'Newest', value: 'newest' },
  ];

  return (
    <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={onToggleFilters}
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Toggle filters"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
            <div className="space-y-2">
              <button
                onClick={() => onCategoryChange('all')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Products
                {productCount > 0 && (
                  <span className="ml-2 text-xs opacity-75">
                    ({productCount})
                  </span>
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Price Range
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Min Price (£)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => onPriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Max Price (£)
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={maxPrice}
                  onChange={(e) => onPriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              onCategoryChange('all');
              onPriceChange('min', '');
              onPriceChange('max', '');
              onSortChange('featured');
            }}
            className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
