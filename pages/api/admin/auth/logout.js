export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In a real implementation with JWT, you might want to blacklist the token
    // For now, we just return success and let the client clear the session

    console.log('Admin logged out:', {
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    return res.status(500).json({ error: 'An error occurred during logout' });
  }
}
