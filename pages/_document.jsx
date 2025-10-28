import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
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
              sameAs: [
                'https://www.facebook.com/girlsecret',
                'https://www.instagram.com/girlsecret',
                'https://www.twitter.com/girlsecret',
                'https://www.pinterest.com/girlsecret',
              ],
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
