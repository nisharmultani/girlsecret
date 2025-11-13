import { getBlogTags } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tags = await getBlogTags();

    return res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch blog tags',
    });
  }
}
