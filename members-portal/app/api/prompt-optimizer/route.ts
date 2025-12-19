import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface OptimizeRequest {
  prompt: string
  technique?: 'zero-shot' | 'few-shot' | 'chain-of-thought' | 'role-prompting'
  language?: string
  tone?: string
  targetAudience?: string
  persona?: string
  positiveExamples?: string
  negativeExamples?: string
}

const TECHNIQUE_PROMPTS = {
  'zero-shot': `You are optimizing a task by making it more direct, specific, and clear.

Take the user's task and improve it by:
1. Making vague requests specific and concrete
2. Adding missing context that would help get better results
3. Clarifying what output format is wanted
4. Making instructions more direct and actionable
5. Removing unnecessary or confusing words
6. Adding constraints or requirements if helpful

Example:
User task: "Write about marketing"
Optimized: "Write a 500-word analysis of digital marketing trends in 2024. Focus on social media platforms, include specific statistics, and provide 3 actionable recommendations for small businesses. Use a professional but accessible tone."

CRITICAL: Return ONLY the improved version of their specific task. Keep their original intent but make it much clearer and more specific.`,

  'few-shot': `You are optimizing a prompt using the few-shot technique, which means adding relevant examples to guide the AI's response.

Take the user's task and improve it by:
1. Adding 2-3 high-quality examples that demonstrate the desired output format
2. Making the examples diverse but consistent in quality and style
3. Including both the input and expected output in each example
4. Ensuring examples are relevant to the user's specific domain
5. Adding clear instructions that reference the examples

CRITICAL: Return ONLY the improved version with examples embedded. Format it clearly with labeled examples.`,

  'chain-of-thought': `You are optimizing a prompt using chain-of-thought technique, which means breaking down complex reasoning into clear steps.

Take the user's task and improve it by:
1. Adding explicit instructions to "think step by step"
2. Breaking the task into logical sub-tasks
3. Asking for intermediate reasoning before the final answer
4. Including phrases like "Let's approach this systematically" or "First, consider... Then..."
5. Requesting the AI to show its work/reasoning

CRITICAL: Return ONLY the improved version that encourages step-by-step thinking.`,

  'role-prompting': `You are optimizing a prompt using role-prompting technique, which means assigning a specific expert persona to the AI.

Take the user's task and improve it by:
1. Assigning a relevant expert role (e.g., "You are a senior marketing strategist with 15 years of experience...")
2. Adding context about the expert's background and expertise
3. Including relevant personality traits and communication style
4. Making the role specific to the domain of the task
5. Adding credentials or experience that build authority

CRITICAL: Return ONLY the improved version with the expert role clearly defined at the beginning.`
}

export async function POST(request: NextRequest) {
  try {
    const body: OptimizeRequest = await request.json()
    const {
      prompt,
      technique = 'zero-shot',
      language,
      tone,
      targetAudience,
      persona,
      positiveExamples,
      negativeExamples
    } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found')
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    // Build system prompt based on technique
    let systemPrompt = TECHNIQUE_PROMPTS[technique] || TECHNIQUE_PROMPTS['zero-shot']

    // Add optional modifiers
    if (positiveExamples?.trim()) {
      systemPrompt += `\n\nPOSITIVE OUTPUT GUIDANCE:\nThe optimized task should encourage outputs that are:\n${positiveExamples}`
    }

    if (negativeExamples?.trim()) {
      systemPrompt += `\n\nNEGATIVE OUTPUT GUIDANCE:\nThe optimized task should discourage outputs that are:\n${negativeExamples}`
    }

    if (language && language !== 'English') {
      systemPrompt += `\n\nLANGUAGE REQUIREMENT:\nAdd instruction to respond in ${language}.`
    }

    if (tone && tone !== 'Normal') {
      const toneDescriptions: Record<string, string> = {
        'Concise': 'brief and to the point',
        'Explanatory': 'detailed and informative',
        'Conversational': 'natural and casual',
        'Friendly': 'warm and approachable',
        'Confident': 'assertive and authoritative',
        'Minimalist': 'simple and clean',
        'Witty': 'clever and humorous'
      }
      const toneDesc = toneDescriptions[tone] || tone.toLowerCase()
      systemPrompt += `\n\nTONE REQUIREMENT:\nAdd instruction for a ${tone.toLowerCase()} tone (${toneDesc}).`
    }

    if (targetAudience?.trim()) {
      systemPrompt += `\n\nTARGET AUDIENCE:\nOptimize for: ${targetAudience}\nAdd audience-appropriate language and context.`
    }

    if (persona?.trim()) {
      systemPrompt += `\n\nPERSONA REQUIREMENT:\nThe optimized task should incorporate the perspective and expertise of: ${persona}\nIntegrate this persona naturally into the task structure.`
    }

    console.log(`[Prompt Optimizer] Optimizing with technique: ${technique}`)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('[Prompt Optimizer] OpenAI error:', response.status, errorData)

      if (response.status === 429) {
        return NextResponse.json({
          error: 'Rate limit exceeded. Please wait a moment and try again.'
        }, { status: 429 })
      }

      return NextResponse.json({
        error: 'Failed to optimize prompt. Please try again.'
      }, { status: 500 })
    }

    const data = await response.json()
    const optimizedPrompt = data.choices?.[0]?.message?.content?.trim()

    if (!optimizedPrompt) {
      return NextResponse.json({
        error: 'No response from AI. Please try again.'
      }, { status: 500 })
    }

    console.log('[Prompt Optimizer] Success')
    return NextResponse.json({ optimizedPrompt })

  } catch (error) {
    console.error('[Prompt Optimizer] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
