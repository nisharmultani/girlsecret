import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ReviewsModal({ isOpen, onClose, reviews, averageRating, productName }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold text-gray-900 mb-2"
                    >
                      Customer Reviews
                    </Dialog.Title>
                    <p className="text-sm text-gray-600">{productName}</p>

                    {/* Overall Rating Summary */}
                    {reviews.length > 0 && (
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              star <= Math.round(averageRating) ? (
                                <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                              ) : (
                                <StarOutlineIcon key={star} className="h-5 w-5 text-gray-300" />
                              )
                            ))}
                          </div>
                          <span className="text-lg font-semibold text-gray-900">
                            {averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {/* Reviews List */}
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-center text-gray-600 py-8">No reviews yet.</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold">
                              {review.name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{review.name}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_At).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  star <= review.rating ? (
                                    <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                                  ) : (
                                    <StarOutlineIcon key={star} className="h-4 w-4 text-gray-300" />
                                  )
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {review.images.map((image, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                  src={image.url || image.thumbnails?.large?.url}
                                  alt={`Review image ${index + 1}`}
                                  fill
                                  className="object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                                  onClick={() => window.open(image.url, '_blank')}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Review Comment */}
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
