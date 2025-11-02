import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SizeGuideModal({ isOpen, onClose, category = 'Bras' }) {
  // Size guide data based on category
  const sizeGuides = {
    Bras: {
      title: 'Bra Size Guide',
      description: 'Find your perfect fit with our comprehensive bra size guide.',
      measurements: [
        { size: '32A', bust: '81-84 cm', underbust: '69-73 cm', cup: 'A' },
        { size: '32B', bust: '84-86 cm', underbust: '69-73 cm', cup: 'B' },
        { size: '32C', bust: '86-89 cm', underbust: '69-73 cm', cup: 'C' },
        { size: '34A', bust: '86-89 cm', underbust: '74-78 cm', cup: 'A' },
        { size: '34B', bust: '89-91 cm', underbust: '74-78 cm', cup: 'B' },
        { size: '34C', bust: '91-94 cm', underbust: '74-78 cm', cup: 'C' },
        { size: '34D', bust: '94-97 cm', underbust: '74-78 cm', cup: 'D' },
        { size: '36A', bust: '91-94 cm', underbust: '79-83 cm', cup: 'A' },
        { size: '36B', bust: '94-97 cm', underbust: '79-83 cm', cup: 'B' },
        { size: '36C', bust: '97-99 cm', underbust: '79-83 cm', cup: 'C' },
        { size: '36D', bust: '99-102 cm', underbust: '79-83 cm', cup: 'D' },
        { size: '38B', bust: '99-102 cm', underbust: '84-88 cm', cup: 'B' },
        { size: '38C', bust: '102-104 cm', underbust: '84-88 cm', cup: 'C' },
        { size: '38D', bust: '104-107 cm', underbust: '84-88 cm', cup: 'D' },
      ],
      tips: [
        'Measure around the fullest part of your bust',
        'Keep the tape measure level and snug',
        'Measure your underbust directly under your bust',
        'Round to the nearest whole number',
      ],
    },
    Panties: {
      title: 'Panty Size Guide',
      description: 'Find the perfect fit for maximum comfort.',
      measurements: [
        { size: 'XS', waist: '61-66 cm', hips: '84-89 cm', uk: '6-8' },
        { size: 'S', waist: '66-71 cm', hips: '89-94 cm', uk: '8-10' },
        { size: 'M', waist: '71-76 cm', hips: '94-99 cm', uk: '10-12' },
        { size: 'L', waist: '76-81 cm', hips: '99-104 cm', uk: '12-14' },
        { size: 'XL', waist: '81-89 cm', hips: '104-112 cm', uk: '14-16' },
        { size: 'XXL', waist: '89-97 cm', hips: '112-119 cm', uk: '16-18' },
      ],
      tips: [
        'Measure around your natural waistline',
        'Measure around the fullest part of your hips',
        'Stand straight with feet together',
        'Don\'t pull the tape too tight',
      ],
    },
    Lingerie: {
      title: 'Lingerie Size Guide',
      description: 'Find your perfect lingerie size for comfort and style.',
      measurements: [
        { size: 'XS', bust: '81-84 cm', waist: '61-66 cm', hips: '84-89 cm', uk: '6-8' },
        { size: 'S', bust: '84-89 cm', waist: '66-71 cm', hips: '89-94 cm', uk: '8-10' },
        { size: 'M', bust: '89-94 cm', waist: '71-76 cm', hips: '94-99 cm', uk: '10-12' },
        { size: 'L', bust: '94-99 cm', waist: '76-81 cm', hips: '99-104 cm', uk: '12-14' },
        { size: 'XL', bust: '99-107 cm', waist: '81-89 cm', hips: '104-112 cm', uk: '14-16' },
        { size: 'XXL', bust: '107-114 cm', waist: '89-97 cm', hips: '112-119 cm', uk: '16-18' },
      ],
      tips: [
        'Measure bust at the fullest point',
        'Measure waist at the narrowest point',
        'Measure hips at the fullest point',
        'Wear minimal clothing for accurate measurements',
      ],
    },
  };

  const guide = sizeGuides[category] || sizeGuides.Lingerie;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-serif font-bold text-gray-900">
                    {guide.title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">{guide.description}</p>

                {/* Size Chart */}
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Size
                        </th>
                        {Object.keys(guide.measurements[0])
                          .filter((key) => key !== 'size')
                          .map((key) => (
                            <th
                              key={key}
                              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {guide.measurements.map((measurement, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {measurement.size}
                          </td>
                          {Object.entries(measurement)
                            .filter(([key]) => key !== 'size')
                            .map(([key, value]) => (
                              <td
                                key={key}
                                className="px-4 py-3 text-sm text-gray-700"
                              >
                                {value}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Measuring Tips */}
                <div className="bg-rose-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    How to Measure
                  </h3>
                  <ul className="space-y-2">
                    {guide.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Close Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
