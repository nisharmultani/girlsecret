// Admin authentication utilities

// Get admin session (browser-side)
export const getAdminSession = () => {
  if (typeof window !== 'undefined') {
    // Check localStorage first (persistent session - remember me)
    let session = localStorage.getItem('adminSession');
    if (session) {
      return JSON.parse(session);
    }

    // Check sessionStorage (temporary session - not remembered)
    session = sessionStorage.getItem('adminSession');
    if (session) {
      return JSON.parse(session);
    }
  }
  return null;
};

// Save admin session (browser-side)
export const saveAdminSession = (admin, token, remember = false) => {
  if (typeof window !== 'undefined') {
    const session = {
      user: admin,
      token,
      isAdmin: true,
      createdAt: new Date().toISOString(),
      remember,
    };

    // Save to localStorage if remember me is checked, otherwise sessionStorage
    if (remember) {
      localStorage.setItem('adminSession', JSON.stringify(session));
      sessionStorage.removeItem('adminSession');
    } else {
      sessionStorage.setItem('adminSession', JSON.stringify(session));
      localStorage.removeItem('adminSession');
    }

    window.dispatchEvent(new Event('adminAuthChanged'));
  }
};

// Clear admin session (browser-side)
export const clearAdminSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSession');
    window.dispatchEvent(new Event('adminAuthChanged'));
  }
};

// Check if admin is authenticated (browser-side)
export const isAdminAuthenticated = () => {
  return getAdminSession() !== null;
};

// Get current admin (browser-side)
export const getCurrentAdmin = () => {
  const session = getAdminSession();
  return session ? session.user : null;
};

// Get admin token (browser-side)
export const getAdminToken = () => {
  const session = getAdminSession();
  return session ? session.token : null;
};

// Middleware to check admin authentication (server-side)
export const requireAdminAuth = (handler) => {
  return async (req, res) => {
    try {
      // Get authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'You must be logged in as an admin to access this resource'
        });
      }

      // Verify token (simple check for now - in production use JWT)
      if (token.length !== 64) {
        return res.status(401).json({
          error: 'Invalid authentication token',
          message: 'Your session token is invalid. Please log in again.'
        });
      }

      // Token is valid, attach admin info to request
      req.admin = {
        email: process.env.ADMIN_EMAIL || 'girlsecretuk@gmail.com',
        role: 'admin',
      };

      // Call the actual handler
      return handler(req, res);
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return res.status(500).json({
        error: 'Authentication error',
        message: 'An error occurred while verifying your credentials'
      });
    }
  };
};

// Check admin authentication (returns boolean)
export const checkAdminAuth = (req) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token.length !== 64) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
