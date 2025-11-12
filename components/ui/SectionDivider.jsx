export default function SectionDivider({ variant = 'simple' }) {
  if (variant === 'simple') {
    return (
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>
    );
  }

  if (variant === 'pattern') {
    return (
      <div className="py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-xs"></div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full max-w-xs"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-gray-300"
                style={{ opacity: i === 2 ? 1 : 0.5 }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <svg
            className="w-full h-8 text-gray-200"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,20 Q300,0 600,20 T1200,20 V40 H0 Z" />
          </svg>
        </div>
      </div>
    );
  }

  return null;
}
