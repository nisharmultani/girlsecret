import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import GoogleTagManager, { GoogleTagManagerNoScript } from '../GoogleTagManager';
import GoogleAdsense from '../GoogleAdsense';

export default function Layout({ children }) {
  return (
    <>
      <GoogleTagManager />
      <GoogleAdsense />
      <GoogleTagManagerNoScript />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-28 md:pt-32">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </>
  );
}
