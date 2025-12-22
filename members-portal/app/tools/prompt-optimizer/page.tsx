import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import PromptOptimizerClient from './PromptOptimizerClient'

export default function PromptOptimizerPage() {
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-5xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/tools" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to AI Tools
            </Link>
            <h1 className="font-serif text-4xl text-gray-900 mb-3">Prompt Optimizer</h1>
            <p className="text-sm text-gray-600">
              Transform your prompts with AI-powered optimization techniques
            </p>
          </div>

          <PromptOptimizerClient />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
