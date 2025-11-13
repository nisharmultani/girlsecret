import { getAllBlogPosts } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, tag, limit, offset } = req.query;

    const options = {};

    if (category) {
      options.category = category;
    }

    if (tag) {
      options.tag = tag;
    }

    if (limit) {
      options.limit = parseInt(limit, 10);
    }

    if (offset) {
      options.offset = parseInt(offset, 10);
    }

    const posts = await getAllBlogPosts(options);

    return res.status(200).json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts',
    });
  }
}
