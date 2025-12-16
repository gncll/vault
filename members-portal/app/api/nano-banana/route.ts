import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GenerateRequest {
  prompt: string
  aspectRatio?: string
  model?: 'flash' | 'pro'
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio = '1:1', model = 'pro' }: GenerateRequest = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.NANO_API_KEY
    if (!apiKey) {
      console.error('NANO_API_KEY not found')
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    console.log(`[Nano Banana] Generating image...`)
    console.log(`[Nano Banana] Prompt: ${prompt.substring(0, 100)}...`)
    console.log(`[Nano Banana] Aspect Ratio: ${aspectRatio}`)
    console.log(`[Nano Banana] Model: ${model}`)

    // Use Gemini 3 Pro Image - best quality model for image generation
    const modelsToTry = ['gemini-3-pro-image-preview']

    for (const modelId of modelsToTry) {
      console.log(`[Nano Banana] Trying model: ${modelId}`)

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              responseModalities: ['IMAGE', 'TEXT']
            }
          })
        }
      )

      if (response.ok) {
        const result = await response.json()
        console.log(`[Nano Banana] Success with model: ${modelId}`)

        const candidates = result.candidates
        if (candidates && candidates.length > 0) {
          const parts = candidates[0].content?.parts || []

          for (const part of parts) {
            if (part.inlineData) {
              console.log(`[Nano Banana] Image generated successfully`)
              return NextResponse.json({
                image: {
                  mimeType: part.inlineData.mimeType,
                  data: part.inlineData.data
                },
                model: modelId
              })
            }
          }
        }
      } else {
        const errorData = await response.text()
        console.error(`[Nano Banana] ${modelId} error: ${response.status}`)

        // If rate limited, return immediately with retry info
        if (response.status === 429) {
          try {
            const parsed = JSON.parse(errorData)
            const retryMatch = parsed.error?.message?.match(/retry in (\d+\.?\d*)s/)
            if (retryMatch) {
              return NextResponse.json({
                error: `Rate limit exceeded. Please wait ${Math.ceil(parseFloat(retryMatch[1]))} seconds and try again.`,
                retryAfter: Math.ceil(parseFloat(retryMatch[1]))
              }, { status: 429 })
            }
          } catch {}
        }
      }
    }

    // All models failed
    return NextResponse.json({
      error: 'Failed to generate image. Please try again.',
    }, { status: 500 })

  } catch (error) {
    console.error('[Nano Banana] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
