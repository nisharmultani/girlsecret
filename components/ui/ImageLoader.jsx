import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Exciting Image Loader with animations
 * Shows beautiful loading states while images load
 */
export default function ImageLoader({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover',
  loadingAnimation = 'shimmer' // 'shimmer', 'pulse', 'glow'
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const getLoadingAnimation = () => {
    switch(loadingAnimation) {
      case 'pulse':
        return 'animate-pulse-soft';
      case 'glow':
        return 'animate-glow';
      case 'shimmer':
      default:
        return 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer';
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Exciting Loading State */}
      {isLoading && !hasError && (
        <div className={`absolute inset-0 bg-gradient-to-br from-rose-100 via-blush-100 to-lavender-100 ${getLoadingAnimation()}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Animated hearts while loading */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center animate-float">
                <svg className="w-12 h-12 text-rose-300 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-400 animate-pulse-soft" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>
          {/* Optional loading text */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs font-medium text-rose-500 animate-pulse-soft">
              Loading beauty...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-400">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}
        style={{ objectFit }}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

/**
 * Product Image Loader - Specialized for product images
 */
export function ProductImageLoader({
  src,
  alt,
  className = '',
  priority = false
}) {
  return (
    <ImageLoader
      src={src}
      alt={alt}
      width={600}
      height={600}
      className={`rounded-lg ${className}`}
      priority={priority}
      loadingAnimation="shimmer"
    />
  );
}

/**
 * Hero Image Loader - For large hero images
 */
export function HeroImageLoader({
  src,
  alt,
  className = '',
  priority = true
}) {
  return (
    <ImageLoader
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      className={className}
      priority={priority}
      objectFit="cover"
      loadingAnimation="glow"
    />
  );
}
