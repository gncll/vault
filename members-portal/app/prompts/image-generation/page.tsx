import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import ImagePromptsClient from './ImagePromptsClient'
import nanoBananaPrompts from '@/data/nano-banana-prompts.json'

export default function ImageGenerationPromptsPage() {
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/prompts" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Prompt Library
            </Link>
            <h1 className="font-serif text-4xl text-gray-900 mb-3">Image Generation Prompts</h1>
            <p className="text-sm text-gray-600">
              Ready-to-use prompts for AI image generation tools like Midjourney, DALL-E, and Stable Diffusion
            </p>

            {/* Create Custom Banner */}
            <Link
              href="/nano-banana/create"
              className="mt-6 block border border-gray-200 rounded-lg p-5 hover:bg-gray-50 hover:border-gray-300 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🖼️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">Create Custom Image</h3>
                    <p className="text-sm text-gray-500">Generate images with your own prompts using AI</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          <ImagePromptsClient prompts={nanoBananaPrompts} />
        </main>
      </div>
    </SubscriptionCheck>
  )
}
