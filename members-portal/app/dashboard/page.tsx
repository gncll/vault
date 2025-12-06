import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function Dashboard() {
  const user = await currentUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="LearnAIWithMe"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <div className="font-serif text-xl text-gray-900">LearnAIWithMe</div>
              <div className="text-xs text-gray-500 font-mono tracking-wider">THE VAULT</div>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            {user?.primaryEmailAddress?.emailAddress && (
              <span className="text-xs text-gray-500 font-mono">
                {user.primaryEmailAddress.emailAddress}
              </span>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="py-16 border-b border-gray-200">
          <h1 className="font-serif text-4xl text-gray-900 mb-3">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-sm text-gray-600">
            Access your exclusive collections below
          </p>
        </div>

        {/* Collections Grid */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-1">
          <Link href="/customgpts" className="group">
            <div className="border border-gray-200 p-10 hover:bg-gray-50 transition-colors">
              <div className="text-3xl mb-4">🤖</div>
              <h2 className="font-serif text-2xl mb-3 text-gray-900">Custom GPTs</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Specialized AI assistants designed for specific engineering tasks
              </p>
              <div className="text-xs text-gray-400 group-hover:text-gray-600 transition">
                View Collection →
              </div>
            </div>
          </Link>

          <Link href="/projects" className="group">
            <div className="border-t border-b border-r md:border-l border-gray-200 p-10 hover:bg-gray-50 transition-colors">
              <div className="mb-4">
                <Image
                  src="/project-icon.png"
                  alt="Projects"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h2 className="font-serif text-2xl mb-3 text-gray-900">Project Archives</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Detailed documentation and guides for hands-on projects
              </p>
              <div className="text-xs text-gray-400 group-hover:text-gray-600 transition">
                View Collection →
              </div>
            </div>
          </Link>

          <Link href="/prompts" className="group">
            <div className="border border-gray-200 p-10 hover:bg-gray-50 transition-colors">
              <div className="text-3xl mb-4">✍️</div>
              <h2 className="font-serif text-2xl mb-3 text-gray-900">Prompt Library</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Curated collection of high-quality prompts
              </p>
              <div className="text-xs text-gray-400 group-hover:text-gray-600 transition">
                View Collection →
              </div>
            </div>
          </Link>

          <Link href="/news" className="group">
            <div className="border border-gray-200 p-10 hover:bg-gray-50 transition-colors">
              <div className="text-3xl mb-4">📰</div>
              <h2 className="font-serif text-2xl mb-3 text-gray-900">AI News</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Latest updates and insights from the AI world
              </p>
              <div className="text-xs text-gray-400 group-hover:text-gray-600 transition">
                View Collection →
              </div>
            </div>
          </Link>
        </div>

        {/* Status Bar */}
        <div className="py-12 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Collections</div>
              <div className="text-2xl font-serif text-gray-900">3</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Status</div>
              <div className="text-2xl font-serif text-gray-900">Active</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Access</div>
              <div className="text-2xl font-serif text-gray-900">24/7</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
