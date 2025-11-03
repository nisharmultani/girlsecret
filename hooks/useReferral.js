import { useState, useEffect } from 'react';
import { initializeReferralTracking, getActiveReferralCode } from '../lib/referral-tracking';

/**
 * Custom hook for managing referral tracking
 * Automatically detects and tracks referral codes from URL
 * Returns referral data including promo code to auto-apply
 */
export function useReferral() {
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initReferral() {
      try {
        const data = await initializeReferralTracking();
        setReferralData(data);
      } catch (error) {
        console.error('Error initializing referral tracking:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initReferral();
  }, []);

  return {
    referralData,
    referralCode: referralData?.referralCode || null,
    promoCode: referralData?.promoCode || null,
    influencerName: referralData?.influencerName || null,
    isLoading,
  };
}

/**
 * Simple hook to just get the active referral code
 * Useful for checkout and order completion
 */
export function useActiveReferralCode() {
  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    const code = getActiveReferralCode();
    setReferralCode(code);
  }, []);

  return referralCode;
}
