import blurDataMap from '../lib/imageBlurData.json';

// Dynamic blur data loading for server-side
let serverBlurData = null;
if (typeof window === 'undefined') {
  try {
    const { loadBlurData } = require('../lib/blurDataStorage');
    serverBlurData = loadBlurData;
  } catch (error) {
    // Ignore on client side
  }
}

/**
 * Get optimized image path
 * @param {string} imagePath - Original image path (e.g., "/images/Image1.jpg")
 * @returns {string} - Optimized image path
 */
export function getOptimizedImagePath(imagePath) {
  if (!imagePath) return imagePath;

  // Extract filename from path
  const filename = imagePath.split('/').pop();
  const extension = filename.split('.').pop().toLowerCase();

  // Check if optimized version exists
  if (['jpg', 'jpeg', 'png'].includes(extension)) {
    // Return AVIF version (best compression, fallback handled by Next.js)
    return imagePath.replace(/\/images\/([^/]+)\.(jpg|jpeg|png)$/i, '/images/optimized/$1.avif');
  }

  return imagePath;
}

/**
 * Get blur placeholder for an image
 * @param {string} imagePath - Image path (e.g., "/images/Image1.jpg") or full URL
 * @returns {string|undefined} - Base64 blur data URL or undefined
 */
export function getBlurDataURL(imagePath) {
  if (!imagePath) return undefined;

  // Try to load from server-side blur data first (for Cloudinary/Airtable images)
  if (serverBlurData && typeof window === 'undefined') {
    const dynamicData = serverBlurData();
    const key = getImageKey(imagePath);
    if (dynamicData[key]) {
      return dynamicData[key];
    }
  }

  // Fallback to static blur data (for local images)
  const filename = imagePath.split('/').pop().split('?')[0]; // Remove query params
  return blurDataMap[filename];
}

/**
 * Get image key for blur data lookup
 * @param {string} imagePath - Image path or URL
 * @returns {string} - Key for lookup
 */
function getImageKey(imagePath) {
  // For Cloudinary URLs
  if (imagePath.includes('cloudinary.com')) {
    const match = imagePath.match(/\/([^/]+)\.(jpg|jpeg|png|webp|avif)$/i);
    if (match) {
      return match[1];
    }
  }

  // For Airtable URLs
  if (imagePath.includes('airtable')) {
    const match = imagePath.match(/\/([^/?]+)(\?|$)/);
    if (match) {
      return match[1];
    }
  }

  // For local paths
  const parts = imagePath.split('/');
  return parts[parts.length - 1].split('?')[0];
}

/**
 * Get image props for Next.js Image component with optimization
 * @param {string} imagePath - Original image path
 * @param {boolean} priority - Whether to prioritize loading
 * @returns {object} - Props to spread on Next.js Image component
 */
export function getOptimizedImageProps(imagePath, priority = false) {
  const props = {
    src: imagePath, // Next.js will automatically optimize
  };

  const blurDataURL = getBlurDataURL(imagePath);
  if (blurDataURL) {
    props.placeholder = 'blur';
    props.blurDataURL = blurDataURL;
  }

  if (priority) {
    props.priority = true;
    props.loading = 'eager';
  }

  return props;
}

/**
 * Image loading skeleton component props
 */
export const imageSkeletonClass = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

/**
 * Preload critical images (for hero, above-the-fold content)
 * @param {string[]} imagePaths - Array of image paths to preload
 */
export function preloadImages(imagePaths) {
  if (typeof window === 'undefined') return;

  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    // Add AVIF and WebP to accept header
    link.type = 'image/avif';
    document.head.appendChild(link);
  });
}
