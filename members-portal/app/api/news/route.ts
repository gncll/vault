import { NextResponse } from 'next/server'
import { getNews } from '@/lib/github'

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    const news = await getNews()
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
