import { useState, useRef } from 'react';
import Image from 'next/image';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

export default function ImageZoom({ src, alt, priority = false, children, className = '' }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 ${className}`}>
      <div
        ref={imageRef}
        className="relative w-full h-full cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-transform duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            transform: isZoomed ? `scale(2)` : 'scale(1)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          }}
          priority={priority}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 shadow-md">
            <MagnifyingGlassPlusIcon className="w-4 h-4" />
            <span>Hover to zoom</span>
          </div>
        )}

        {/* Render children (like discount badges) */}
        {children}
      </div>
    </div>
  );
}
