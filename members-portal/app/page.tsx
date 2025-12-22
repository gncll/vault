import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'
import HomeCategories from './components/HomeCategories'
import { getPrompts } from '@/lib/github'
import nanoBananaPrompts from '@/data/nano-banana-prompts.json'

// Category icon mapping
const categoryIcons: Record<string, string> = {
  'Analysis': '🔍',
  'Business': '💼',
  'Career': '💼',
  'Content': '📝',
  'Conversation': '💬',
  'Critical Thinking': '🧠',
  'Learning': '📚',
  'Meta': '🎯',
  'Productivity': '⚡',
  'Recommendations': '⭐',
  'Research': '🔬',
  'Strategy': '♟️',
  'Summarization': '📋',
  'Development': '💻',
  'Data Science': '📊',
  'Documentation': '📝',
  'Writing': '✍️',
  'Marketing': '📣',
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

function getCategoryCounts(prompts: any[]) {
  const counts: Record<string, number> = {}
  prompts.forEach(p => {
    const cat = p.category || 'Other'
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

  const chatgptCategories = getCategoryCounts(chatgptPrompts)
  const imageCategories = getCategoryCounts(nanoBananaPrompts)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-gray-900 mb-4 leading-tight">
            The Vault
          </h1>
          {/* Golden Key Image */}
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/key.png"
              alt="Golden Key"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Unlock the vault to reach your private collection of prompts and AI tools to save you hours every day.
          </p>
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
