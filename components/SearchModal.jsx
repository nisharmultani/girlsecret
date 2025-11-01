import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fetch suggestions with debounce
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.success) {
        // Limit to 5 suggestions
        setSuggestions(data.results.slice(0, 5));
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
      setQuery('');
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    router.push(`/products/${product.slug}`);
    onClose();
    setQuery('');
    setSuggestions([]);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return '/images/placeholder-product.png';
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Search Input */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-6 top-6 h-6 w-6 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleInputChange}
                      className="w-full border-0 bg-transparent pl-16 pr-16 py-6 text-lg text-gray-900 placeholder-gray-400 focus:ring-0 outline-none"
                      placeholder="Search for products..."
                    />
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Suggestions */}
                <div className="max-h-96 overflow-y-auto p-4">
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                    </div>
                  )}

                  {!loading && showSuggestions && suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Products
                      </p>
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            {product.salePrice ? (
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-rose-600">
                                  {formatPrice(product.salePrice)}
                                </p>
                                <p className="text-xs text-gray-400 line-through">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm font-semibold text-gray-900">
                                {formatPrice(product.price)}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}

                      {/* View All Results */}
                      {suggestions.length > 0 && (
                        <button
                          onClick={handleSearch}
                          className="w-full mt-2 px-4 py-3 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          View all results for "{query}"
                        </button>
                      )}
                    </div>
                  )}

                  {!loading && showSuggestions && suggestions.length === 0 && query.length >= 2 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No products found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try a different search term
                      </p>
                    </div>
                  )}

                  {!loading && !showSuggestions && query.length === 0 && (
                    <div className="text-center py-8">
                      <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-gray-500">
                        Start typing to search
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        <span className="text-xs text-gray-400">
                          Popular searches:
                        </span>
                        {['Bras', 'Panties', 'Lingerie', 'Sleepwear'].map(
                          (term) => (
                            <button
                              key={term}
                              onClick={() => {
                                setQuery(term);
                                fetchSuggestions(term);
                              }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
                            >
                              {term}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Press Enter to search</span>
                    <span>ESC to close</span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
