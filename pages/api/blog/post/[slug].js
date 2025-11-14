import { getBlogPostBySlug, incrementBlogPostViews } from '../../../../lib/airtable';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    // Increment view count asynchronously (don't wait for it)
    incrementBlogPostViews(post.id).catch(err =>
      console.error('Error incrementing views:', err)
    );

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post',
    });
  }
}
