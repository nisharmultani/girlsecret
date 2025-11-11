import { useState } from 'react';
import Head from 'next/head';
import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
  PhotoIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';


export default function ImportProduct() {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    salePrice: '',
    description: '',
    category: 'Bras',
    sizes: '',
    colors: '',
    material: '',
    features: '',
    imageUrls: '',
    aliexpressUrl: '',
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [copied, setCopied] = useState(false);

  const categories = ['Bras', 'Panties', 'Lingerie', 'Sleepwear', 'Accessories'];

  const handleChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));

    // Auto-preview images when URLs are pasted
    if (field === 'imageUrls') {
      const urls = value.split('\n').filter(url => url.trim());
      setPreviewImages(urls);
    }
  };

  const generateFormattedData = () => {
    const sizesArray = productData.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = productData.colors.split(',').map(c => c.trim()).filter(Boolean);
    const featuresArray = productData.features.split('\n').filter(f => f.trim());
    const imagesArray = productData.imageUrls.split('\n').filter(url => url.trim());

    return {
      name: productData.name,
      price: parseFloat(productData.price) || 0,
      salePrice: productData.salePrice ? parseFloat(productData.salePrice) : null,
      description: productData.description,
      category: productData.category,
      sizes: sizesArray,
      colors: colorsArray,
      material: productData.material,
      features: featuresArray,
      images: imagesArray,
      imageUrl: imagesArray[0] || '',
      stock: 100,
      featured: false,
      sku: `GS-${Date.now()}`,
      aliexpressUrl: productData.aliexpressUrl,
      source: 'AliExpress Import',
    };
  };

  const copyToClipboard = () => {
    const formatted = generateFormattedData();
    const jsonString = JSON.stringify(formatted, null, 2);

    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyForAirtable = () => {
    const formatted = generateFormattedData();

    // Format for Airtable manual entry
    const airtableFormat = `
Name: ${formatted.name}
Price: £${formatted.price}
Sale Price: ${formatted.salePrice ? '£' + formatted.salePrice : 'N/A'}
Category: ${formatted.category}
Description: ${formatted.description}
Material: ${formatted.material}
Sizes: ${formatted.sizes.join(', ')}
Colors: ${formatted.colors.join(', ')}
Features:
${formatted.features.map(f => `- ${f}`).join('\n')}
Image URL (Main): ${formatted.imageUrl}
Additional Images:
${formatted.images.slice(1).map((img, i) => `Image ${i + 2}: ${img}`).join('\n')}
SKU: ${formatted.sku}
Stock: ${formatted.stock}
Source: ${formatted.source}
AliExpress URL: ${formatted.aliexpressUrl}
    `.trim();

    navigator.clipboard.writeText(airtableFormat).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearForm = () => {
    setProductData({
      name: '',
      price: '',
      salePrice: '',
      description: '',
      category: 'Bras',
      sizes: '',
      colors: '',
      material: '',
      features: '',
      imageUrls: '',
      aliexpressUrl: '',
    });
    setPreviewImages([]);
  };

  return (
    <>
      <Head>
        <title>Import Product from AliExpress - GirlSecret Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Import Product from AliExpress
            </h1>
            <p className="text-gray-600">
              Manually paste product information from AliExpress and format it for your store
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBagIcon className="w-6 h-6 text-rose-500" />
                Product Information
              </h2>

              <div className="space-y-4">
                {/* AliExpress URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AliExpress URL (Optional - for reference)
                  </label>
                  <input
                    type="url"
                    value={productData.aliexpressUrl}
                    onChange={(e) => handleChange('aliexpressUrl', e.target.value)}
                    placeholder="https://www.aliexpress.com/item/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Elegant Lace Bralette Set"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={productData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Regular Price (£) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="29.99"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productData.salePrice}
                      onChange={(e) => handleChange('salePrice', e.target.value)}
                      placeholder="24.99"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Beautiful and comfortable lace bralette set perfect for everyday wear..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none"
                    required
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={productData.material}
                    onChange={(e) => handleChange('material', e.target.value)}
                    placeholder="95% Cotton, 5% Spandex"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Sizes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={productData.sizes}
                    onChange={(e) => handleChange('sizes', e.target.value)}
                    placeholder="XS, S, M, L, XL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Colors (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={productData.colors}
                    onChange={(e) => handleChange('colors', e.target.value)}
                    placeholder="Black, White, Pink, Red"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (one per line)
                  </label>
                  <textarea
                    value={productData.features}
                    onChange={(e) => handleChange('features', e.target.value)}
                    placeholder="Wireless design for comfort&#10;Adjustable straps&#10;Removable padding&#10;Breathable fabric"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none"
                  />
                </div>

                {/* Image URLs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URLs (one per line) *
                  </label>
                  <textarea
                    value={productData.imageUrls}
                    onChange={(e) => handleChange('imageUrls', e.target.value)}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none font-mono text-sm"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={clearForm}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            {/* Preview & Export */}
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PhotoIcon className="w-6 h-6 text-rose-500" />
                  Image Preview
                </h2>
                {previewImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {previewImages.slice(0, 4).map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          height={40}
                          width={40}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-sm text-gray-400">Invalid URL</div>';
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Paste image URLs to preview</p>
                  </div>
                )}
                {previewImages.length > 4 && (
                  <p className="text-sm text-gray-500 mt-3">
                    +{previewImages.length - 4} more images
                  </p>
                )}
              </div>

              {/* Export Options */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Export Product Data
                </h2>

                <div className="space-y-3">
                  <button
                    onClick={copyToClipboard}
                    disabled={!productData.name || !productData.price}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {copied ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="w-5 h-5" />
                        Copy as JSON
                      </>
                    )}
                  </button>

                  <button
                    onClick={copyForAirtable}
                    disabled={!productData.name || !productData.price}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-rose-500 text-rose-600 rounded-lg font-semibold hover:bg-rose-50 transition-colors disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                    Copy for Airtable
                  </button>
                </div>

                {/* Product Summary */}
                {productData.name && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Product Summary:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><strong>Name:</strong> {productData.name}</li>
                      <li><strong>Category:</strong> {productData.category}</li>
                      <li><strong>Price:</strong> £{productData.price}</li>
                      {productData.salePrice && (
                        <li><strong>Sale Price:</strong> £{productData.salePrice}</li>
                      )}
                      <li><strong>Images:</strong> {previewImages.length}</li>
                      {productData.sizes && (
                        <li><strong>Sizes:</strong> {productData.sizes}</li>
                      )}
                      {productData.colors && (
                        <li><strong>Colors:</strong> {productData.colors}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Open the AliExpress product page</li>
                  <li>Copy product details and paste them into the form</li>
                  <li>Right-click product images and copy image URLs</li>
                  <li>Paste image URLs (one per line)</li>
                  <li>Review the preview</li>
                  <li>Click &quot;Copy as JSON&quot; or &quot;Copy for Airtable&quot;</li>
                  <li>Paste into your database/Airtable</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
