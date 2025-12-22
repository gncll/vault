import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import AIHumanizerClient from './AIWriterClient'

export default function AIHumanizerPage() {
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/tools" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to AI Tools
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">🧑</span>
              <h1 className="font-serif text-4xl text-gray-900">AI Humanizer</h1>
            </div>
            <p className="text-sm text-gray-600">
              Transform AI-generated text into natural, human-sounding content
            </p>
          </div>

          <AIHumanizerClient />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
