import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO
const GITHUB_BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filePath = searchParams.get('path')

  if (!filePath) {
    return NextResponse.json({ error: 'File path is required' }, { status: 400 })
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    }

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const data = await response.json()

    // Decode base64 content
    const content = Buffer.from(data.content, 'base64')

    // Determine content type based on file extension
    let contentType = 'application/octet-stream'
    if (filePath.endsWith('.pdf')) {
      contentType = 'application/pdf'
    } else if (filePath.endsWith('.csv')) {
      contentType = 'text/csv'
    } else if (filePath.endsWith('.ipynb')) {
      contentType = 'application/json'
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error fetching file from GitHub:', error)
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}
