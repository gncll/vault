// GitHub content fetching utilities
// No token needed for public repos, but add GITHUB_TOKEN to .env.local for private repos

import { scrapeArticleImage } from './scrapeImage'

interface GitHubContentResponse {
  content: string;
  encoding: string;
}

const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'yourusername'
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || 'vault-content'
const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN // Optional, for private repos

async function fetchGitHubFile(path: string): Promise<any> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`

  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 10 } // Revalidate every 10 seconds
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const data: GitHubContentResponse = await response.json()

  // Decode base64 content
  const content = Buffer.from(data.content, 'base64').toString('utf-8')
  return JSON.parse(content)
}

export async function getCustomGPTs() {
  try {
    return await fetchGitHubFile('customgpts.json')
  } catch (error) {
    console.error('Error fetching custom GPTs:', error)
    return []
  }
}

export async function getProjects() {
  try {
    return await fetchGitHubFile('projects.json')
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getPrompts() {
  try {
    return await fetchGitHubFile('prompts.json')
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return []
  }
}

export async function getProjectDetails(id: string) {
  try {
    const projects = await getProjects()
    return projects.find((p: any) => p.id.toString() === id)
  } catch (error) {
    console.error('Error fetching project details:', error)
    return null
  }
}

export async function getPromptDetails(id: string) {
  try {
    const prompts = await getPrompts()
    return prompts.find((p: any) => p.id.toString() === id)
  } catch (error) {
    console.error('Error fetching prompt details:', error)
    return null
  }
}

export async function getNews() {
  try {
    const RSS_FEED_URL = 'https://www.google.com/alerts/feeds/07865441541560530355/2686190139518355406'

    const response = await fetch(RSS_FEED_URL, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const xmlText = await response.text()

    // Split by entry tags - take only first 20 entries
    const entries = xmlText.split('<entry>').slice(1, 21) // Only process first 20

    // First pass: parse all entries and collect URLs that need scraping
    const itemsToProcess: Array<{
      title: string
      url: string
      date: string
      imageFromRSS: string
    }> = []

    for (const entryText of entries) {
      const entry = entryText.split('</entry>')[0]

      // Extract title
      const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/)
      let title = titleMatch ? titleMatch[1].trim() : ''

      // Remove CDATA wrapper if present
      title = title.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')

      // Decode HTML entities FIRST (so &lt;b&gt; becomes <b>)
      title = title
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ')

      // THEN strip HTML tags (now they're real < and > characters)
      title = title.replace(/<[^>]+>/g, '').trim()

      // Extract link
      const linkMatch = entry.match(/<link[^>]*href="([^"]*)"/)
      let url = linkMatch ? linkMatch[1] : ''
      url = url.replace(/&amp;/g, '&')

      if (url.includes('google.com/url?')) {
        const urlParams = new URL(url).searchParams
        const actualUrl = urlParams.get('url')
        if (actualUrl) {
          url = actualUrl
        }
      }

      // Extract published date
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
      const published = publishedMatch ? publishedMatch[1] : new Date().toISOString()

      // Extract content/description for image
      const contentMatch = entry.match(/<content[^>]*>([\s\S]*?)<\/content>/)
      let imageFromRSS = 'https://placehold.co/600x400/f3f4f6/9ca3af/png?text=AI+News'

      if (contentMatch) {
        const content = contentMatch[1]
        const imgMatch = content.match(/<img[^>]*src="([^"]*)"/)
        if (imgMatch) {
          imageFromRSS = imgMatch[1]
        }
      }

      if (url) {
        itemsToProcess.push({
          title,
          url,
          date: published,
          imageFromRSS
        })
      }
    }

    console.log(`[RSS] Parsed ${itemsToProcess.length} items, starting image scraping...`)

    // Scrape images for first 10 items only (to avoid timeout)
    const scrapePromises = itemsToProcess.slice(0, 10).map(async (item) => {
      let finalImage = item.imageFromRSS

      // Only scrape if placeholder
      if (finalImage.includes('placeholder')) {
        try {
          const scrapedImage = await scrapeArticleImage(item.url)
          if (scrapedImage && !scrapedImage.includes('placeholder')) {
            finalImage = scrapedImage
          }
        } catch (error) {
          console.error(`[RSS] Failed to scrape ${item.url}`)
        }
      }

      return {
        id: item.url,
        title: item.title,
        url: item.url,
        image: finalImage,
        date: item.date
      }
    })

    // For remaining items, use RSS images
    const remainingItems = itemsToProcess.slice(10).map((item) => ({
      id: item.url,
      title: item.title,
      url: item.url,
      image: item.imageFromRSS,
      date: item.date
    }))

    const scrapedItems = await Promise.all(scrapePromises)
    const newsItems = [...scrapedItems, ...remainingItems]

    console.log(`[RSS] Completed, returning ${newsItems.length} items`)

    // Sort by date, most recent first
    return newsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error fetching news from RSS:', error)
    return []
  }
}
