import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/app/components/Header'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getCustomGPTs } from '@/lib/github'

export default async function CustomGPTsPage() {
  const customGPTs = await getCustomGPTs()
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
            <h1 className="font-serif text-4xl text-gray-900 mb-3">Custom GPTs</h1>
            <p className="text-sm text-gray-600">
              Specialized AI assistants designed for specific engineering tasks
            </p>
          </div>

          {/* GPTs List */}
          <div className="py-12 space-y-1">
            {customGPTs.map((gpt: any) => (
              <a
                key={gpt.id}
                href={gpt.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 p-8 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-2xl text-gray-900">{gpt.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 font-mono">
                        {gpt.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {gpt.description}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition ml-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Info Box */}
          <div className="pb-20">
            <div className="border border-gray-200 p-8 bg-gray-50">
              <h3 className="font-mono text-xs text-gray-500 mb-4 uppercase tracking-wider">Usage Instructions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. Click any GPT to open it in ChatGPT</p>
                <p>2. Requires ChatGPT Plus subscription</p>
                <p>3. Start chatting with the specialized assistant</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SubscriptionCheck>
  )
}
