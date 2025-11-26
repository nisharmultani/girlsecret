import { getBase } from '../../../../lib/airtable';

const PROMO_CODES_TABLE = 'PromoCodes';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    // Update promo code
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

      const base = getBase();
      if (!base) {
        return res.status(500).json({ error: 'Database not configured' });
      }

      const updateData = {};
      if (code) updateData.Code = code.toUpperCase();
      if (discountType) updateData.DiscountType = discountType;
      if (discountValue !== undefined) updateData.DiscountValue = parseFloat(discountValue);
      if (minPurchase !== undefined) updateData.MinPurchase = parseFloat(minPurchase);
      if (maxDiscount !== undefined) updateData.MaxDiscount = maxDiscount ? parseFloat(maxDiscount) : null;
      if (active !== undefined) updateData.Active = active;
      if (validFrom !== undefined) updateData.ValidFrom = validFrom || null;
      if (validUntil !== undefined) updateData.ValidUntil = validUntil || null;
      if (description !== undefined) updateData.Description = description;

      await base(PROMO_CODES_TABLE).update(id, updateData);

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
    // Delete promo code
    try {
      const base = getBase();
      if (!base) {
        return res.status(500).json({ error: 'Database not configured' });
      }

      await base(PROMO_CODES_TABLE).destroy(id);

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
