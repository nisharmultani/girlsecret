import fs from 'fs';
import path from 'path';

const BLUR_DATA_FILE = path.join(process.cwd(), 'lib', 'imageBlurData.json');

/**
 * Load blur data from JSON file
 * @returns {Object} - Blur data map
 */
export function loadBlurData() {
  try {
    if (fs.existsSync(BLUR_DATA_FILE)) {
      const data = fs.readFileSync(BLUR_DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error loading blur data:', error);
    return {};
  }
}

/**
 * Save blur data to JSON file
 * @param {Object} blurData - Blur data map
 */
export function saveBlurData(blurData) {
  try {
    const dir = path.dirname(BLUR_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BLUR_DATA_FILE, JSON.stringify(blurData, null, 2));
  } catch (error) {
    console.error('Error saving blur data:', error);
  }
}

/**
 * Add blur placeholder for an image URL
 * @param {string} imageUrl - Image URL (Cloudinary, Airtable, etc.)
 * @param {string} blurDataURL - Base64 blur data URL
 */
export function addBlurPlaceholder(imageUrl, blurDataURL) {
  try {
    const blurData = loadBlurData();

    // Extract filename or use full URL as key
    const key = getImageKey(imageUrl);
    blurData[key] = blurDataURL;

    saveBlurData(blurData);
  } catch (error) {
    console.error('Error adding blur placeholder:', error);
  }
}

/**
 * Add multiple blur placeholders
 * @param {Object} blurMap - Map of image URLs to blur data URLs
 */
export function addMultipleBlurPlaceholders(blurMap) {
  try {
    const blurData = loadBlurData();

    for (const [imageUrl, blurDataURL] of Object.entries(blurMap)) {
      const key = getImageKey(imageUrl);
      blurData[key] = blurDataURL;
    }

    saveBlurData(blurData);
  } catch (error) {
    console.error('Error adding multiple blur placeholders:', error);
  }
}

/**
 * Get blur placeholder for an image
 * @param {string} imageUrl - Image URL
 * @returns {string|null} - Blur data URL or null
 */
export function getBlurPlaceholder(imageUrl) {
  try {
    const blurData = loadBlurData();
    const key = getImageKey(imageUrl);
    return blurData[key] || null;
  } catch (error) {
    console.error('Error getting blur placeholder:', error);
    return null;
  }
}

/**
 * Extract a consistent key from image URL
 * @param {string} imageUrl - Image URL
 * @returns {string} - Consistent key
 */
function getImageKey(imageUrl) {
  // For Cloudinary URLs, extract public_id
  if (imageUrl.includes('cloudinary.com')) {
    const match = imageUrl.match(/\/([^/]+)\.(jpg|jpeg|png|webp|avif)$/i);
    if (match) {
      return match[1]; // Return filename without extension
    }
  }

  // For Airtable URLs
  if (imageUrl.includes('airtable')) {
    const match = imageUrl.match(/\/([^/?]+)(\?|$)/);
    if (match) {
      return match[1];
    }
  }

  // For local URLs
  const urlParts = imageUrl.split('/');
  const filename = urlParts[urlParts.length - 1].split('?')[0];
  return filename;
}

/**
 * Remove blur placeholder
 * @param {string} imageUrl - Image URL
 */
export function removeBlurPlaceholder(imageUrl) {
  try {
    const blurData = loadBlurData();
    const key = getImageKey(imageUrl);
    delete blurData[key];
    saveBlurData(blurData);
  } catch (error) {
    console.error('Error removing blur placeholder:', error);
  }
}

/**
 * Clear all blur data
 */
export function clearAllBlurData() {
  try {
    saveBlurData({});
  } catch (error) {
    console.error('Error clearing blur data:', error);
  }
}
