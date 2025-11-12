import { useState } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  // Search props
  searchQuery = '',
  onSearchChange,
  onSearch,
  onClearSearch,
}) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };

  const handleSearchIconClick = () => {
    if (isSearchExpanded && searchQuery) {
      // If expanded and has query, perform search
      if (onSearch) {
        onSearch();
      }
    } else {
      // Toggle expansion
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

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
            {/* Price Range - Commented out for now */}
            {/* <div className="hidden lg:flex items-center gap-1.5 text-xs">
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
            </div> */}

            {/* Expandable Search Bar */}
            <div className={`transition-all duration-300 ${isSearchExpanded ? 'w-48 md:w-64' : 'w-auto'}`}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className={`transition-all duration-300 px-2 py-1 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-black focus:border-black outline-none ${
                    isSearchExpanded ? 'w-full pr-8 opacity-100' : 'w-0 pr-0 opacity-0 border-0'
                  }`}
                />
                <button
                  type={isSearchExpanded && searchQuery ? 'submit' : 'button'}
                  onClick={handleSearchIconClick}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Search products"
                >
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-700" />
                </button>
                {isSearchExpanded && searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onClearSearch) {
                        onClearSearch();
                      }
                      setIsSearchExpanded(false);
                    }}
                    className="absolute right-7 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded transition-colors"
                    title="Clear search"
                  >
                    <XMarkIcon className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}
              </form>
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
