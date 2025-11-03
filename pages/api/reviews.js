import { submitReview } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId, name, email, rating, comment } = req.body;

    console.log('ProductId received in API:', productId);
    console.log('ProductId type in API:', typeof productId);

    if (!productId || !name || !email || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating' });
    }

    const result = await submitReview(productId, name, email, rating, comment);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Review submitted successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to submit review',
      });
    }
  } catch (error) {
    console.error('Error in reviews API:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
