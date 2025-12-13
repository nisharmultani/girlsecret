import { getBase } from '../../../lib/airtable';

const PROMO_CODES_TABLE = 'PromoCodes';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // List all promo codes
    try {
      const base = getBase();
      if (!base) {
        return res.status(500).json({ error: 'Database not configured' });
      }

      const records = await base(PROMO_CODES_TABLE)
        .select({
          view: 'Grid view',
          sort: [{ field: 'Code', direction: 'asc' }],
        })
        .all();

      const promoCodes = records.map(record => ({
        id: record.id,
        code: record.get('Code'),
        discountType: record.get('DiscountType'),
        discountValue: record.get('DiscountValue'),
        minPurchase: record.get('MinPurchase') || 0,
        maxDiscount: record.get('MaxDiscount'),
        active: record.get('Active'),
        validFrom: record.get('ValidFrom'),
        validUntil: record.get('ValidUntil'),
        description: record.get('Description'),
        usageCount: record.get('UsageCount') || 0,
      }));

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
    // Create new promo code
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

      const base = getBase();
      if (!base) {
        return res.status(500).json({ error: 'Database not configured' });
      }

      // Check if code already exists
      const existing = await base(PROMO_CODES_TABLE)
        .select({
          filterByFormula: `{Code} = '${code.toUpperCase()}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Promo code already exists' });
      }

      // Create new promo code
      const record = await base(PROMO_CODES_TABLE).create({
        Code: code.toUpperCase(),
        DiscountType: discountType,
        DiscountValue: parseFloat(discountValue),
        MinPurchase: parseFloat(minPurchase) || 0,
        MaxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        Active: active,
        ValidFrom: validFrom || null,
        ValidUntil: validUntil || null,
        Description: description || '',
        UsageCount: 0,
      });

      return res.status(200).json({
        success: true,
        promoCode: {
          id: record.id,
          code: record.get('Code'),
          discountType: record.get('DiscountType'),
          discountValue: record.get('DiscountValue'),
        },
      });
    } catch (error) {
      console.error('Error creating promo code:', error);
      return res.status(500).json({ error: 'Failed to create promo code' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
