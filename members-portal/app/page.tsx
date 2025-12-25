import Link from "next/link";
import Image from "next/image";
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
          {/* By Gencay */}
          <a
            href="https://www.learnwithmeai.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition"
          >
            <Image
              src="/me.png"
              alt="Gencay"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-gray-600 text-sm">By Gencay</span>
          </a>
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
              href="https://gencay.substack.com/subscribe"
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

      {/* Subscribe CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Build AI That Ships?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to get access to 640+ prompts, AI tools, projects, and weekly updates.
            Not theory. Practical, working AI systems.
          </p>
          <a
            href="https://gencay.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-full hover:bg-yellow-300 transition shadow-lg"
          >
            Subscribe on Substack
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <HomeCategories
        chatgptCategories={chatgptCategories}
        imageCategories={imageCategories}
      />

      {/* About Section - God of Prompt Style */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-200/50 rounded-3xl p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
                Hey, I'm Gencay.
              </h2>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                Founder of LearnAIWithMe
              </h3>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Photo */}
              <div className="flex justify-center md:justify-start">
                <Image
                  src="/me.png"
                  alt="Gencay"
                  width={220}
                  height={220}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              </div>

              {/* Story - Column 1 */}
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  I discovered ChatGPT's transformative potential a couple of years ago
                  and have since built 60+ AI agents. My work demonstrates extensive
                  hands-on experience with practical AI implementation.
                </p>
                <p>
                  That's why I created LearnAIWithMe—to share my journey and the
                  lessons I've learned.
                </p>
                <p>
                  I used to be an engineer struggling to keep up with the rapid pace
                  of AI development. But when ChatGPT arrived, it opened up a whole
                  new world for me.
                </p>
              </div>

              {/* Story - Column 2 */}
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  My goal is to empower everyone, no matter the technical skill, to
                  harness the full power of AI and achieve their dreams.
                </p>
                <p>
                  Join me on this exciting adventure as we explore the world of prompt
                  engineering and unlock AI's full potential together!
                </p>
                <p className="pt-4">
                  With gratitude,
                </p>
                <p className="font-bold text-gray-900">
                  Gencay from LearnAIWithMe
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-300">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">60+</div>
                <div className="text-sm text-gray-600">AI Agents Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">6,000+</div>
                <div className="text-sm text-gray-600">Hours Teaching AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-gray-900 mb-4">Ready to Level Up?</h2>
          <p className="text-gray-600 mb-8">
            For people who want to build AI tools that actually get used. Not theory. Shipping.
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
