const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateBlurDataURL(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();

    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Error generating blur for ${imagePath}:`, error);
    return null;
  }
}

async function optimizeImage(inputPath, filename) {
  const outputPathWebP = path.join(OUTPUT_DIR, filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
  const outputPathAvif = path.join(OUTPUT_DIR, filename.replace(/\.(jpg|jpeg|png)$/i, '.avif'));
  const outputPathJpg = path.join(OUTPUT_DIR, filename.replace(/\.(jpg|jpeg|png)$/i, '.jpg'));

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`\nOptimizing ${filename}...`);
    console.log(`Original size: ${(fs.statSync(inputPath).size / 1024).toFixed(2)} KB`);
    console.log(`Dimensions: ${metadata.width}x${metadata.height}`);

    // Generate WebP (best compression)
    await sharp(inputPath)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPathWebP);

    const webpSize = (fs.statSync(outputPathWebP).size / 1024).toFixed(2);
    console.log(`✓ WebP created: ${webpSize} KB`);

    // Generate AVIF (even better compression)
    await sharp(inputPath)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .avif({
        quality: 80,
        effort: 6
      })
      .toFile(outputPathAvif);

    const avifSize = (fs.statSync(outputPathAvif).size / 1024).toFixed(2);
    console.log(`✓ AVIF created: ${avifSize} KB`);

    // Generate optimized JPEG (fallback)
    await sharp(inputPath)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPathJpg);

    const jpgSize = (fs.statSync(outputPathJpg).size / 1024).toFixed(2);
    console.log(`✓ Optimized JPG created: ${jpgSize} KB`);

    // Generate blur placeholder
    const blurDataURL = await generateBlurDataURL(inputPath);
    console.log(`✓ Blur placeholder generated`);

    return {
      filename,
      original: filename,
      webp: path.basename(outputPathWebP),
      avif: path.basename(outputPathAvif),
      jpg: path.basename(outputPathJpg),
      blurDataURL,
      originalSize: fs.statSync(inputPath).size,
      webpSize: fs.statSync(outputPathWebP).size,
      avifSize: fs.statSync(outputPathAvif).size,
      jpgSize: fs.statSync(outputPathJpg).size,
      savings: ((1 - fs.statSync(outputPathAvif).size / fs.statSync(inputPath).size) * 100).toFixed(2)
    };
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error);
    return null;
  }
}

async function optimizeAllImages() {
  console.log('🚀 Starting image optimization...\n');

  const files = fs.readdirSync(IMAGE_DIR).filter(file =>
    /\.(jpg|jpeg|png)$/i.test(file) && file !== 'coverImage.avif'
  );

  const results = [];

  for (const file of files) {
    const inputPath = path.join(IMAGE_DIR, file);
    const result = await optimizeImage(inputPath, file);
    if (result) {
      results.push(result);
    }
  }

  // Generate a JSON file with blur data URLs
  const blurDataMap = {};
  results.forEach(result => {
    if (result.blurDataURL) {
      blurDataMap[result.original] = result.blurDataURL;
    }
  });

  fs.writeFileSync(
    path.join(__dirname, '../lib/imageBlurData.json'),
    JSON.stringify(blurDataMap, null, 2)
  );

  console.log('\n✅ Optimization complete!');
  console.log(`\n📊 Summary:`);

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.avifSize, 0);
  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(2);

  console.log(`Total original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total optimized size (AVIF): ${(totalOptimized / 1024).toFixed(2)} KB`);
  console.log(`Total savings: ${totalSavings}%`);
  console.log(`\nBlur data URLs saved to: lib/imageBlurData.json`);
  console.log(`Optimized images saved to: public/images/optimized/`);
}

optimizeAllImages().catch(console.error);
