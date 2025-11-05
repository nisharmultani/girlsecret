import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ProductManagement() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    specifications: '',
    price: '',
    salePrice: '',
    category: '',
    sizes: '',
    inStock: true,
    featured: false,
    soldCount: '',
    images: [], // Main product images
    availableProductImages: [], // Available product variant images
    videoUrls: '' // Video URLs (one per line)
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setProductForm({
      name: '',
      description: '',
      specifications: '',
      price: '',
      salePrice: '',
      category: 'Lingerie',
      sizes: '',
      inStock: true,
      featured: false,
      soldCount: '',
      images: [],
      availableProductImages: [],
      videoUrls: ''
    });
    setSelectedProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      specifications: product.specifications || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      category: product.category || 'Lingerie',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      inStock: product.inStock !== false,
      featured: product.featured === true,
      soldCount: product.soldCount || '',
      images: Array.isArray(product.images) ? product.images : [],
      availableProductImages: Array.isArray(product.Available_Products) ? product.Available_Products : [],
      videoUrls: Array.isArray(product.videoUrls) ? product.videoUrls.join('\n') : (product.videoUrls || '')
    });
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete product'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  // Auto-generate slug from product name - shortened and optimized
  const generateSlug = (name) => {
    // Common words to remove for shorter, cleaner slugs
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are'];

    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .split(/\s+/) // Split into words
      .filter(word => !stopWords.includes(word)) // Remove common stop words
      .slice(0, 6) // Take first 6 important words max
      .join('-') // Join with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .substring(0, 50); // Limit total length to 50 characters
  };

  // Handle main product image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/admin/upload-product-images', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls]
        }));
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle available product image upload
  const handleAvailableProductImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingImages(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/admin/upload-product-images', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setProductForm(prev => ({
          ...prev,
          availableProductImages: [...prev.availableProductImages, ...data.urls]
        }));
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove main image from list
  const removeImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Remove available product image from list
  const removeAvailableProductImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      availableProductImages: prev.availableProductImages.filter((_, i) => i !== index)
    }));
  };

  const submitProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      alert('Please fill in all required fields (Name, Price, Category)');
      return;
    }

    if (productForm.images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    try {
      setSaving(true);

      // Generate slug automatically from name
      const slug = generateSlug(productForm.name);

      // Parse sizes array
      const sizes = productForm.sizes
        ? productForm.sizes.split(',').map(s => s.trim()).filter(s => s)
        : [];

      // Parse video URLs array
      const videoUrls = productForm.videoUrls
        ? productForm.videoUrls.split('\n').map(v => v.trim()).filter(v => v)
        : [];

      const productData = {
        name: productForm.name,
        description: productForm.description,
        specifications: productForm.specifications,
        price: parseFloat(productForm.price),
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
        category: productForm.category,
        slug,
        sizes,
        inStock: productForm.inStock,
        featured: productForm.featured,
        soldCount: productForm.soldCount ? parseInt(productForm.soldCount) : 0,
        images: productForm.images,
        availableProductImages: productForm.availableProductImages,
        videoUrls
      };

      const url = selectedProduct
        ? '/api/admin/products/update'
        : '/api/admin/products/create';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProduct
          ? { productId: selectedProduct.id, ...productData }
          : productData
        )
      });

      if (response.ok) {
        alert(`Product ${selectedProduct ? 'updated' : 'created'} successfully!`);
        setShowEditModal(false);
        setShowAddModal(false);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = ['Bras', 'Panties', 'Lingerie', 'Sleepwear', 'Accessories'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Product Management - Admin Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-2 text-gray-600">Manage your product catalog</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 font-medium"
            >
              + Add New Product
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name, slug, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.inStock).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => !p.inStock).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-purple-600">
                {products.filter(p => p.featured).length}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {product.images && product.images.length > 0 && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">{product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.salePrice ? (
                            <div>
                              <div className="text-sm font-medium text-pink-600">
                                £{product.salePrice.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500 line-through">
                                £{product.price.toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              £{product.price.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.featured ? (
                            <span className="text-yellow-500">★ Featured</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showEditModal || showAddModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g., Lace Bralette"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  {productForm.name && (
                    <p className="mt-1 text-sm text-gray-500">
                      URL: /products/{generateSlug(productForm.name)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Product description..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Specifications
                    <span className="text-gray-500 text-xs ml-2">(Optional - one per line)</span>
                  </label>
                  <textarea
                    value={productForm.specifications}
                    onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                    placeholder="Material: 90% Polyester, 10% Spandex&#10;Care: Hand wash cold&#10;Origin: China&#10;Closure Type: Hook and Eye"
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter specifications in "Label: Value" format, one per line
                  </p>
                </div>

                {/* Price and Sale Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price (£) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="29.99"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Original price always shown</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price (£)
                      <span className="text-gray-500 text-xs ml-1">(Optional - for discounts)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.salePrice}
                      onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                      placeholder="24.99 (leave empty if no sale)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be less than regular price</p>
                  </div>
                </div>

                {/* Category and Sizes */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={productForm.sizes}
                      onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                      placeholder="S, M, L, XL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sold Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sold Count
                    <span className="text-gray-500 text-xs ml-2">(Number of units sold)</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.soldCount}
                    onChange={(e) => setProductForm({ ...productForm, soldCount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images <span className="text-red-500">*</span>
                  </label>

                  <div className="mt-2">
                    <label className="flex justify-center px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                      <div className="text-center">
                        {uploadingImages ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
                            <p className="text-sm text-gray-600">Uploading images...</p>
                          </div>
                        ) : (
                          <>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                              Click to upload product images
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              PNG, JPG, WEBP up to 10MB (multiple files allowed)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Preview */}
                  {productForm.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {productForm.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Product Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Product Images (Variants)
                    <span className="text-gray-500 text-xs ml-2">(Optional - for product variants/colors)</span>
                  </label>

                  <div className="mt-2">
                    <label className="flex justify-center px-6 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="text-center">
                        {uploadingImages ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                            <p className="text-sm text-gray-600">Uploading images...</p>
                          </div>
                        ) : (
                          <>
                            <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                              Click to upload available product variant images
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Upload images of different colors/variants
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAvailableProductImageUpload}
                        disabled={uploadingImages}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Available Product Image Preview */}
                  {productForm.availableProductImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {productForm.availableProductImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Variant ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeAvailableProductImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video URLs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Videos
                    <span className="text-gray-500 text-xs ml-2">(Optional - YouTube/Vimeo or direct video URLs)</span>
                  </label>
                  <textarea
                    value={productForm.videoUrls}
                    onChange={(e) => setProductForm({ ...productForm, videoUrls: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=...&#10;https://vimeo.com/...&#10;https://example.com/video.mp4"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter one video URL per line. Supports YouTube, Vimeo, and direct video links (mp4, webm)
                  </p>
                  {productForm.videoUrls && productForm.videoUrls.trim() && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {productForm.videoUrls.split('\n').filter(v => v.trim()).length} video(s) added
                    </div>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={submitProduct}
                  disabled={saving || uploadingImages}
                  className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? 'Saving...' : (selectedProduct ? 'Update Product' : 'Add Product')}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                  }}
                  disabled={saving || uploadingImages}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
