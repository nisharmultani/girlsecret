import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { autocompletePostcode, lookupPostcode } from '../lib/postcode';

export default function PostcodeAutocomplete({
  value,
  onChange,
  onAddressFound,
  error,
  className = '',
  placeholder = 'Start typing postcode...',
  required = false,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions as user types
  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setLookupError('');

    // Only search if at least 2 characters
    if (inputValue.length >= 2) {
      setIsLoading(true);
      try {
        const results = await autocompletePostcode(inputValue);
        setSuggestions(results || []);
        setShowSuggestions(results && results.length > 0);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = async (postcode) => {
    onChange(postcode);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsLoading(true);
    setLookupError('');

    try {
      const result = await lookupPostcode(postcode);

      if (result.success) {
        // Call the callback with address details
        onAddressFound({
          postcode: result.postcode,
          city: result.city,
          county: result.county,
          country: result.country,
        });
      } else {
        setLookupError(result.error || 'Could not find address details');
      }
    } catch (error) {
      console.error('Lookup error:', error);
      setLookupError('Failed to lookup postcode');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className={`${className} pr-10`}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-luxury-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {!isLoading && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((postcode, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(postcode)}
              className="w-full text-left px-4 py-2 hover:bg-luxury-50 focus:bg-luxury-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{postcode}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {lookupError && <p className="mt-1 text-sm text-orange-600">{lookupError}</p>}

      {/* Helper Text */}
      <p className="mt-1 text-xs text-gray-500">
        Start typing your postcode to see suggestions
      </p>
    </div>
  );
}
