import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/app/components/Header'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getPrompts } from '@/lib/github'
import PromptsClient from './PromptsClient'

export default async function PromptsPage() {
  const prompts = await getPrompts()

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <Header showNav>
          <UserButton afterSignOutUrl="/" />
        </Header>

        <main className="max-w-6xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="font-serif text-4xl text-gray-900 mb-3">Prompt Library</h1>
            <p className="text-sm text-gray-600">
              Curated collection of high-quality prompts
            </p>

            {/* Prompt Optimizer Banner */}
            <Link
              href="/prompts/prompt-optimizer"
              className="mt-6 block border border-gray-200 rounded-lg p-5 hover:bg-gray-50 hover:border-gray-300 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">Prompt Optimizer</h3>
                    <p className="text-sm text-gray-500">Transform your prompts with AI-powered optimization techniques</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          <PromptsClient prompts={prompts} />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
