import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, projectTitle, pdfContent } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found')
      return NextResponse.json({ error: 'API not configured' }, { status: 500 })
    }

    // System prompt for project chat
    const systemPrompt = `You are a concise AI tutor for the project: "${projectTitle}".

IMPORTANT RULES:
- Keep responses SHORT (3-5 sentences max for simple questions)
- Use bullet points instead of long paragraphs
- Only show code if specifically asked
- Be direct, skip unnecessary introductions
- If explaining concepts, use 1-2 key points only

Project content:
${pdfContent || 'No PDF content provided'}

Answer based on this content. Be helpful but brief.`

    // Build messages array
    const messages: Message[] = []

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          })
        }
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    console.log(`[Project Chat] Calling Claude API for: ${projectTitle}`)
    console.log(`[Project Chat] Message: ${message.substring(0, 100)}...`)

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
        max_tokens: 500,
        system: systemPrompt,
        messages: messages
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Project Chat] Claude API error: ${response.status}`, errorText)
      return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 })
    }

    const result = await response.json()
    const aiResponse = result.content[0].text

    console.log(`[Project Chat] Success: ${aiResponse.substring(0, 100)}...`)

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('[Project Chat] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
