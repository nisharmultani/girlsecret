// Referral tracking utility for browser-side operations

const REFERRAL_STORAGE_KEY = 'girlsecret_referral_code';
const REFERRAL_EXPIRY_DAYS = 30; // Referral code valid for 30 days

/**
 * Get referral code from URL parameter
 */
export function getReferralCodeFromUrl() {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
}

/**
 * Store referral code in localStorage with expiry
 */
export function storeReferralCode(referralCode) {
  if (typeof window === 'undefined') return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS);

  const referralData = {
    code: referralCode.toUpperCase(),
    expiryDate: expiryDate.toISOString(),
    clickedAt: new Date().toISOString(),
  };

  localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referralData));
}

/**
 * Get stored referral code (if not expired)
 */
export function getStoredReferralCode() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!stored) return null;

    const referralData = JSON.parse(stored);
    const expiryDate = new Date(referralData.expiryDate);

    // Check if expired
    if (expiryDate < new Date()) {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return null;
    }

    return referralData.code;
  } catch (error) {
    console.error('Error reading referral code from storage:', error);
    return null;
  }
}

/**
 * Clear stored referral code
 */
export function clearReferralCode() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

/**
 * Track referral click (call API to increment click count)
 */
export async function trackReferralClick(referralCode) {
  try {
    const response = await fetch('/api/influencer/track-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referralCode }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error tracking referral click:', error);
    return false;
  }
}

/**
 * Get referral data from API
 */
export async function getReferralData(referralCode) {
  try {
    const response = await fetch(`/api/influencer/${referralCode}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.referral : null;
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return null;
  }
}

/**
 * Initialize referral tracking on page load
 * This should be called in _app.js or layout component
 */
export async function initializeReferralTracking() {
  if (typeof window === 'undefined') return null;

  // Check if there's a ref parameter in the URL
  const urlReferralCode = getReferralCodeFromUrl();

  if (urlReferralCode) {
    // New referral link clicked
    console.log('Referral code detected:', urlReferralCode);

    // Fetch referral data to validate and get promo code
    const referralData = await getReferralData(urlReferralCode);

    if (referralData) {
      // Store the referral code
      storeReferralCode(urlReferralCode);

      // Track the click
      await trackReferralClick(urlReferralCode);

      console.log('Referral tracked:', referralData);

      // Return referral data (including promo code to auto-apply)
      return referralData;
    }
  } else {
    // Check if we have a stored referral code
    const storedCode = getStoredReferralCode();

    if (storedCode) {
      // Return stored referral data
      const referralData = await getReferralData(storedCode);
      return referralData;
    }
  }

  return null;
}

/**
 * Get active referral code (from URL or storage)
 */
export function getActiveReferralCode() {
  const urlCode = getReferralCodeFromUrl();
  if (urlCode) return urlCode;

  return getStoredReferralCode();
}
