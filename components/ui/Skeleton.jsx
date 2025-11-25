/**
 * Reusable Skeleton Component for Loading States
 * Provides smooth shimmer animation for better perceived performance
 */

export default function Skeleton({ className = '', variant = 'default', width, height, circle = false }) {
  const baseClass = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

  const variants = {
    default: 'rounded',
    text: 'rounded h-4 mb-2',
    title: 'rounded h-8 mb-4',
    button: 'rounded-lg h-10',
    card: 'rounded-xl',
    image: 'rounded-lg aspect-square',
  };

  const variantClass = variants[variant] || variants.default;
  const shapeClass = circle ? 'rounded-full' : variantClass;

  const style = {
    width: width || '100%',
    height: height || undefined,
    animation: 'shimmer 2s infinite',
  };

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
      <div
        className={`${baseClass} ${shapeClass} ${className}`}
        style={style}
      />
    </>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <Skeleton variant="image" className="w-full h-64" />
      <div className="p-4">
        <Skeleton variant="text" className="w-3/4 mb-2" />
        <Skeleton variant="text" className="w-1/2 mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-20 h-6" />
          <Skeleton variant="button" className="w-24 h-9" />
        </div>
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <Skeleton circle width="48px" height="48px" />
      <div className="flex-1">
        <Skeleton variant="text" className="w-2/3 mb-2" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <Skeleton variant="button" className="w-20" />
    </div>
  );
}

// Order Card Skeleton
export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="title" className="w-32" />
        <Skeleton variant="text" className="w-20" />
      </div>
      <Skeleton variant="text" className="w-full mb-2" />
      <Skeleton variant="text" className="w-3/4 mb-2" />
      <Skeleton variant="text" className="w-1/2 mb-4" />
      <div className="flex gap-3">
        <Skeleton variant="button" className="flex-1" />
        <Skeleton variant="button" className="flex-1" />
      </div>
    </div>
  );
}

// Cart Item Skeleton
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <Skeleton className="w-24 h-24 flex-shrink-0" />
      <div className="flex-1">
        <Skeleton variant="text" className="w-3/4 mb-2" />
        <Skeleton variant="text" className="w-1/2 mb-2" />
        <Skeleton variant="text" className="w-1/4" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="button" className="w-8 h-8" />
      </div>
    </div>
  );
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton variant="title" className="w-64 h-10 mb-4" />
      <Skeleton variant="text" className="w-full max-w-2xl mb-2" />
      <Skeleton variant="text" className="w-3/4 max-w-xl" />
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr className="border-b border-gray-200">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton variant="text" className="w-full" />
        </td>
      ))}
    </tr>
  );
}
