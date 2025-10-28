import Script from 'next/script';

export default function GoogleAdsense() {
  const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!ADSENSE_ID) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

// Individual Ad Component
export function AdUnit({ slot, format = 'auto', responsive = true, style = {} }) {
  const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!ADSENSE_ID) return null;

  return (
    <div className="ad-container my-4" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}
