import { getActiveInfoBanners } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const banners = await getActiveInfoBanners();

    return res.status(200).json({
      success: true,
      banners: banners,
    });
  } catch (error) {
    console.error('Error fetching info banners:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch info banners',
    });
  }
}
