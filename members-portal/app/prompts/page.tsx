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
          </div>

          <PromptsClient prompts={prompts} />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
