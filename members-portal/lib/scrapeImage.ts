// Image scraping utility to extract article images from URLs
// Similar to Django's get_article_image_sync function

export async function scrapeArticleImage(url: string): Promise<string> {
  const defaultImage = 'https://placehold.co/600x400/f3f4f6/9ca3af/png?text=AI+News'

  try {
    console.log(`[Image Scrape] Attempting to scrape: ${url}`)

    // Fetch the HTML page with timeout (reduced for Vercel)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal,
      cache: 'force-cache', // Use cache if available
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.log(`[Image Scrape] Failed to fetch ${url}: ${response.status}`)
      return defaultImage
    }

    const html = await response.text()
    console.log(`[Image Scrape] Fetched HTML (${html.length} chars) from ${url}`)

    // Extract image from meta tags using regex (similar to BeautifulSoup)
    // Try multiple patterns for each meta tag type

    const metaPatterns = [
      // og:image variations
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
      /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
      // twitter:image variations
      /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
      /<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["']/i,
      // og:image:secure_url
      /<meta\s+property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
      // generic image
      /<meta\s+name=["']image["']\s+content=["']([^"']+)["']/i,
    ]

    for (const regex of metaPatterns) {
      const match = html.match(regex)
      if (match && match[1]) {
        const imageUrl = match[1].trim()
        // Skip data URLs and very short URLs
        if (imageUrl.length > 10 && !imageUrl.startsWith('data:')) {
          console.log(`[Image Scrape] ✅ Found image: ${imageUrl.substring(0, 100)}...`)
          return imageUrl
        }
      }
    }

    // Try link tag with rel="image_src"
    const linkMatch = html.match(/<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i)
    if (linkMatch && linkMatch[1]) {
      const imageUrl = linkMatch[1].trim()
      console.log(`[Image Scrape] ✅ Found image via link tag: ${imageUrl}`)
      return imageUrl
    }

    console.log(`[Image Scrape] ❌ No image found for ${url}`)
    return defaultImage

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`[Image Scrape] ⏱️ Timeout: ${url}`)
    } else {
      console.error(`[Image Scrape] ❌ Error scraping ${url}:`, error.message)
    }
    return defaultImage
  }
}
