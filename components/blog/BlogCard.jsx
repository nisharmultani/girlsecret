import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ClockIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

/**
 * BlogCard Component
 * Displays a blog post preview card with image, title, excerpt, and metadata
 */
export default function BlogCard({ post }) {
  const {
    slug,
    title,
    excerpt,
    featuredImage,
    category,
    publishedDate,
    readTime,
    author,
  } = post;

  // Format the published date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get featured image URL
  const getImageUrl = () => {
    if (!featuredImage) {
      return '/images/blog-placeholder.jpg';
    }

    // If it's an Airtable attachment array
    if (Array.isArray(featuredImage) && featuredImage.length > 0) {
      return featuredImage[0].url;
    }

    // If it's a direct URL string
    if (typeof featuredImage === 'string') {
      return featuredImage;
    }

    return '/images/blog-placeholder.jpg';
  };

  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      <Link href={`/blog/${slug}`}>
        {/* Featured Image */}
        <div className="relative h-56 bg-gray-200 overflow-hidden">
          <Image
          height={4}
          width={4}
            src={getImageUrl()}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/images/blog-placeholder.jpg';
            }}
          />

          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {/* Published Date */}
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(publishedDate)}</span>
            </div>

            {/* Read Time */}
            {readTime && (
              <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                <span>{readTime} min read</span>
              </div>
            )}
          </div>

          {/* Author */}
          {author && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-700">
                By <span className="font-medium">{author}</span>
              </p>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

/**
 * BlogCardSkeleton Component
 * Loading skeleton for BlogCard
 */
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-56 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />

        {/* Excerpt Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>

        {/* Metadata Skeleton */}
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>

        {/* Author Skeleton */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}
