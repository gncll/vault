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

export async function getNews() {
  try {
    const data = await fetchGitHubFile('news.json')
    // Sort by date, most recent first
    return data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}
