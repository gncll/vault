import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import HomeCategories from './components/HomeCategories'
import { getPrompts } from '@/lib/github'
import nanoBananaPrompts from '@/data/nano-banana-prompts.json'

// Primary category icon mapping
const categoryIcons: Record<string, string> = {
  // Primary categories for ChatGPT prompts
  'Analysis': '🔍',
  'Business': '💼',
  'Career': '🎯',
  'Coding': '💻',
  'Creative': '🎨',
  'Education': '📚',
  'Finance': '💰',
  'Marketing': '📣',
  'Productivity': '⚡',
  'Writing': '✍️',
  // Image categories
  'Photorealism & Aesthetics': '📸',
  'Creative Experiments': '🎨',
  'Social Networking & Avatars': '👤',
  'E-commerce & Virtual Studio': '🛍️',
  'Education & Knowledge': '📚',
  'Photo Editing & Restoration': '🖼️',
  'Workplace & Productivity': '💼',
  'Daily Life & Translation': '🌍',
  'Social Media & Marketing': '📱',
  'Interior Design': '🏠',
}

function getCategoryCounts(prompts: any[], usePrimaryCategory = false) {
  const counts: Record<string, number> = {}
  prompts.forEach(p => {
    const cat = usePrimaryCategory ? (p.primaryCategory || p.category || 'Other') : (p.category || 'Other')
    counts[cat] = (counts[cat] || 0) + 1
  })
  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      icon: categoryIcons[name] || '📄',
      count
    }))
    .sort((a, b) => b.count - a.count)
}

export default async function Home() {
  const chatgptPrompts = await getPrompts()

  const chatgptCategories = getCategoryCounts(chatgptPrompts, true) // Use primaryCategory
  const imageCategories = getCategoryCounts(nanoBananaPrompts, false) // Use category for images

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 leading-tight">
            Build the Future
          </h1>
          <div className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg mb-8">
            <span className="text-4xl md:text-6xl font-black">In One Click.</span>
          </div>
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
            Save hours each day using prompts and AI tools to build and evolve.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/prompts"
              className="px-8 py-4 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 rounded-full transition text-center"
            >
              Explore Prompts
            </Link>
            <a
              href="https://www.learnwithmeai.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-yellow-300 text-gray-900 text-sm font-semibold hover:bg-yellow-400 rounded-full transition text-center"
            >
              Unlock Full Features
            </a>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-gray-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {/* Prompt Library */}
            <div>
              <div className="text-5xl mb-5">📚</div>
              <h3 className="text-2xl font-bold text-white mb-3">Prompt Library</h3>
              <p className="text-gray-400 text-base mb-6">
                640+ tested prompts for ChatGPT, Claude & Midjourney.
              </p>
              <Link
                href="/prompts"
                className="inline-block px-8 py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition"
              >
                Explore &gt;
              </Link>
            </div>

            {/* AI Tools */}
            <div>
              <div className="text-5xl mb-5">🛠️</div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Tools</h3>
              <p className="text-gray-400 text-base mb-6">
                Humanizer, Infographics Studio, Prompt Optimizer & more.
              </p>
              <Link
                href="/tools"
                className="inline-block px-8 py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition"
              >
                Try Now &gt;
              </Link>
            </div>

            {/* Need Help */}
            <div>
              <div className="text-5xl mb-5">💬</div>
              <h3 className="text-2xl font-bold text-white mb-3">Need Help?</h3>
              <p className="text-gray-400 text-base mb-6">
                Reach out and we will respond within 24 hours.
              </p>
              <a
                href="mailto:gencay@learnwithmeai.com"
                className="inline-block px-8 py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition"
              >
                Contact &gt;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <HomeCategories
        chatgptCategories={chatgptCategories}
        imageCategories={imageCategories}
      />

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-gray-900 mb-4">Ready to Level Up?</h2>
          <p className="text-gray-600 mb-8">
            Join the community of AI engineers and get instant access to all resources.
          </p>
          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://gencay.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 rounded-full transition"
              >
                Subscribe on Substack
              </a>
              <SignInButton mode="modal">
                <button className="px-8 py-4 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900 hover:text-gray-900 rounded-full transition">
                  Already a member? Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 rounded-full transition"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 font-mono">
            © 2024 LearnAIWithMe. Reserved for members only.
          </p>
        </div>
      </footer>
    </div>
  );
}
