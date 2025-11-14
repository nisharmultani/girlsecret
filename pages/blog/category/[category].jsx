import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BlogCard, { BlogCardSkeleton } from '../../../components/blog/BlogCard';
import SEO from '../../../components/SEO';
import { getAllBlogPosts, getBlogCategories } from '../../../lib/airtable';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CategoryPage({ category, posts, allCategories }) {
  const router = useRouter();

  // Show loading state while page is being generated
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No posts found in this category
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

  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      <SEO
        title={`${capitalizedCategory} - Blog - GirlSecret`}
        description={`Browse all ${capitalizedCategory} posts on the GirlSecret blog.`}
        canonical={`/blog/category/${category}`}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Back to Blog Link */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to All Posts
            </Link>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {capitalizedCategory}
              </h1>
              <p className="text-xl text-gray-300">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this
                category
              </p>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        {allCategories && allCategories.length > 1 && (
          <div className="bg-white border-b border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  All Posts
                </Link>
                {allCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/blog/category/${cat.toLowerCase()}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      cat.toLowerCase() === category.toLowerCase()
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Generate static paths for all categories
export async function getStaticPaths() {
  try {
    const categories = await getBlogCategories();
    const paths = categories.map((category) => ({
      params: { category: category.toLowerCase() },
    }));

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.error('Error generating category paths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

// Fetch posts for each category
export async function getStaticProps({ params }) {
  try {
    const { category } = params;

    // Fetch all categories for navigation
    const allCategories = await getBlogCategories();

    // Find the matching category (case-insensitive)
    const matchingCategory = allCategories.find(
      (cat) => cat.toLowerCase() === category.toLowerCase()
    );

    if (!matchingCategory) {
      return {
        notFound: true,
      };
    }

    // Fetch posts for this category
    const posts = await getAllBlogPosts({ category: matchingCategory });

    return {
      props: {
        category: matchingCategory,
        posts,
        allCategories,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return {
      notFound: true,
    };
  }
}
