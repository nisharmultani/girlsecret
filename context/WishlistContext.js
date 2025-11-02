import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getLocalWishlist,
  addToLocalWishlist,
  removeFromLocalWishlist,
  isInLocalWishlist,
  clearLocalWishlist,
  getLocalWishlistCount,
} from '../lib/wishlist';
import { getSession } from '../lib/auth';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount and when auth changes
  useEffect(() => {
    const initializeWishlist = async () => {
      // If user just logged in and there's a guest wishlist, merge it
      if (isAuthenticated && user) {
        const localWishlist = getLocalWishlist();
        if (localWishlist.length > 0) {
          await mergeGuestWishlist();
        } else {
          await loadWishlist();
        }
      } else {
        await loadWishlist();
      }
    };

    initializeWishlist();

    // Listen for wishlist changes
    const handleWishlistChange = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistChange);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistChange);
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    try {
      if (isAuthenticated && user) {
        // Load from Airtable for authenticated users
        const response = await fetch(`/api/wishlist?userId=${user.id}&idsOnly=true`);

        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data.productIds || []);
          setWishlistCount(data.productIds?.length || 0);
        }
      } else {
        // Load from localStorage for guests
        const localWishlist = getLocalWishlist();
        setWishlistItems(localWishlist);
        setWishlistCount(localWishlist.length);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      if (isAuthenticated && user) {
        // Add to Airtable for authenticated users
        const response = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, productId }),
        });

        if (response.ok) {
          setWishlistItems(prev => [...prev, productId]);
          setWishlistCount(prev => prev + 1);
          return { success: true };
        } else {
          const data = await response.json();
          return { success: false, error: data.error };
        }
      } else {
        // Add to localStorage for guests
        addToLocalWishlist(productId);
        const localWishlist = getLocalWishlist();
        setWishlistItems(localWishlist);
        setWishlistCount(localWishlist.length);
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated && user) {
        // Remove from Airtable for authenticated users
        const response = await fetch('/api/wishlist/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, productId }),
        });

        if (response.ok) {
          setWishlistItems(prev => prev.filter(id => id !== productId));
          setWishlistCount(prev => prev - 1);
          return { success: true };
        } else {
          const data = await response.json();
          return { success: false, error: data.error };
        }
      } else {
        // Remove from localStorage for guests
        removeFromLocalWishlist(productId);
        const localWishlist = getLocalWishlist();
        setWishlistItems(localWishlist);
        setWishlistCount(localWishlist.length);
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const getWishlistCount = () => {
    return wishlistCount;
  };

  const mergeGuestWishlist = async () => {
    // Merge localStorage wishlist into Airtable when user logs in
    if (!isAuthenticated || !user) return;

    const localWishlist = getLocalWishlist();
    if (localWishlist.length === 0) return;

    try {
      // Add each item from local wishlist to Airtable
      for (const productId of localWishlist) {
        await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, productId }),
        });
      }

      // Clear local wishlist after merge
      clearLocalWishlist();

      // Reload wishlist from Airtable
      await loadWishlist();
    } catch (error) {
      console.error('Error merging wishlist:', error);
    }
  };

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    mergeGuestWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
