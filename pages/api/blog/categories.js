import { getBlogCategories } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const categories = await getBlogCategories();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch blog categories',
    });
  }
}
