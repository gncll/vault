# AI News - Content Management Guide

## Overview
The AI News section displays a 4-column grid of news articles, managed via a `news.json` file in your GitHub repository.

## news.json Structure

Create a `news.json` file in your GitHub content repository with the following structure:

```json
[
  {
    "id": "unique-slug-identifier",
    "title": "Main headline goes here",
    "subtitle": "PLUS: Secondary description or additional context",
    "image": "/news/image-filename.jpg",
    "date": "2025-12-06",
    "url": "https://external-link.com/article"
  }
]
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier in slug format (e.g., "nano-banana-pro-update") |
| `title` | string | Yes | Main headline (will be truncated to 3 lines) |
| `subtitle` | string | Yes | Secondary description (will be truncated to 2 lines) |
| `image` | string | Yes | Path to image in `/public/news/` folder |
| `date` | string | Yes | ISO date format (YYYY-MM-DD) for sorting |
| `url` | string | Yes | External link (opens in new tab) |

## Example news.json

```json
[
  {
    "id": "anthropic-claude-sonnet-5",
    "title": "Anthropic puts Claude in the interviewer's chair",
    "subtitle": "PLUS: How to One-Shot a Landing Page with Replit Design Mode",
    "image": "/news/claude-interviewer.jpg",
    "date": "2025-12-06",
    "url": "https://example.com/article-1"
  },
  {
    "id": "openai-ipo-showdown",
    "title": "Anthropic and OpenAI's IPO showdown",
    "subtitle": "PLUS: Get instant business insights from spreadsheets",
    "image": "/news/ipo-race.jpg",
    "date": "2025-12-05",
    "url": "https://example.com/article-2"
  },
  {
    "id": "deepseek-returns",
    "title": "DeepSeek returns with an IMO-crushing AI",
    "subtitle": "PLUS: Create Instagram product shots with Nano Banana Pro",
    "image": "/news/deepseek-ai.jpg",
    "date": "2025-12-04",
    "url": "https://example.com/article-3"
  },
  {
    "id": "code-red-scramble",
    "title": "OpenAI's 'Code Red' scramble",
    "subtitle": "PLUS: Prepare for job interviews with NotebookLM",
    "image": "/news/code-red.jpg",
    "date": "2025-12-03",
    "url": "https://example.com/article-4"
  }
]
```

## Image Guidelines

### Image Specifications
- **Location:** `/Users/learnai/Desktop/vault/members-portal/public/news/`
- **Format:** WebP or JPEG (WebP preferred for smaller file size)
- **Dimensions:** 1200x675 pixels (16:9 aspect ratio)
- **File Size:** Under 200KB (optimized for fast loading)
- **Naming:** Use kebab-case (e.g., `nano-banana-pro.jpg`)

### Image Optimization Tips
1. Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. Convert to WebP format for best compression
3. Ensure images are visually clear even at smaller sizes (mobile)

## Content Workflow

### Adding a New News Item

1. **Prepare the image:**
   - Resize to 1200x675px (16:9 ratio)
   - Optimize file size (< 200KB)
   - Save to `/public/news/` folder

2. **Update news.json:**
   - Add new entry to the beginning of the array (for most recent)
   - Use unique `id` in slug format
   - Use current date in ISO format

3. **Deploy:**
   - Commit and push to GitHub
   - Vercel auto-deploys
   - Cache revalidates in 5 minutes

### Example Git Commands

```bash
# Add new image
git add members-portal/public/news/my-new-article.jpg

# Commit (news.json should be in your GitHub content repo)
git commit -m "Add AI news: My New Article"

# Push to deploy
git push origin main
```

## Sorting and Display

- **Sorting:** News items are automatically sorted by date (most recent first)
- **Layout:**
  - Desktop (>1024px): 4 columns
  - Tablet (768-1024px): 2 columns
  - Mobile (<768px): 1 column
- **Cache:** 5-minute revalidation interval

## Title Best Practices

### Title Guidelines
- Keep under 80 characters for best display
- Front-load important keywords
- Use active voice
- Avoid clickbait

### Subtitle Guidelines
- Use "PLUS:" format for secondary items (optional)
- Keep under 100 characters
- Provide context or value proposition
- Can include multiple items separated by commas

### Good Examples

✅ **Good:**
- Title: "Anthropic puts Claude in the interviewer's chair"
- Subtitle: "PLUS: How to One-Shot a Landing Page with Replit Design Mode"

✅ **Good:**
- Title: "DeepSeek strikes again"
- Subtitle: "PLUS: Runway, Kling push AI video to new heights"

❌ **Avoid:**
- Title: "You won't believe what happened with AI today!!!" (clickbait)
- Subtitle: "This is a very long subtitle that goes on and on and will be truncated anyway so it's not useful to make it this long" (too long)

## Technical Notes

### Caching
The news page uses Next.js ISR (Incremental Static Regeneration) with a 5-minute revalidation window:
```typescript
export const revalidate = 300 // 5 minutes
```

### Error Handling
If `news.json` is not found or contains errors:
- An empty array is returned
- Empty state is displayed: "No News Yet"
- Error is logged to console

### Future Enhancements
- Individual news article pages (`/news/[id]`)
- Date filtering
- Category tags
- Search functionality
- RSS feed generation
- CMS integration (Sanity, Contentful)

## Troubleshooting

### News not appearing
1. Check GitHub API rate limits
2. Verify `news.json` is in correct repo location
3. Check browser console for errors
4. Wait 5 minutes for cache to revalidate

### Images not loading
1. Verify image path matches `/news/filename.ext`
2. Check file exists in `/public/news/` folder
3. Ensure Next.js dev server restarted after adding images
4. Check image file permissions

### Layout issues
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. Check responsive breakpoints in browser DevTools

## Support

For questions or issues, refer to:
- [Next.js Image Documentation](https://nextjs.org/docs/app/api-reference/components/image)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- Project SETUP_GUIDE.md
