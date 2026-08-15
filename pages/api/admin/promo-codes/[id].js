import { updatePromoCode, deletePromoCode } from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const {
        code,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        active,
        validFrom,
        validUntil,
        description,
      } = req.body;

      const result = await updatePromoCode(id, {
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
        return res.status(500).json({ error: result.error || 'Failed to update promo code' });
      }

      return res.status(200).json({
        success: true,
        message: 'Promo code updated successfully',
      });
    } catch (error) {
      console.error('Error updating promo code:', error);
      return res.status(500).json({ error: 'Failed to update promo code' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await deletePromoCode(id);

      if (!result.success) {
        return res.status(500).json({ error: result.error || 'Failed to delete promo code' });
      }

      return res.status(200).json({
        success: true,
        message: 'Promo code deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting promo code:', error);
      return res.status(500).json({ error: 'Failed to delete promo code' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
