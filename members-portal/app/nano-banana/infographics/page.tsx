import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/app/components/Header'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import InfographicsClient from './InfographicsClient'

export default function InfographicsPage() {
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <Header showNav>
          <UserButton afterSignOutUrl="/" />
        </Header>

        <main className="max-w-6xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/nano-banana" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Nano Banana
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">📊</span>
              <h1 className="font-serif text-4xl text-gray-900">Infographics Studio</h1>
            </div>
            <p className="text-sm text-gray-600">
              Create professional infographics with AI assistance. Choose your type, style, and let AI do the rest.
            </p>
          </div>

          <InfographicsClient />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
