import airtableLib from '../../lib/airtable';

const { getAllProducts } = airtableLib;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;

    // Get all products
    const allProducts = await getAllProducts();

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      return res.status(200).json({
        success: true,
        results: [],
        count: 0,
        query: q || '',
      });
    }

    let results = [...allProducts];

    // Search by query (name, description, keywords, category)
    if (q && q.trim()) {
      const query = q.toLowerCase().trim();
      results = results.filter((product) => {
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const keywords = (product.keywords || '').toLowerCase();
        const productCategory = (product.category || '').toLowerCase();

        return (
          name.includes(query) ||
          description.includes(query) ||
          keywords.includes(query) ||
          productCategory.includes(query)
        );
      });
    }

    // Filter by category
    if (category && category !== 'all') {
      results = results.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        results = results.filter((product) => {
          const price = product?.salePrice || product?.price || 0;
          return price >= min;
        });
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        results = results.filter((product) => {
          const price = product?.salePrice || product?.price || 0;
          return price <= max;
        });
      }
    }

    // Sort results
    if (sort) {
      switch (sort) {
        case 'price-asc':
          results.sort((a, b) => {
            const priceA = a?.salePrice || a?.price || 0;
            const priceB = b?.salePrice || b?.price || 0;
            return priceA - priceB;
          });
          break;
        case 'price-desc':
          results.sort((a, b) => {
            const priceA = a?.salePrice || a?.price || 0;
            const priceB = b?.salePrice || b?.price || 0;
            return priceB - priceA;
          });
          break;
        case 'name-asc':
          results.sort((a, b) => {
            const nameA = a?.name || '';
            const nameB = b?.name || '';
            return nameA.localeCompare(nameB);
          });
          break;
        case 'name-desc':
          results.sort((a, b) => {
            const nameA = a?.name || '';
            const nameB = b?.name || '';
            return nameB.localeCompare(nameA);
          });
          break;
        case 'newest':
          results.sort((a, b) => {
            const dateA = new Date(a?.createdTime || 0);
            const dateB = new Date(b?.createdTime || 0);
            return dateB - dateA;
          });
          break;
        default:
          // Featured products first
          results.sort((a, b) => {
            const aFeatured = a?.featured ? 1 : 0;
            const bFeatured = b?.featured ? 1 : 0;
            return bFeatured - aFeatured;
          });
      }
    }

    return res.status(200).json({
      success: true,
      results,
      count: results.length,
      query: q || '',
    });
  } catch (error) {
    console.error('Search error:', error);
    console.error('Error details:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      error: 'Failed to search products',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
