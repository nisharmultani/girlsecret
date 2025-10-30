import Script from 'next/script';

/**
 * Google Analytics 4 (GA4) Component
 *
 * This component loads Google Analytics 4 tracking script.
 * Can work standalone or alongside Google Tag Manager.
 *
 * Setup:
 * 1. Get your GA4 Measurement ID from Google Analytics (format: G-XXXXXXXXXX)
 * 2. Add NEXT_PUBLIC_GA4_ID to your .env file
 * 3. Include this component in your _app.jsx or layout
 *
 * @component
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  // Don't load in development or if GA ID is not configured
  if (!gaId || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Helper function to track custom events
 *
 * Usage:
 * import { trackEvent } from '@/components/GoogleAnalytics';
 * trackEvent('purchase', { value: 99.99, currency: 'USD' });
 *
 * @param {string} eventName - The name of the event
 * @param {object} eventParams - Parameters for the event
 */
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Helper function to track page views
 * Useful for single-page applications
 *
 * @param {string} url - The page URL
 */
export function trackPageView(url) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA4_ID, {
      page_path: url,
    });
  }
}

/**
 * Helper function to track e-commerce events
 * For tracking product purchases, add to cart, etc.
 *
 * @param {string} eventType - Type of event (view_item, add_to_cart, purchase, etc.)
 * @param {object} eventData - Event data following GA4 e-commerce schema
 */
export function trackEcommerce(eventType, eventData) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventType, eventData);
  }
}
