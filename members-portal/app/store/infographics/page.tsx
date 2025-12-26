import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import InfographicsClient from './InfographicsClient'

export default function InfographicsPage() {
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Compact Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/store" className="text-gray-400 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <h1 className="font-serif text-xl text-gray-900">Infographics Studio</h1>
              </div>
            </div>
            <p className="text-xs text-gray-500 hidden md:block">
              Create professional infographics with AI
            </p>
          </div>
        </header>

        {/* Main Content - Full Height */}
        <main className="flex-1 overflow-hidden">
          <InfographicsClient />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
