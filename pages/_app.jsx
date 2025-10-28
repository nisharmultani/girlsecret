import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import SEO from '../components/SEO';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Track page views with GTM
    const handleRouteChange = (url) => {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'pageview',
          page: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Check if component has custom layout
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return getLayout(
    <>
      <SEO page={pageProps.seo} />
      <Component {...pageProps} />
    </>
  );
}
