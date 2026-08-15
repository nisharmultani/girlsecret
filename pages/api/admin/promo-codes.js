import { getAllPromoCodes, createPromoCode } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const promoCodes = await getAllPromoCodes();
      return res.status(200).json({
        success: true,
        promoCodes,
      });
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      return res.status(500).json({ error: 'Failed to fetch promo codes' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        code,
        discountType,
        discountValue,
        minPurchase = 0,
        maxDiscount,
        active = true,
        validFrom,
        validUntil,
        description,
      } = req.body;

      // Validation
      if (!code || !discountType || !discountValue) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await createPromoCode({
        code,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        active,
        validFrom,
        validUntil,
        description,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error || 'Failed to create promo code' });
      }

      return res.status(200).json({
        success: true,
        promoCode: result.promoCode,
      });
    } catch (error) {
      console.error('Error creating promo code:', error);
      return res.status(500).json({ error: 'Failed to create promo code' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
