import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/app/components/Header'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getPrompts } from '@/lib/github'
import PromptCustomizer from './PromptCustomizer'

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const prompts = await getPrompts()
  const prompt = prompts.find((p: any) => p.id.toString() === id)

  if (!prompt) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 mb-4">Prompt not found</h1>
          <Link href="/prompts" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Prompts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <Header showNav>
          <UserButton afterSignOutUrl="/" />
        </Header>

        <main className="max-w-4xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/prompts" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Prompts
            </Link>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="font-serif text-4xl text-gray-900">{prompt.title}</h1>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 font-mono">
                {prompt.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {prompt.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag: string) => (
                <span key={tag} className="text-xs text-gray-400 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <PromptCustomizer prompt={prompt} />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
