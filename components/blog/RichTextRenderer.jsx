import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';

/**
 * RichTextRenderer Component
 * Renders Markdown content with support for:
 * - Headings (h1-h6)
 * - Lists (ordered and unordered)
 * - Links
 * - Images
 * - Code blocks
 * - Tables
 * - Bold, italic, strikethrough
 * - Blockquotes
 */
export default function RichTextRenderer({ content, className = '' }) {
  const components = {
    // Custom heading styles
    h1: ({ node, ...props }) => (
      <h1
        className="text-4xl font-bold text-gray-900 mb-6 mt-8 leading-tight"
        {...props}
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        className="text-3xl font-bold text-gray-900 mb-5 mt-7 leading-tight"
        {...props}
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className="text-2xl font-semibold text-gray-900 mb-4 mt-6"
        {...props}
      />
    ),
    h4: ({ node, ...props }) => (
      <h4
        className="text-xl font-semibold text-gray-900 mb-3 mt-5"
        {...props}
      />
    ),
    h5: ({ node, ...props }) => (
      <h5
        className="text-lg font-semibold text-gray-900 mb-3 mt-4"
        {...props}
      />
    ),
    h6: ({ node, ...props }) => (
      <h6
        className="text-base font-semibold text-gray-900 mb-2 mt-3"
        {...props}
      />
    ),

    // Paragraphs
    p: ({ node, ...props }) => (
      <p className="text-gray-700 leading-relaxed mb-4" {...props} />
    ),

    // Links
    a: ({ node, ...props }) => (
      <a
        className="text-black font-medium hover:text-gray-600 underline underline-offset-2 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),

    // Unordered lists
    ul: ({ node, ...props }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />
    ),

    // Ordered lists
    ol: ({ node, ...props }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />
    ),

    // List items
    li: ({ node, ...props }) => (
      <li className="text-gray-700 leading-relaxed" {...props} />
    ),

    // Blockquotes
    blockquote: ({ node, ...props }) => (
      <blockquote
        className="border-l-4 border-gray-900 pl-4 py-2 my-4 italic text-gray-700 bg-gray-50"
        {...props}
      />
    ),

    // Code blocks
    code: ({ node, inline, ...props }) => {
      if (inline) {
        return (
          <code
            className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          />
        );
      }
      return (
        <code
          className="block bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto text-sm font-mono"
          {...props}
        />
      );
    },

    // Pre (code block wrapper)
    pre: ({ node, ...props }) => (
      <pre className="mb-4 overflow-x-auto" {...props} />
    ),

    // Images
    img: ({ node, ...props }) => {
      const { src, alt } = props;
      if (!src) return null;

      return (
        <span className="block my-6">
          <Image
            src={src}
            height={2}
            width={2}
            alt={alt || ''}
            className="rounded-lg max-w-full h-auto mx-auto shadow-md"
            loading="lazy"
          />
          {alt && (
            <span className="block text-center text-sm text-gray-600 mt-2 italic">
              {alt}
            </span>
          )}
        </span>
      );
    },

    // Tables
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table
          className="min-w-full border-collapse border border-gray-300"
          {...props}
        />
      </div>
    ),

    thead: ({ node, ...props }) => (
      <thead className="bg-gray-100" {...props} />
    ),

    tbody: ({ node, ...props }) => (
      <tbody className="divide-y divide-gray-200" {...props} />
    ),

    tr: ({ node, ...props }) => <tr {...props} />,

    th: ({ node, ...props }) => (
      <th
        className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900"
        {...props}
      />
    ),

    td: ({ node, ...props }) => (
      <td
        className="border border-gray-300 px-4 py-2 text-gray-700"
        {...props}
      />
    ),

    // Horizontal rule
    hr: ({ node, ...props }) => (
      <hr className="my-8 border-t border-gray-300" {...props} />
    ),

    // Strong (bold)
    strong: ({ node, ...props }) => (
      <strong className="font-bold text-gray-900" {...props} />
    ),

    // Emphasis (italic)
    em: ({ node, ...props }) => (
      <em className="italic text-gray-700" {...props} />
    ),

    // Delete (strikethrough)
    del: ({ node, ...props }) => (
      <del className="line-through text-gray-500" {...props} />
    ),
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
