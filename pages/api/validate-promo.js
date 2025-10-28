import { validatePromoCode } from '../../lib/airtable';
import { applyPromoCode } from '../../lib/cart';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({
        valid: false,
        message: 'Missing required fields',
      });
    }

    const promoCode = await validatePromoCode(code);

    if (!promoCode) {
      return res.status(200).json({
        valid: false,
        message: 'Invalid or expired promo code',
      });
    }

    if (subtotal < promoCode.minPurchase) {
      return res.status(200).json({
        valid: false,
        message: `Minimum purchase of $${promoCode.minPurchase} required`,
      });
    }

    const discount = applyPromoCode(promoCode, subtotal);

    return res.status(200).json({
      valid: true,
      discount,
      code: promoCode.code,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return res.status(500).json({
      valid: false,
      message: 'Internal server error',
    });
  }
}
