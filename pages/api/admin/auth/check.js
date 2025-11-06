// Check if admin is authenticated
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        error: 'No token provided'
      });
    }

    // In a real implementation, verify the JWT token
    // For now, we just check if token exists and has correct length
    if (token.length === 64) {
      return res.status(200).json({
        authenticated: true,
        admin: {
          email: process.env.ADMIN_EMAIL || 'girlsecretuk@gmail.com',
          name: 'Admin',
          role: 'admin',
        },
      });
    }

    return res.status(401).json({
      authenticated: false,
      error: 'Invalid token'
    });
  } catch (error) {
    console.error('Admin auth check error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}
