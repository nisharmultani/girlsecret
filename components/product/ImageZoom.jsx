import { useState, useRef } from 'react';
import Image from 'next/image';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

export default function ImageZoom({ src, alt, className = '' }) {
  const [isZoomed, setIsZoomed] = useState(false);
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
    <div
      ref={imageRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-200"
        style={{
          transform: isZoomed ? `scale(2)` : 'scale(1)',
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
        }}
        priority
      />

      {/* Zoom indicator */}
      {!isZoomed && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 shadow-md">
          <MagnifyingGlassPlusIcon className="w-4 h-4" />
          <span>Hover to zoom</span>
        </div>
      )}
    </div>
  );
}
