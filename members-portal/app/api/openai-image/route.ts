import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

const DAILY_LIMIT = 10

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

interface ImageUsage {
  count: number
  date: string
}

async function checkAndUpdateUsage(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const today = getTodayDate()
  const client = await clerkClient()

  try {
    // Get user's current metadata
    const user = await client.users.getUser(userId)
    const metadata = user.publicMetadata as { imageUsage?: ImageUsage } || {}
    const usage = metadata.imageUsage

    // Reset if it's a new day or no usage data
    if (!usage || usage.date !== today) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...metadata,
          imageUsage: { count: 1, date: today }
        }
      })
      return { allowed: true, remaining: DAILY_LIMIT - 1 }
    }

    // Check if under limit
    if (usage.count >= DAILY_LIMIT) {
      return { allowed: false, remaining: 0 }
    }

    // Increment usage
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...metadata,
        imageUsage: { count: usage.count + 1, date: today }
      }
    })
    return { allowed: true, remaining: DAILY_LIMIT - usage.count - 1 }

  } catch (error) {
    console.error('[OpenAI Image] Error checking usage:', error)
    // Allow on error to not block users
    return { allowed: true, remaining: DAILY_LIMIT }
  }
}

async function getUserUsage(userId: string): Promise<{ used: number; remaining: number }> {
  const today = getTodayDate()
  const client = await clerkClient()

  try {
    const user = await client.users.getUser(userId)
    const metadata = user.publicMetadata as { imageUsage?: ImageUsage } || {}
    const usage = metadata.imageUsage

    if (!usage || usage.date !== today) {
      return { used: 0, remaining: DAILY_LIMIT }
    }

    return { used: usage.count, remaining: DAILY_LIMIT - usage.count }
  } catch (error) {
    console.error('[OpenAI Image] Error getting usage:', error)
    return { used: 0, remaining: DAILY_LIMIT }
  }
}

async function rollbackUsage(userId: string): Promise<void> {
  const today = getTodayDate()
  const client = await clerkClient()

  try {
    const user = await client.users.getUser(userId)
    const metadata = user.publicMetadata as { imageUsage?: ImageUsage } || {}
    const usage = metadata.imageUsage

    if (usage && usage.date === today && usage.count > 0) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...metadata,
          imageUsage: { count: usage.count - 1, date: today }
        }
      })
    }
  } catch (error) {
    console.error('[OpenAI Image] Error rolling back usage:', error)
  }
}

interface GenerateRequest {
  prompt: string
  size?: '1024x1024' | '1536x1024' | '1024x1536'
  quality?: 'low' | 'medium' | 'high'
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check rate limit
    const { allowed, remaining } = await checkAndUpdateUsage(userId)
    if (!allowed) {
      return NextResponse.json({
        error: 'Daily limit reached. You can generate up to 10 images per day.',
        limit: DAILY_LIMIT,
        remaining: 0
      }, { status: 429 })
    }

    const { prompt, size = '1024x1024', quality = 'medium' }: GenerateRequest = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found')
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    console.log(`[OpenAI Image] Generating image for user ${userId}...`)
    console.log(`[OpenAI Image] Prompt: ${prompt.substring(0, 100)}...`)
    console.log(`[OpenAI Image] Size: ${size}, Quality: ${quality}`)
    console.log(`[OpenAI Image] Remaining today: ${remaining}`)

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
        output_format: 'png'
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`[OpenAI Image] Error: ${response.status}`, errorData)

      // Rollback usage count on error
      await rollbackUsage(userId)

      if (response.status === 429) {
        return NextResponse.json({
          error: 'OpenAI rate limit exceeded. Please try again later.'
        }, { status: 429 })
      }

      if (response.status === 400) {
        return NextResponse.json({
          error: errorData.error?.message || 'Invalid request to OpenAI'
        }, { status: 400 })
      }

      return NextResponse.json({
        error: 'Failed to generate image'
      }, { status: 500 })
    }

    const result = await response.json()
    console.log(`[OpenAI Image] Success! Remaining: ${remaining}`)

    // gpt-image-1 returns base64 data
    if (result.data && result.data[0]) {
      const imageData = result.data[0]

      return NextResponse.json({
        image: {
          data: imageData.b64_json,
          mimeType: 'image/png'
        },
        remaining: remaining,
        model: 'gpt-image-1'
      })
    }

    return NextResponse.json({ error: 'No image generated' }, { status: 500 })

  } catch (error) {
    console.error('[OpenAI Image] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to check remaining usage
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { used, remaining } = await getUserUsage(userId)

    return NextResponse.json({
      used,
      remaining,
      limit: DAILY_LIMIT
    })
  } catch (error) {
    console.error('[OpenAI Image] Error checking usage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
