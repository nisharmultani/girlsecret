import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * STUNNING Image Loader with beautiful animations
 * Shows exciting loading states while images load
 */
export default function ImageLoader({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover',
  loadingAnimation = 'hearts' // 'hearts', 'sparkles', 'elegant'
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setProgress(0);

    // Simulate progress for visual feedback
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [src, isLoading]);

  const renderLoadingAnimation = () => {
    switch(loadingAnimation) {
      case 'sparkles':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Multiple sparkles with different animations */}
            <div className="relative w-24 h-24">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: `float 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                    transform: `rotate(${i * 60}deg) translateY(-20px)`
                  }}
                >
                  <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              ))}
              {/* Center sparkle */}
              <svg className="w-12 h-12 text-rose-500 animate-pulse-soft absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );

      case 'elegant':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Spinning ring */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-rose-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-rose-500 rounded-full animate-spin" />
              <div className="absolute inset-2 border-2 border-transparent border-t-blush-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
            </div>
            {/* Progress text */}
            <div className="text-center">
              <p className="text-sm font-medium text-rose-600 animate-pulse-soft">
                {progress}%
              </p>
            </div>
          </div>
        );

      case 'hearts':
      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Floating hearts from bottom */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 animate-float opacity-0"
                style={{
                  left: `${20 + i * 15}%`,
                  animation: `floatUp 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`
                }}
              >
                <svg className="w-6 h-6 text-rose-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            ))}

            {/* Center pulsing heart */}
            <div className="relative z-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-rose-200 rounded-full blur-xl animate-pulse-soft" />
              </div>
              <svg className="w-16 h-16 text-rose-500 animate-scale-in relative z-10" fill="currentColor" viewBox="0 0 24 24"
                   style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Stunning Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-blush-50 to-lavender-50 overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 via-transparent to-blush-100/50 animate-pulse-soft" />

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />

          {renderLoadingAnimation()}

          {/* Loading text */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs font-semibold text-rose-500 animate-pulse-soft tracking-wide">
              Loading something beautiful...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">Unable to load image</p>
          </div>
        </div>
      )}

      {/* Actual Image with stunning entrance */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-all duration-700 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{ objectFit }}
        priority={priority}
        onLoadingComplete={() => {
          setProgress(100);
          setTimeout(() => setIsLoading(false), 200);
        }}
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
