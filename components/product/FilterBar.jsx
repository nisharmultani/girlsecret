import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function FilterBar({
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  sortValue = 'featured',
  onSortChange,
  onOpenFilters,
  onClearFilters,
  selectedCategory = 'all',
  resultCount = 0,
  totalCount = 0,
}) {
  const sortOptions = [
    { name: 'Featured', value: 'featured' },
    { name: 'Price: Low to High', value: 'price-asc' },
    { name: 'Price: High to Low', value: 'price-desc' },
    { name: 'Name: A to Z', value: 'name-asc' },
    { name: 'Name: Z to A', value: 'name-desc' },
    { name: 'Newest', value: 'newest' },
  ];

  // Calculate active filters count
  const activeFiltersCount = [
    minPrice && minPrice.length > 0,
    maxPrice && maxPrice.length > 0,
    sortValue !== 'featured',
    selectedCategory !== 'all',
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10 shadow-md backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Results count */}
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-gray-900">{resultCount}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalCount}</span> products
            </span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Price Range - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onPriceChange('min', e.target.value)}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                min="0"
                step="0.01"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => onPriceChange('max', e.target.value)}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                min="0"
                step="0.01"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">
                Sort:
              </label>
              <select
                id="sort"
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
                className="flex-1 sm:w-auto px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button - Desktop */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                Clear Filters
              </button>
            )}

            {/* Mobile Filter Button */}
            <button
              onClick={onOpenFilters}
              className="md:hidden flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors relative"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-rose-500 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
