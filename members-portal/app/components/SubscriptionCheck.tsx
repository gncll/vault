'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function SubscriptionCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [isPremium, setIsPremium] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkSubscription() {
      if (!isLoaded || !user) {
        setIsChecking(false)
        return
      }

      try {
        const response = await fetch('/api/check-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress
          }),
        })

        const data = await response.json()
        setIsPremium(data.isPremium)
      } catch (error) {
        console.error('Error checking subscription:', error)
        setIsPremium(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkSubscription()
  }, [user, isLoaded])

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription status...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this content.</p>
          <Link href="/" className="text-indigo-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  if (isPremium === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-2xl px-6">
          <h1 className="font-serif text-5xl text-gray-900 mb-4">Subscribe to See</h1>
          <p className="text-xl text-gray-600 mb-12">
            Get access to exclusive AI news, insights, and resources
          </p>

          <div className="flex justify-center mb-8">
            <iframe
              src="https://www.learnwithmeai.com/embed"
              width="480"
              height="320"
              style={{ border: '1px solid #EEE', background: 'white' }}
              scrolling="no"
              title="Subscribe to LearnAIWithMe"
            />
          </div>

          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
