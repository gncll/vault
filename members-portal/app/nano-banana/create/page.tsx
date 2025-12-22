import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import NanoBananaClient from '../NanoBananaClient'

export default function NanoBananaCreatePage() {
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/nano-banana" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Nano Banana
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">🎨</span>
              <h1 className="font-serif text-4xl text-gray-900">Custom Creation</h1>
            </div>
            <p className="text-sm text-gray-600">
              Create images from scratch with your own prompts
            </p>
          </div>

          <NanoBananaClient />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
