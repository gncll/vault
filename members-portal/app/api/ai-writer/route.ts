import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const CONTENT_TYPE_PROMPTS: Record<string, string> = {
  blog: 'Write a comprehensive blog post',
  social: 'Write an engaging social media post',
  email: 'Write a professional email',
  product: 'Write a compelling product description',
  linkedin: 'Write a professional LinkedIn post that encourages engagement',
  thread: 'Write a Twitter thread (use numbered tweets like 1/, 2/, etc.)',
  ad: 'Write persuasive advertising copy',
  script: 'Write a video script with clear sections',
}

const LENGTH_GUIDELINES: Record<string, string> = {
  short: 'Keep it concise, around 100 words.',
  medium: 'Write a moderate length, around 300 words.',
  long: 'Write a detailed piece, around 600 words.',
  very_long: 'Write a comprehensive piece, 1000+ words with multiple sections.',
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contentType, topic, tone, length, language, keywords, additionalContext } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const contentTypePrompt = CONTENT_TYPE_PROMPTS[contentType] || 'Write content'
    const lengthGuideline = LENGTH_GUIDELINES[length] || LENGTH_GUIDELINES.medium

    const prompt = `${contentTypePrompt} about the following topic:

Topic: ${topic}

Requirements:
- Tone: ${tone}
- Language: ${language}
- ${lengthGuideline}
${keywords ? `- Include these keywords naturally: ${keywords}` : ''}
${additionalContext ? `- Additional context: ${additionalContext}` : ''}

Write high-quality, engaging content that is ready to use. Do not include any meta-commentary or explanations - just provide the content itself.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: prompt }
      ],
    })

    const content = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error('AI Writer error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}
