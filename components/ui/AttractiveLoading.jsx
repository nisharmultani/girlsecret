import { useState, useEffect } from 'react';
import { SparklesIcon, TruckIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function AttractiveLoading({ message = 'Loading...' }) {
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "First Order?",
      description: "Get 15% off with code WELCOME15",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Free Shipping",
      description: "On all orders over £50",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Secure Shopping",
      description: "Your data is safe with us",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Luxury lingerie at great prices",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-md w-full mx-4">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-center text-lg font-medium text-gray-900 mb-8">
          {message}
        </p>

        {/* Offer Cards */}
        <div className="relative h-48 overflow-hidden">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 transform ${
                index === currentOffer
                  ? 'opacity-100 translate-y-0'
                  : index < currentOffer
                  ? 'opacity-0 -translate-y-full'
                  : 'opacity-0 translate-y-full'
              }`}
            >
              <div className={`bg-gradient-to-r ${offer.color} rounded-2xl p-6 text-white shadow-xl`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    {offer.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-white/90">{offer.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentOffer(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentOffer
                  ? 'w-8 bg-black'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to offer ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
