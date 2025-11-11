import { WifiOffIcon } from '@heroicons/react/24/outline';

export default function Offline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full shadow-xl">
              <WifiOffIcon className="h-20 w-20 text-rose-500" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4">You're Offline</h1>

        <p className="text-lg text-gray-600 mb-8">
          It looks like you've lost your internet connection. Don't worry, you can still browse cached pages!
        </p>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full btn-blush py-4 text-lg font-bold shadow-xl"
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-400 px-6 py-4 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all duration-300"
          >
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Make sure you're connected to the internet and try again.
          </p>
        </div>
      </div>
    </div>
  );
}

// This page doesn't need the layout
Offline.getLayout = (page) => page;
