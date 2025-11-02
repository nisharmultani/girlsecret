import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      if (isAuthenticated && user) {
        // Load from Airtable for authenticated users
        const response = await fetch(`/api/wishlist?userId=${user.id}&idsOnly=true`);

        if (response.ok) {
          const data = await response.json();
          console.log('Loaded wishlist from Airtable:', data.productIds);
          setWishlistItems(data.productIds || []);
          setWishlistCount(data.productIds?.length || 0);
        }
      } else {
        // Load from localStorage for guests
        const localWishlist = getLocalWishlist();
        console.log('Loaded wishlist from localStorage:', localWishlist);
        setWishlistItems(localWishlist);
        setWishlistCount(localWishlist.length);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const mergeGuestWishlist = useCallback(async () => {
    // Merge localStorage wishlist into Airtable when user logs in
    if (!isAuthenticated || !user) return;

    const localWishlist = getLocalWishlist();
    if (localWishlist.length === 0) return;

    console.log('Merging guest wishlist:', localWishlist);

    try {
      setLoading(true);
      // Add each item from local wishlist to Airtable
      const mergePromises = localWishlist.map(async (productId) => {
        console.log(`Merging item ${productId} for user ${user.id}`);
        const response = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id, productId }),
        });

        const data = await response.json();
        console.log(`Merge response for ${productId}:`, response.status, data);

        if (!response.ok) {
          console.error(`Failed to merge ${productId}:`, data);
          throw new Error(data.error || 'Failed to add to wishlist');
        }

        return data;
      });

      const results = await Promise.all(mergePromises);
      console.log('Guest wishlist merged successfully. Results:', results);

      // Clear local wishlist after merge
      clearLocalWishlist();

      // Wait a moment for Airtable to commit the data
      console.log('Waiting 500ms for Airtable to commit...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reload wishlist from Airtable
      console.log('Now reloading wishlist from Airtable...');
      await loadWishlist();
    } catch (error) {
      console.error('Error merging wishlist:', error);
      setLoading(false);
    }
  }, [isAuthenticated, user, loadWishlist]);

  // Load wishlist on mount and when auth changes
  useEffect(() => {
    const initializeWishlist = async () => {
      // If user just logged in and there's a guest wishlist, merge it
      if (isAuthenticated && user) {
        const localWishlist = getLocalWishlist();
        if (localWishlist.length > 0) {
          console.log('User logged in with guest wishlist, merging...');
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
  }, [isAuthenticated, user, loadWishlist, mergeGuestWishlist]);

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
