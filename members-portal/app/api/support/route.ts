import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_SUPPORT_DATABASE_ID!

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        Message: {
          rich_text: [
            {
              text: {
                content: message,
              },
            },
          ],
        },
        Status: {
          status: {
            name: 'Not Started',
          },
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Notion API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit support request' },
      { status: 500 }
    )
  }
}
