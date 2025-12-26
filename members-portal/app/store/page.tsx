import Link from 'next/link'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'

const STORE_ITEMS = [
  {
    name: 'AI Humanizer',
    description: 'Transform AI-generated text into natural, human-sounding content',
    href: '/store/ai-writer',
    icon: '🧑',
    badge: 'New',
    category: 'AI Tools',
  },
  {
    name: 'Infographics Studio',
    description: 'Create stunning infographics with AI-powered image generation',
    href: '/store/infographics',
    icon: '🎨',
    badge: null,
    category: 'AI Tools',
  },
  {
    name: 'Prompt Optimizer',
    description: 'Transform your prompts with AI-powered optimization techniques',
    href: '/store/prompt-optimizer',
    icon: '⚡',
    badge: null,
    category: 'AI Tools',
  },
  {
    name: 'Custom GPTs',
    description: 'Pre-built GPTs for research, writing, analysis, and automation',
    href: '/store/custom-gpts',
    icon: '🤖',
    badge: null,
    category: 'Resources',
  },
  {
    name: 'Projects',
    description: 'Real project files: slides, code, datasets. See how things get built',
    href: '/store/projects',
    icon: '📁',
    badge: null,
    category: 'Resources',
  },
]

export default function StorePage() {
  const aiTools = STORE_ITEMS.filter(item => item.category === 'AI Tools')
  const resources = STORE_ITEMS.filter(item => item.category === 'Resources')

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <main className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="py-16 border-b border-gray-200 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Vault Store</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI tools and resources to save you hours every day
            </p>
          </div>

          {/* AI Tools Section */}
          <div className="py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">AI Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiTools.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-[60px] h-[60px] bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-gray-700">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-5 text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition flex items-center gap-2">
                    Open
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="py-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-[60px] h-[60px] bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-gray-700">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-5 text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition flex items-center gap-2">
                    Open
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
