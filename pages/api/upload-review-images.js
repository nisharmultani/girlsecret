import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

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
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Parse the form data
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 4,
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

    // Process uploaded files
    const imageUrls = [];
    const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);

    for (const file of uploadedFiles) {
      if (file) {
        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const extension = path.extname(file.originalFilename || '.jpg');
        const newFilename = `review-${timestamp}-${randomStr}${extension}`;
        const newPath = path.join(uploadsDir, newFilename);

        // Rename file to new filename
        await fs.rename(file.filepath, newPath);

        // Store the public URL
        imageUrls.push(`/uploads/reviews/${newFilename}`);
      }
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
