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
    <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Results count */}
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
            <span className="hidden sm:inline">
              <span className="font-semibold text-gray-900">{resultCount}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalCount}</span>
            </span>
            <span className="sm:hidden font-semibold text-gray-900">{resultCount}</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-black text-white">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {/* Filters - Compact Layout */}
          <div className="flex items-center gap-2">
            {/* Price Range - Desktop Only - Compact */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <input
                type="number"
                placeholder="Min £"
                value={minPrice}
                onChange={(e) => onPriceChange('min', e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-black focus:border-black outline-none"
                min="0"
                step="0.01"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max £"
                value={maxPrice}
                onChange={(e) => onPriceChange('max', e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-black focus:border-black outline-none"
                min="0"
                step="0.01"
              />
            </div>

            {/* Sort - Compact */}
            <select
              id="sort"
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-2.5 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium focus:ring-1 focus:ring-black focus:border-black outline-none bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>

            {/* Clear Filters Button - Desktop - Compact */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
                title="Clear all filters"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Clear</span>
              </button>
            )}

            {/* Mobile Filter Button - Compact */}
            <button
              onClick={onOpenFilters}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors relative"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-black rounded-full">
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
