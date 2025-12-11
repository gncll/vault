import { NextResponse } from 'next/server'
import { getNews } from '@/lib/github'

export const dynamic = 'force-dynamic' // Force dynamic rendering
export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    console.log('[API Route] /api/news called')
    const news = await getNews()
    console.log(`[API Route] Returning ${news.length} news items`)
    return NextResponse.json(news)
  } catch (error) {
    console.error('[API Route] Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
