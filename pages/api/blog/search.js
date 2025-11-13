import { searchBlogPosts } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const posts = await searchBlogPosts(q.trim());

    return res.status(200).json({
      success: true,
      posts,
      count: posts.length,
      query: q,
    });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search blog posts',
    });
  }
}
