import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

if (!ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set')
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY || 'dummy-key',
})

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to environment variables.' },
        { status: 500 }
      )
    }

    // Check if user is authenticated
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    // Extract text content from response
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')

    return NextResponse.json({
      response: responseText,
      model: message.model,
      usage: message.usage
    })

  } catch (error: any) {
    console.error('Error testing prompt with Claude:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to test prompt with Claude' },
      { status: 500 }
    )
  }
}
