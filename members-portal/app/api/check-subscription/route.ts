import { NextRequest, NextResponse } from 'next/server'
import { checkSubscription } from '@/lib/stripe'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check subscription status in Stripe
    const isPremium = await checkSubscription(email)

    return NextResponse.json({ isPremium })
  } catch (error) {
    console.error('Error in check-subscription API:', error)
    return NextResponse.json(
      { error: 'Internal server error', isPremium: false },
      { status: 500 }
    )
  }
}
