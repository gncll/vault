import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GeneratePromptRequest {
  userInput: string
  type: 'image' | 'infographic'
  style?: string
  infographicType?: string
}

export async function POST(request: NextRequest) {
  try {
    const { userInput, type, style, infographicType }: GeneratePromptRequest = await request.json()

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found')
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    let systemPrompt = ''

    if (type === 'image') {
      systemPrompt = `You are an expert AI image prompt engineer. Your task is to transform user requests into detailed, effective prompts for AI image generation.

RULES:
- Create vivid, detailed prompts that will produce high-quality images
- Include details about: composition, lighting, colors, mood, style, perspective
- If a style is specified, incorporate it naturally
- Keep prompts concise but descriptive (2-4 sentences)
- Focus on visual elements that AI can render well
- Avoid text-heavy requests or complex scenarios
${style ? `- Apply this style: ${style}` : ''}

Output ONLY the optimized prompt, nothing else.`
    } else if (type === 'infographic') {
      systemPrompt = `You are an expert AI prompt engineer specializing in infographic generation. Your task is to create detailed prompts for generating infographic-style images.

RULES:
- Create prompts that will produce clear, professional infographics
- Include details about: layout, color scheme, visual hierarchy, icons/symbols
- Specify the type of visualization needed (charts, timelines, comparisons, etc.)
- Keep the design clean and readable
- Focus on visual data representation
${infographicType ? `- Infographic type: ${infographicType}` : ''}
${style ? `- Visual style: ${style}` : ''}

Output ONLY the optimized prompt, nothing else.`
    }

    console.log(`[Generate Prompt] Creating ${type} prompt`)
    console.log(`[Generate Prompt] User input: ${userInput.substring(0, 100)}...`)

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: userInput
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Generate Prompt] Claude API error: ${response.status}`, errorText)
      return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 })
    }

    const result = await response.json()
    const generatedPrompt = result.content[0].text

    console.log(`[Generate Prompt] Generated: ${generatedPrompt.substring(0, 100)}...`)

    return NextResponse.json({ prompt: generatedPrompt })

  } catch (error) {
    console.error('[Generate Prompt] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
