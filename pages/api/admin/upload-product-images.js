import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { processUploadedImage } from '../../../lib/imageProcessor';
import { addBlurPlaceholder } from '../../../lib/blurDataStorage';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB for product images
      maxFiles: 10, // Allow up to 10 product images
      filter: function ({ mimetype }) {
        // Keep only images
        return mimetype && mimetype.startsWith('image/');
      },
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Process uploaded files, optimize, and upload to Cloudinary
    const imageData = [];
    const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);

    for (const file of uploadedFiles) {
      if (file) {
        try {
          console.log(`Processing image: ${file.originalFilename || file.newFilename}`);

          // Step 1: Optimize image (generates AVIF, WebP, JPEG)
          const optimized = await processUploadedImage(file.filepath, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: {
              avif: 80,
              webp: 85,
              jpeg: 85,
            },
            generateFormats: ['avif', 'webp', 'jpeg'],
            generateBlur: true,
          });

          console.log(`Optimized image - Original: ${(optimized.metadata.originalSize / 1024).toFixed(2)}KB`);
          if (optimized.formats.avif) {
            console.log(`  AVIF: ${(optimized.formats.avif.size / 1024).toFixed(2)}KB (${optimized.formats.avif.savings}% savings)`);
          }
          if (optimized.formats.webp) {
            console.log(`  WebP: ${(optimized.formats.webp.size / 1024).toFixed(2)}KB (${optimized.formats.webp.savings}% savings)`);
          }

          // Step 2: Upload optimized versions to Cloudinary
          const urls = {};
          const filename = file.originalFilename || file.newFilename;
          const baseFilename = filename.replace(/\.[^/.]+$/, ''); // Remove extension

          // Upload AVIF (best compression)
          if (optimized.formats.avif) {
            const avifResult = await cloudinary.uploader.upload(
              `data:image/avif;base64,${optimized.formats.avif.buffer.toString('base64')}`,
              {
                folder: 'girlsecret/products',
                public_id: `${baseFilename}_avif`,
                resource_type: 'image',
                format: 'avif',
              }
            );
            urls.avif = avifResult.secure_url;
          }

          // Upload WebP (wide browser support)
          if (optimized.formats.webp) {
            const webpResult = await cloudinary.uploader.upload(
              `data:image/webp;base64,${optimized.formats.webp.buffer.toString('base64')}`,
              {
                folder: 'girlsecret/products',
                public_id: `${baseFilename}_webp`,
                resource_type: 'image',
                format: 'webp',
              }
            );
            urls.webp = webpResult.secure_url;
          }

          // Upload JPEG (fallback)
          if (optimized.formats.jpeg) {
            const jpegResult = await cloudinary.uploader.upload(
              `data:image/jpeg;base64,${optimized.formats.jpeg.buffer.toString('base64')}`,
              {
                folder: 'girlsecret/products',
                public_id: baseFilename,
                resource_type: 'image',
                format: 'jpg',
              }
            );
            urls.jpeg = jpegResult.secure_url;
            urls.primary = jpegResult.secure_url; // Main URL for backward compatibility
          }

          // Step 3: Save blur placeholder for later use
          if (optimized.blurDataURL) {
            // Save blur data for all uploaded formats
            addBlurPlaceholder(urls.primary || urls.jpeg, optimized.blurDataURL);
            if (urls.avif) addBlurPlaceholder(urls.avif, optimized.blurDataURL);
            if (urls.webp) addBlurPlaceholder(urls.webp, optimized.blurDataURL);
          }

          // Store all data including blur placeholder
          imageData.push({
            filename: filename,
            urls: urls,
            blurDataURL: optimized.blurDataURL,
            metadata: {
              width: optimized.metadata.width,
              height: optimized.metadata.height,
              originalSize: optimized.metadata.originalSize,
              optimizedSizes: {
                avif: optimized.formats.avif?.size,
                webp: optimized.formats.webp?.size,
                jpeg: optimized.formats.jpeg?.size,
              },
            },
          });

          console.log(`Successfully uploaded: ${filename}`);

          // Delete the temporary file
          fs.unlinkSync(file.filepath);
        } catch (uploadError) {
          console.error('Error processing/uploading image:', uploadError);
          // Clean up temp file even on error
          try {
            fs.unlinkSync(file.filepath);
          } catch (cleanupError) {
            // Ignore cleanup errors
          }
          // Continue with other files even if one fails
        }
      }
    }

    if (imageData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images were uploaded successfully',
      });
    }

    // Extract primary URLs for backward compatibility
    const primaryUrls = imageData.map(img => img.urls.primary || img.urls.jpeg);

    return res.status(200).json({
      success: true,
      urls: primaryUrls, // For backward compatibility
      images: imageData, // Full data including all formats and blur placeholders
      summary: {
        total: imageData.length,
        totalOriginalSize: imageData.reduce((sum, img) => sum + img.metadata.originalSize, 0),
        totalOptimizedSize: imageData.reduce((sum, img) => sum + (img.metadata.optimizedSizes.avif || 0), 0),
        averageSavings: (
          imageData.reduce((sum, img) => {
            const original = img.metadata.originalSize;
            const optimized = img.metadata.optimizedSizes.avif || img.metadata.optimizedSizes.webp || img.metadata.optimizedSizes.jpeg;
            return sum + ((1 - optimized / original) * 100);
          }, 0) / imageData.length
        ).toFixed(2),
      },
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
}
