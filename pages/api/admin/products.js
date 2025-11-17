import { getAllProducts } from '../../../lib/airtable';
import { protectAdminRoute, validateMethod } from '../../../lib/apiMiddleware';

export default async function handler(req, res) {
  // Validate HTTP method
  if (!validateMethod(req, res, 'GET')) {
    return; // Method not allowed
  }

  // Protect admin route with CORS and authentication
  const admin = await protectAdminRoute(req, res);
  if (!admin) {
    return; // Blocked by CORS or authentication failed
  }

  try {
    const products = await getAllProducts();
    return res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}
