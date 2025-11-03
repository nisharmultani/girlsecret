import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ReviewForm({ productId, onSubmitSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));

    if (validFiles.length + imageFiles.length > 4) {
      alert('You can only upload up to 4 images');
      return;
    }

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setImageFiles([...imageFiles, ...validFiles]);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data) => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setIsSubmitting(true);

    try {
      // If there are images, we need to upload them first
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file, index) => {
          formData.append(`images`, file);
        });

        const uploadResponse = await fetch('/api/upload-review-images', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrls = uploadData.urls || [];
        }
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          name: data.name,
          email: data.email,
          rating,
          comment: data.comment,
          images: imageUrls,
        }),
      });

      if (response.ok) {
        reset();
        setRating(0);
        setImageFiles([]);
        setImagePreviews([]);

        // Show a nice success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        successDiv.innerHTML = `
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-fade-in">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 text-center mb-2">Thank You!</h3>
            <p class="text-gray-600 text-center mb-6">Your review has been submitted successfully and will be published after approval.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Close
            </button>
          </div>
        `;
        document.body.appendChild(successDiv);

        setTimeout(() => {
          successDiv.remove();
          if (onSubmitSuccess) onSubmitSuccess();
        }, 3000);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              {star <= (hoveredRating || rating) ? (
                <StarIcon className="h-8 w-8 text-gold-500" />
              ) : (
                <StarOutlineIcon className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="input-field"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Your Email <span className="text-gray-500 text-xs">(Optional - for follow-up only)</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email', {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="input-field"
          placeholder="your@email.com (optional)"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">We only use this to contact you about your review if needed</p>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="comment"
          rows={4}
          {...register('comment', { required: 'Review is required' })}
          className="input-field"
          placeholder="Share your experience with this product..."
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photos (Optional)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Share photos of the product! Maximum 4 images.
        </p>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {imagePreviews.length < 4 && (
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-rose-400 hover:bg-rose-50 transition-colors cursor-pointer">
            <PhotoIcon className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-600">
              {imagePreviews.length === 0 ? 'Upload Images' : `Add More (${4 - imagePreviews.length} left)`}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
