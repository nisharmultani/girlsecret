import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import GoogleAnalytics, { trackPageView } from '../components/GoogleAnalytics';
import { AuthProvider } from '../context/AuthContext';
import { WishlistProvider } from '../context/WishlistContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Track page views with GTM and GA4
    const handleRouteChange = (url) => {
      // GTM tracking
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'pageview',
          page: url,
        });
      }

      // GA4 tracking
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Check if component has custom layout
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <AuthProvider>
      <WishlistProvider>
        <GoogleAnalytics />
        {getLayout(
          <>
            <SEO page={pageProps.seo} />
            <Component {...pageProps} />
          </>
        )}
      </WishlistProvider>
    </AuthProvider>
  );
}
