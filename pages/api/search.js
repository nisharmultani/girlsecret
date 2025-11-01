import { getAllProducts } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;

    // Get all products
    const allProducts = await getAllProducts();

    let results = allProducts;

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
      results = results.filter((product) => {
        const price = product.salePrice || product.price;
        return price >= min;
      });
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      results = results.filter((product) => {
        const price = product.salePrice || product.price;
        return price <= max;
      });
    }

    // Sort results
    if (sort) {
      switch (sort) {
        case 'price-asc':
          results.sort((a, b) => {
            const priceA = a.salePrice || a.price;
            const priceB = b.salePrice || b.price;
            return priceA - priceB;
          });
          break;
        case 'price-desc':
          results.sort((a, b) => {
            const priceA = a.salePrice || a.price;
            const priceB = b.salePrice || b.price;
            return priceB - priceA;
          });
          break;
        case 'name-asc':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          results.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          results.sort((a, b) => {
            const dateA = new Date(a.createdTime || 0);
            const dateB = new Date(b.createdTime || 0);
            return dateB - dateA;
          });
          break;
        default:
          // Featured products first
          results.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
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
    return res.status(500).json({
      success: false,
      error: 'Failed to search products',
    });
  }
}
