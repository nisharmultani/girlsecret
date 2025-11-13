import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import RichTextRenderer from '../../components/blog/RichTextRenderer';
import BlogCard from '../../components/blog/BlogCard';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from '../../lib/airtable';
import {
  ClockIcon,
  CalendarIcon,
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

export default function BlogPostPage({ post, relatedPosts }) {
  const router = useRouter();

  // Show loading state while page is being generated
  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <Link
            href="/blog"
            className="text-black font-medium hover:underline"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    content,
    featuredImage,
    category,
    tags,
    author,
    publishedDate,
    readTime,
    metaDescription,
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

    if (Array.isArray(featuredImage) && featuredImage.length > 0) {
      return featuredImage[0].url;
    }

    if (typeof featuredImage === 'string') {
      return featuredImage;
    }

    return '/images/blog-placeholder.jpg';
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: metaDescription || title,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const imageUrl = getImageUrl();

  return (
    <>
      <SEO
        title={`${title} - GirlSecret Blog`}
        description={metaDescription || content.substring(0, 160)}
        canonical={`/blog/${post.slug}`}
        image={imageUrl}
        type="article"
      />

      <div className="min-h-screen bg-white">
        {/* Back to Blog Link */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Badge */}
          {category && (
            <div className="mb-6">
              <Link href={`/blog/category/${category.toLowerCase()}`}>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer">
                  {category}
                </span>
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            {/* Author */}
            {author && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{author}</span>
              </div>
            )}

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

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ShareIcon className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-12">
              <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/blog-placeholder.jpg';
                  }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <RichTextRenderer content={content} />
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                <TagIcon className="w-5 h-5 text-gray-600" />
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-black text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want More Fashion Inspiration?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Explore our collection of trendy products
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Generate static paths for all blog posts
export async function getStaticPaths() {
  try {
    const posts = await getAllBlogPosts();
    const paths = posts.map((post) => ({
      params: { slug: post.slug },
    }));

    return {
      paths,
      fallback: true, // Enable ISR for new posts
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

// Fetch post data for each page
export async function getStaticProps({ params }) {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    // Fetch related posts
    const relatedPosts = await getRelatedBlogPosts(
      post.id,
      post.category,
      3
    );

    return {
      props: {
        post,
        relatedPosts,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true,
    };
  }
}
