import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function FilterBar({
  minPrice = '',
  maxPrice = '',
  onPriceChange,
  sortValue = 'featured',
  onSortChange,
  onOpenFilters,
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

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Results count */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{resultCount}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalCount}</span> products
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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
              <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                Sort by:
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

            {/* Mobile Filter Button */}
            <button
              onClick={onOpenFilters}
              className="md:hidden flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
