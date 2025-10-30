// UK Postcode lookup utilities using postcodes.io (free, no API key required)

/**
 * Lookup UK postcode and return address details
 * @param {string} postcode - UK postcode (e.g., "SW1A 1AA")
 * @returns {Promise<Object|null>} Address data or null if not found
 */
export async function lookupPostcode(postcode) {
  try {
    // Clean postcode (remove extra spaces, convert to uppercase)
    const cleanedPostcode = postcode.replace(/\s+/g, '').toUpperCase();

    // Validate basic UK postcode format
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
    if (!postcodeRegex.test(postcode)) {
      return { error: 'Invalid UK postcode format' };
    }

    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanedPostcode)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { error: 'Postcode not found' };
      }
      return { error: 'Failed to lookup postcode' };
    }

    const data = await response.json();

    if (!data.result) {
      return { error: 'No results found' };
    }

    const result = data.result;

    return {
      success: true,
      postcode: result.postcode,
      city: result.admin_district || result.parish || '',
      county: result.admin_county || '',
      region: result.region || '',
      country: result.country || 'England',
      latitude: result.latitude,
      longitude: result.longitude,
      // Additional useful fields
      parliamentary_constituency: result.parliamentary_constituency,
      european_electoral_region: result.european_electoral_region,
    };
  } catch (error) {
    console.error('Postcode lookup error:', error);
    return { error: 'Failed to lookup postcode' };
  }
}

/**
 * Autocomplete/search postcodes by partial input
 * @param {string} partial - Partial postcode (e.g., "SW1A")
 * @returns {Promise<Array>} Array of matching postcodes
 */
export async function autocompletePostcode(partial) {
  try {
    if (!partial || partial.length < 2) {
      return [];
    }

    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(partial)}/autocomplete`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Postcode autocomplete error:', error);
    return [];
  }
}

/**
 * Validate UK postcode format
 * @param {string} postcode - Postcode to validate
 * @returns {boolean} True if valid format
 */
export function isValidUKPostcode(postcode) {
  // UK postcode regex pattern
  const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
  return postcodeRegex.test(postcode);
}

/**
 * Format UK postcode (add space if missing)
 * @param {string} postcode - Postcode to format
 * @returns {string} Formatted postcode
 */
export function formatPostcode(postcode) {
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();

  // Add space before last 3 characters (e.g., SW1A1AA -> SW1A 1AA)
  if (cleaned.length >= 5) {
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
  }

  return cleaned;
}

/**
 * Lookup multiple postcodes at once (bulk lookup)
 * @param {Array<string>} postcodes - Array of postcodes
 * @returns {Promise<Array>} Array of results
 */
export async function bulkLookupPostcodes(postcodes) {
  try {
    if (!postcodes || postcodes.length === 0) {
      return [];
    }

    // API supports up to 100 postcodes per request
    const limitedPostcodes = postcodes.slice(0, 100);

    const response = await fetch('https://api.postcodes.io/postcodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postcodes: limitedPostcodes,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Bulk postcode lookup error:', error);
    return [];
  }
}
