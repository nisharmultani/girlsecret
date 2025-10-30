import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const searchConsoleVerification = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION;

  return (
    <Html lang="en">
      <Head>
        {/* Google Search Console Verification */}
        {searchConsoleVerification && (
          <meta name="google-site-verification" content={searchConsoleVerification} />
        )}

        {/* Character Encoding */}
        <meta charSet="utf-8" />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GirlSecret',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com'}/logo.png`,
              description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Luxury beauty and lifestyle products',
              sameAs: [
                'https://www.facebook.com/girlsecret',
                'https://www.instagram.com/girlsecret',
                'https://www.twitter.com/girlsecret',
                'https://www.pinterest.com/girlsecret',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: ['English']
              }
            }),
          }}
        />

        {/* WebSite Schema for Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GirlSecret',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://girlsecret.com'}/shop?search={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
