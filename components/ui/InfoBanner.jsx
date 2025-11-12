import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function InfoBanner({
  message = 'Free shipping on orders over £50',
  link = '/shop',
  linkText = 'Shop Now',
  dismissible = true,
  storageKey = 'infoBannerDismissed',
  backgroundColor = 'bg-black',
  textColor = 'text-white',
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (dismissible && typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    }
  }, [dismissible, storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (dismissible && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${backgroundColor} ${textColor} py-2 px-4 sm:px-6 lg:px-8 relative z-50`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-sm sm:text-base">
        <p className="font-medium">
          {message}
          {link && linkText && (
            <>
              {' '}
              <a
                href={link}
                className="underline hover:no-underline transition-all font-semibold ml-1"
              >
                {linkText} →
              </a>
            </>
          )}
        </p>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-2 sm:right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
