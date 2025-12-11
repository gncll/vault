// GitHub content fetching utilities
// No token needed for public repos, but add GITHUB_TOKEN to .env.local for private repos

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

    // Parse XML using basic string parsing (no external dependencies)
    const items: any[] = []

    // Split by entry tags
    const entries = xmlText.split('<entry>').slice(1) // Skip first element (before first entry)

    for (const entryText of entries) {
      const entry = entryText.split('</entry>')[0]

      // Extract title
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/)
      let title = titleMatch ? titleMatch[1].trim() : ''

      // Remove CDATA tags if present
      title = title.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()

      // Extract link
      const linkMatch = entry.match(/<link[^>]*href="([^"]*)"/)
      const url = linkMatch ? linkMatch[1] : ''

      // Extract published date
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
      const published = publishedMatch ? publishedMatch[1] : new Date().toISOString()

      // Extract content/description for image
      const contentMatch = entry.match(/<content[^>]*>([\s\S]*?)<\/content>/)
      let image = 'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=AI+News' // Default placeholder

      if (contentMatch) {
        const content = contentMatch[1]
        const imgMatch = content.match(/<img[^>]*src="([^"]*)"/)
        if (imgMatch) {
          image = imgMatch[1]
        }
      }

      if (url) {
        items.push({
          id: url, // Use URL as unique ID
          title,
          url,
          image,
          date: published
        })
      }
    }

    // Sort by date, most recent first
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error fetching news from RSS:', error)
    return []
  }
}
