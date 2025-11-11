import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  UserCircleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  HeartIcon as HeartIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getCartCount } from '../../lib/cart';
import { useWishlist } from '../../context/WishlistContext';

const navItems = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: 'Shop',
    href: '/shop',
    icon: Squares2X2Icon,
    iconSolid: Squares2X2IconSolid,
  },
  {
    name: 'Cart',
    href: '/cart',
    icon: ShoppingBagIcon,
    iconSolid: ShoppingBagIconSolid,
    showBadge: true,
  },
  {
    name: 'Wishlist',
    href: '/account/wishlist',
    icon: HeartIcon,
    iconSolid: HeartIconSolid,
    showWishlistBadge: true,
  },
  {
    name: 'Account',
    href: '/account',
    icon: UserCircleIcon,
    iconSolid: UserCircleIconSolid,
  },
];

export default function BottomNav() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Don't show bottom nav on certain pages
  const hideOnRoutes = ['/checkout', '/admin'];
  const shouldHide = hideOnRoutes.some((route) => router.pathname.startsWith(route));

  if (shouldHide) return null;

  return (
    <>
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-20 lg:hidden" />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            // Check for exact match first
            let isActive = router.pathname === item.href;

            // For non-exact matches, check if pathname starts with href
            // But exclude if this is Account tab and we're on wishlist (which has its own tab)
            if (!isActive && item.href !== '/') {
              if (item.href === '/account') {
                // Account tab should only be active for /account pages that aren't /account/wishlist
                isActive = router.pathname.startsWith('/account') && router.pathname !== '/account/wishlist';
              } else {
                // For other tabs, just check if pathname starts with href
                isActive = router.pathname.startsWith(item.href);
              }
            }

            const Icon = isActive ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex flex-col items-center justify-center min-w-[64px] px-3 py-2 rounded-xl
                  transition-all duration-300 active:scale-95
                  ${isActive
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
                  }
                `}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />

                  {/* Cart Badge */}
                  {item.showBadge && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}

                  {/* Wishlist Badge */}
                  {item.showWishlistBadge && wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </div>

                <span className={`text-xs font-semibold mt-1 ${isActive ? 'font-bold' : ''}`}>
                  {item.name}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-rose-600 rounded-b-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
