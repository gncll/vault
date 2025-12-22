import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'

const TOOLS = [
  {
    name: 'AI Humanizer',
    description: 'Transform AI-generated text into natural, human-sounding content',
    href: '/tools/ai-writer',
    icon: '🧑',
    badge: 'New',
  },
  {
    name: 'Infographics Studio',
    description: 'Create stunning infographics with AI-powered image generation',
    href: '/tools/infographics',
    icon: '🎨',
    badge: null,
  },
  {
    name: 'Prompt Optimizer',
    description: 'Transform your prompts with AI-powered optimization techniques',
    href: '/tools/prompt-optimizer',
    icon: '⚡',
    badge: null,
  },
]

export default function ToolsPage() {
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-5xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <h1 className="font-serif text-4xl text-gray-900 mb-3">AI Tools</h1>
            <p className="text-sm text-gray-600">
              Powerful AI-powered tools to supercharge your productivity
            </p>
          </div>

          <div className="py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group border border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{tool.icon}</span>
                    {tool.badge && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-gray-700">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {tool.description}
                  </p>
                  <div className="mt-4 text-sm text-gray-400 group-hover:text-gray-600 transition flex items-center gap-1">
                    Open tool
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SubscriptionCheck>
  )
}
