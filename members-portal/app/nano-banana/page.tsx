import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getNanoBananaPrompts } from '@/lib/github'
import NanoBananaPromptsClient from './NanoBananaPromptsClient'

export default async function NanoBananaPage() {
  const prompts = await getNanoBananaPrompts()

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">🍌</span>
              <h1 className="font-serif text-4xl text-gray-900">Nano Banana</h1>
            </div>
            <p className="text-sm text-gray-600">
              AI-powered image generation studio. Browse prompts and create stunning visuals with Gemini.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="py-8 grid md:grid-cols-2 gap-4">
            <Link href="/nano-banana/create" className="block">
              <div className="border border-gray-200 p-6 hover:bg-gray-50 transition">
                <div className="text-2xl mb-3">🎨</div>
                <h3 className="font-serif text-xl text-gray-900 mb-2">Custom Creation</h3>
                <p className="text-sm text-gray-600">
                  Create images from scratch with your own prompts
                </p>
              </div>
            </Link>

            <Link href="/nano-banana/infographics" className="block">
              <div className="border border-gray-200 p-6 hover:bg-gray-50 transition">
                <div className="text-2xl mb-3">📊</div>
                <h3 className="font-serif text-xl text-gray-900 mb-2">Infographics</h3>
                <p className="text-sm text-gray-600">
                  Create professional infographics with AI assistance
                </p>
              </div>
            </Link>
          </div>

          {/* Prompts Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="font-serif text-2xl text-gray-900 mb-2">Prompt Library</h2>
            <p className="text-sm text-gray-600 mb-6">
              Curated collection of {prompts.length} prompts for Nano Banana Pro image generation
            </p>
          </div>

          <NanoBananaPromptsClient prompts={prompts} />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
