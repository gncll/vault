import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getNanoBananaPrompts } from '@/lib/github'
import PromptTester from './PromptTester'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NanoBananaPromptPage({ params }: PageProps) {
  const { id } = await params
  const prompts = await getNanoBananaPrompts()
  const prompt = prompts.find((p: any) => p.id.toString() === id)

  if (!prompt) {
    notFound()
  }

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/nano-banana" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Nano Banana
            </Link>

            <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full mb-4">
              {prompt.category}
            </span>

            <h1 className="font-serif text-3xl text-gray-900 mb-3">{prompt.title}</h1>
            <p className="text-sm text-gray-600">{prompt.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {prompt.tags.map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <PromptTester prompt={prompt} />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
