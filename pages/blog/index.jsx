import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BlogCard, { BlogCardSkeleton } from '../../components/blog/BlogCard';
import SEO from '../../components/SEO';
import { getAllBlogPosts, getBlogCategories, getBlogTags } from '../../lib/airtable';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function BlogPage({ initialPosts, categories, tags }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredPosts(posts);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setFilteredPosts(data.posts);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSelectedTag('');
    setSearchQuery('');

    if (!category) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) => post.category === category);
    setFilteredPosts(filtered);
  };

  // Handle tag filter
  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    setSelectedCategory('');
    setSearchQuery('');

    if (!tag) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) =>
      post.tags && post.tags.includes(tag)
    );
    setFilteredPosts(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchQuery('');
    setFilteredPosts(posts);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory || selectedTag || searchQuery;

  return (
    <>
      <SEO
        title="Blog - GirlSecret"
        description="Discover the latest fashion trends, style tips, and beauty advice on the GirlSecret blog."
        canonical="/blog"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                GirlSecret Blog
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Fashion trends, style tips, and beauty advice
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Filters (Desktop: Always visible, Mobile: Toggle) */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => handleTagFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Active filters:
                </span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full text-sm">
                    {selectedCategory}
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className="hover:text-gray-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full text-sm">
                    {selectedTag}
                    <button
                      onClick={() => handleTagFilter('')}
                      className="hover:text-gray-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded-full text-sm">
                    &quot;{searchQuery}&quot;
                    <button
                      onClick={() => handleSearch('')}
                      className="hover:text-gray-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Posts Grid */}
          {!isSearching && filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isSearching && filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">
                No blog posts found
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-black font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Server-side data fetching
export async function getStaticProps() {
  try {
    const [posts, categories, tags] = await Promise.all([
      getAllBlogPosts(),
      getBlogCategories(),
      getBlogTags(),
    ]);

    return {
      props: {
        initialPosts: posts,
        categories,
        tags,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      props: {
        initialPosts: [],
        categories: [],
        tags: [],
      },
      revalidate: 60,
    };
  }
}
