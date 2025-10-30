import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../../../lib/airtable';

export default async function handler(req, res) {
  // GET - Fetch user addresses
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const addresses = await getUserAddresses(userId);

      res.status(200).json({
        success: true,
        addresses,
      });
    } catch (error) {
      console.error('Fetch addresses error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // POST - Create new address
  else if (req.method === 'POST') {
    try {
      const { userId, addressData } = req.body;

      if (!userId || !addressData) {
        return res.status(400).json({ error: 'User ID and address data are required' });
      }

      // Validate required address fields
      if (!addressData.fullName || !addressData.addressLine1 || !addressData.city || !addressData.postcode) {
        return res.status(400).json({ error: 'Missing required address fields' });
      }

      const result = await createAddress(userId, addressData);

      if (!result.success) {
        return res.status(500).json({ error: result.error || 'Failed to create address' });
      }

      res.status(201).json({
        success: true,
        address: result.address,
        message: 'Address created successfully',
      });
    } catch (error) {
      console.error('Create address error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // PUT - Update address
  else if (req.method === 'PUT') {
    try {
      const { addressId, addressData } = req.body;

      if (!addressId || !addressData) {
        return res.status(400).json({ error: 'Address ID and data are required' });
      }

      const result = await updateAddress(addressId, addressData);

      if (!result.success) {
        return res.status(500).json({ error: result.error || 'Failed to update address' });
      }

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
      });
    } catch (error) {
      console.error('Update address error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // DELETE - Delete address
  else if (req.method === 'DELETE') {
    try {
      const { addressId } = req.query;

      if (!addressId) {
        return res.status(400).json({ error: 'Address ID is required' });
      }

      const result = await deleteAddress(addressId);

      if (!result.success) {
        return res.status(500).json({ error: result.error || 'Failed to delete address' });
      }

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      console.error('Delete address error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
