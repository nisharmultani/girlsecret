import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const ORDERS_TABLE = 'Orders';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Add admin authentication check here
    // For now, allowing access - you should verify the user is an admin

    const orders = [];

    await base(ORDERS_TABLE)
      .select({
        sort: [{ field: 'CreatedAt', direction: 'desc' }]
      })
      .eachPage((records, fetchNextPage) => {
        records.forEach((record) => {
          orders.push({
            id: record.id,
            OrderNumber: record.get('OrderNumber'),
            CustomerName: record.get('CustomerName'),
            CustomerEmail: record.get('CustomerEmail'),
            Total: record.get('Total'),
            Status: record.get('Status'),
            TrackingNumber: record.get('TrackingNumber'),
            Carrier: record.get('Carrier'),
            AliExpressStatus: record.get('AliExpressStatus'),
            Notes: record.get('Notes'),
            CreatedAt: record.get('CreatedAt'),
            UpdatedAt: record.get('UpdatedAt'),
            Items: record.get('Items'),
            ShippingAddress: record.get('ShippingAddress')
          });
        });
        fetchNextPage();
      });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
