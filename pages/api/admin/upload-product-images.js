import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

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

    // Process uploaded files and upload to Cloudinary
    const imageUrls = [];
    const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);

    for (const file of uploadedFiles) {
      if (file) {
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: 'girlsecret/products',
            resource_type: 'auto',
            transformation: [
              { width: 1500, height: 1500, crop: 'limit' },
              { quality: 'auto:best' },
            ],
          });

          // Store the Cloudinary URL
          imageUrls.push(result.secure_url);

          // Delete the temporary file
          fs.unlinkSync(file.filepath);
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          // Continue with other files even if one fails
        }
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images were uploaded successfully',
      });
    }

    return res.status(200).json({
      success: true,
      urls: imageUrls,
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
