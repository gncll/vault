// Image scraping utility to extract article images from URLs
// Similar to Django's get_article_image_sync function

export async function scrapeArticleImage(url: string): Promise<string> {
  const defaultImage = 'https://placehold.co/600x400/f3f4f6/9ca3af/png?text=AI+News'

  try {
    // Fetch the HTML page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      },
      next: { revalidate: 604800 } // Cache for 7 days (7 * 24 * 60 * 60)
    })

    if (!response.ok) {
      console.log(`[Image Scrape] Failed to fetch ${url}: ${response.status}`)
      return defaultImage
    }

    const html = await response.text()

    // Extract image from meta tags using regex (similar to BeautifulSoup)
    // Priority order: og:image, twitter:image, og:image:secure_url, name="image"

    const metaTags = [
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
      /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
      /<meta\s+property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
      /<meta\s+name=["']image["']\s+content=["']([^"']+)["']/i,
    ]

    for (const regex of metaTags) {
      const match = html.match(regex)
      if (match && match[1]) {
        const imageUrl = match[1]
        console.log(`[Image Scrape] Found image via meta tag: ${imageUrl}`)
        return imageUrl
      }
    }

    // Try link tag with rel="image_src"
    const linkMatch = html.match(/<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i)
    if (linkMatch && linkMatch[1]) {
      const imageUrl = linkMatch[1]
      console.log(`[Image Scrape] Found image via link tag: ${imageUrl}`)
      return imageUrl
    }

    console.log(`[Image Scrape] No image found for ${url}, using placeholder`)
    return defaultImage

  } catch (error) {
    console.error(`[Image Scrape Error] ${url}:`, error)
    return defaultImage
  }
}
