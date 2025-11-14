# Blog System Setup Guide

This guide will help you set up the blog system with Airtable integration.

## Airtable Table Setup

### 1. Create a new table called `BlogPosts` in your Airtable base

### 2. Add the following fields:

| Field Name | Field Type | Description | Required |
|------------|-----------|-------------|----------|
| **Title** | Single line text | The blog post title | Yes |
| **Slug** | Single line text | URL-friendly version of the title (e.g., "my-first-post") | Yes |
| **Content** | Long text | The main blog content in **Markdown format** | Yes |
| **Excerpt** | Long text | A short summary/preview of the post | Recommended |
| **FeaturedImage** | Attachment OR URL | The main image for the post | Recommended |
| **Category** | Single select | Blog category (e.g., Fashion, Beauty, Style Tips) | Yes |
| **Tags** | Multiple select | Related tags (e.g., trends, summer, accessories) | Optional |
| **Author** | Single line text | Author name (default: "Admin") | Recommended |
| **PublishedDate** | Date | When the post was published | Yes |
| **Status** | Single select | Post status: `Published` or `Draft` | Yes |
| **MetaDescription** | Long text | SEO meta description | Recommended |
| **ReadTime** | Number | Estimated reading time in minutes | Optional |
| **Views** | Number | Number of times the post has been viewed | Optional |

### 3. Field Configuration Details

#### **Status** (Single select)
Create two options:
- `Published` - Posts that are visible on the blog
- `Draft` - Posts that are hidden from public view

#### **Category** (Single select)
Suggested categories (customize as needed):
- Fashion Trends
- Style Tips
- Beauty & Skincare
- How To Guides
- Product Reviews
- Seasonal Collections
- Behind The Scenes

#### **Tags** (Multiple select)
Suggested tags (customize as needed):
- Summer
- Winter
- Spring
- Fall
- Lingerie
- Bras
- Panties
- Accessories
- Sale
- New Arrivals
- Tips & Tricks
- Trends

## Writing Blog Posts with Rich Text (Markdown)

The `Content` field supports **Markdown** for rich text formatting. Here's what you can use:

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough text~~
```

### Lists

**Bullet points:**
```markdown
- First item
- Second item
- Third item
```

**Numbered lists:**
```markdown
1. First step
2. Second step
3. Third step
```

### Links
```markdown
[Link text](https://example.com)
```

### Images
```markdown
![Image alt text](https://example.com/image.jpg)
```

### Blockquotes
```markdown
> This is a quote or important callout
```

### Code
```markdown
Inline `code` with backticks

```
Code block
with multiple lines
```
```

### Horizontal Line
```markdown
---
```

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Example Blog Post

Here's an example of a complete blog post in Airtable:

**Title:** `Summer Fashion Trends 2024`

**Slug:** `summer-fashion-trends-2024`

**Content:**
```markdown
# Summer Fashion Trends 2024

Summer is here, and it's time to refresh your wardrobe! Here are the **top trends** you need to know about.

## 1. Bright Colors

This summer is all about bold, vibrant colors. Think:
- Coral pink
- Sunshine yellow
- Ocean blue

## 2. Lightweight Fabrics

Stay cool with breathable materials like:
1. Linen
2. Cotton
3. Silk blends

## 3. Sustainable Fashion

More brands are focusing on eco-friendly materials. Look for:
- Organic cotton
- Recycled fabrics
- Biodegradable materials

> "Fashion is about dressing according to what's fashionable. Style is more about being yourself." - Oscar de la Renta

[Shop our summer collection](/shop)

![Summer collection](https://example.com/summer.jpg)
```

**Excerpt:**
```
Discover the hottest fashion trends for Summer 2024, from bright colors to sustainable fabrics.
```

**Category:** `Fashion Trends`

**Tags:** `Summer`, `Trends`, `New Arrivals`

**Author:** `Sarah Johnson`

**PublishedDate:** `2024-06-01`

**Status:** `Published`

**MetaDescription:** `Discover the top summer fashion trends for 2024, including bright colors, lightweight fabrics, and sustainable fashion choices.`

**ReadTime:** `5`

## Features

The blog system includes:

### 1. **Rich Text Rendering**
- All Markdown content is beautifully rendered on the frontend
- Supports headings, lists, links, images, code blocks, tables, and more

### 2. **Category & Tag Filtering**
- Filter posts by category
- Filter posts by tags
- View all posts in a specific category at `/blog/category/[category-name]`

### 3. **Search Functionality**
- Full-text search across post titles, content, and excerpts
- Real-time search results

### 4. **SEO Optimized**
- Automatic meta tags generation
- Custom meta descriptions
- Open Graph tags for social sharing
- Structured data for rich snippets

### 5. **Related Posts**
- Automatically shows related posts from the same category
- Helps keep readers engaged

### 6. **View Tracking**
- Automatically tracks post views
- View count stored in Airtable

### 7. **Social Sharing**
- Built-in share button
- Native share on mobile devices
- Fallback to clipboard copy on desktop

### 8. **Responsive Design**
- Mobile-first design
- Beautiful on all screen sizes
- Touch-optimized for mobile

## Blog URLs

- **All posts:** `/blog`
- **Single post:** `/blog/[slug]`
- **Category:** `/blog/category/[category]`

## Tips for Creating Great Blog Posts

1. **Write compelling titles** - Make them clear and engaging
2. **Create unique slugs** - Use lowercase, hyphens, no special characters
3. **Use high-quality images** - Minimum 1200x600px for featured images
4. **Write clear excerpts** - 1-2 sentences that capture the post essence
5. **Choose appropriate categories** - Helps readers find related content
6. **Add relevant tags** - Improves discoverability
7. **Set accurate read time** - Estimate 200-250 words per minute
8. **Always use "Published" status** - Only published posts appear on the blog
9. **Format with Markdown** - Use headings, lists, and formatting for readability
10. **Add meta descriptions** - 150-160 characters for best SEO

## Troubleshooting

### Posts not showing up?
- Check that the **Status** is set to `Published`
- Verify the **PublishedDate** is not in the future
- Make sure all required fields are filled

### Images not loading?
- Ensure the image URL is publicly accessible
- Check that the image format is supported (JPG, PNG, WebP)
- If using Airtable attachments, they should work automatically

### Search not working?
- Clear browser cache
- Check that posts have content in Title, Content, or Excerpt fields

### Categories/tags not showing?
- Ensure at least one published post has that category/tag
- Category and tag names are case-sensitive

## Need Help?

If you encounter any issues or have questions about the blog system, please refer to the main project documentation or contact support.

---

**Happy Blogging! 🎉**
