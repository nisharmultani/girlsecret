import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Generate blur placeholder data URL from image buffer
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<string>} - Base64 blur data URL
 */
export async function generateBlurPlaceholder(imageBuffer) {
  try {
    const buffer = await sharp(imageBuffer)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();

    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error generating blur placeholder:', error);
    return null;
  }
}

/**
 * Optimize image and generate multiple formats
 * @param {string|Buffer} input - File path or buffer
 * @param {Object} options - Optimization options
 * @returns {Promise<Object>} - Optimized image buffers and metadata
 */
export async function optimizeImage(input, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = {
      avif: 80,
      webp: 85,
      jpeg: 85,
    },
    generateFormats = ['avif', 'webp', 'jpeg'],
    generateBlur = true,
  } = options;

  try {
    // Load image
    const image = sharp(input);
    const metadata = await image.metadata();

    // Get original size
    const originalSize = input instanceof Buffer ? input.length : fs.statSync(input).size;

    // Resize if needed
    const resized = image.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    const results = {
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        originalSize,
      },
      formats: {},
    };

    // Generate AVIF
    if (generateFormats.includes('avif')) {
      const avifBuffer = await resized
        .clone()
        .avif({
          quality: quality.avif,
          effort: 6,
        })
        .toBuffer();

      results.formats.avif = {
        buffer: avifBuffer,
        size: avifBuffer.length,
        savings: ((1 - avifBuffer.length / originalSize) * 100).toFixed(2),
      };
    }

    // Generate WebP
    if (generateFormats.includes('webp')) {
      const webpBuffer = await resized
        .clone()
        .webp({
          quality: quality.webp,
          effort: 6,
        })
        .toBuffer();

      results.formats.webp = {
        buffer: webpBuffer,
        size: webpBuffer.length,
        savings: ((1 - webpBuffer.length / originalSize) * 100).toFixed(2),
      };
    }

    // Generate optimized JPEG
    if (generateFormats.includes('jpeg')) {
      const jpegBuffer = await resized
        .clone()
        .jpeg({
          quality: quality.jpeg,
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();

      results.formats.jpeg = {
        buffer: jpegBuffer,
        size: jpegBuffer.length,
        savings: ((1 - jpegBuffer.length / originalSize) * 100).toFixed(2),
      };
    }

    // Generate blur placeholder
    if (generateBlur) {
      const blurDataURL = await generateBlurPlaceholder(
        results.formats.jpeg?.buffer || results.formats.webp?.buffer || results.formats.avif?.buffer
      );
      results.blurDataURL = blurDataURL;
    }

    return results;
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

/**
 * Process uploaded image and prepare for CDN upload
 * @param {string} filePath - Temporary file path
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} - Processed image data
 */
export async function processUploadedImage(filePath, options = {}) {
  try {
    // Read the file
    const buffer = fs.readFileSync(filePath);

    // Optimize image
    const optimized = await optimizeImage(buffer, options);

    // Add original filename
    const filename = path.basename(filePath);
    optimized.originalFilename = filename;

    return optimized;
  } catch (error) {
    console.error('Error processing uploaded image:', error);
    throw error;
  }
}

/**
 * Save optimized images to local storage
 * @param {Object} optimizedData - Data from optimizeImage()
 * @param {string} outputDir - Output directory
 * @param {string} baseFilename - Base filename (without extension)
 * @returns {Promise<Object>} - Saved file paths
 */
export async function saveOptimizedImages(optimizedData, outputDir, baseFilename) {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const savedFiles = {};

    // Save each format
    for (const [format, data] of Object.entries(optimizedData.formats)) {
      const outputPath = path.join(outputDir, `${baseFilename}.${format}`);
      fs.writeFileSync(outputPath, data.buffer);
      savedFiles[format] = outputPath;
    }

    return savedFiles;
  } catch (error) {
    console.error('Error saving optimized images:', error);
    throw error;
  }
}

/**
 * Get optimal image format based on file extension
 * @param {string} filename - Original filename
 * @returns {string} - Format name
 */
export function getImageFormat(filename) {
  const ext = path.extname(filename).toLowerCase();
  const formatMap = {
    '.jpg': 'jpeg',
    '.jpeg': 'jpeg',
    '.png': 'png',
    '.webp': 'webp',
    '.avif': 'avif',
    '.gif': 'gif',
  };
  return formatMap[ext] || 'jpeg';
}

/**
 * Validate image file
 * @param {string} filePath - File path to validate
 * @returns {Promise<boolean>} - Whether file is a valid image
 */
export async function validateImage(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return metadata.width > 0 && metadata.height > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Get image dimensions
 * @param {string|Buffer} input - File path or buffer
 * @returns {Promise<Object>} - Width and height
 */
export async function getImageDimensions(input) {
  try {
    const metadata = await sharp(input).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
}
