import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
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
          <nav className="flex items-center gap-8">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm px-5 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="py-24 text-center border-b border-gray-200">
          <h1 className="font-serif text-6xl text-gray-900 mb-6 leading-tight">
            The Vault
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Exclusive archives for paid Substack members
          </p>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition">
                Access the Vault
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              Enter the Vault
            </Link>
          </SignedIn>
        </div>

        {/* Collections - Minimal Cards */}
        <div className="py-20 grid md:grid-cols-4 gap-1 border-b border-gray-200 items-stretch">
          <Link href="/customgpts" className="group h-full">
            <div className="border border-gray-200 p-8 hover:bg-gray-50 transition-colors h-full flex flex-col">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-serif text-xl mb-2 text-gray-900">Custom GPTs</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                Specialized AI assistants designed for specific engineering tasks
              </p>
              <div className="mt-4 text-xs text-gray-400 group-hover:text-gray-600 transition">
                View Collection →
              </div>
            </div>
          </Link>

          <Link href="/projects" className="group h-full">
            <div className="border border-gray-200 p-8 hover:bg-gray-50 transition-colors h-full flex flex-col">
              <div className="mb-4">
                <Image
                  src="/project-icon.png"
                  alt="Projects"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <h3 className="font-serif text-xl mb-2 text-gray-900">Project Archives</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                Detailed documentation and guides for hands-on engineering projects
              </p>
              <div className="mt-4 text-xs text-gray-400 group-hover:text-gray-600 transition">
                View Collection →
              </div>
            </div>
          </Link>

          <Link href="/prompts" className="group h-full">
            <div className="border border-gray-200 p-8 hover:bg-gray-50 transition-colors h-full flex flex-col">
              <div className="text-3xl mb-4">✍️</div>
              <h3 className="font-serif text-xl mb-2 text-gray-900">Prompt Library</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                Curated collection of high-quality prompts for various use cases
              </p>
              <div className="mt-4 text-xs text-gray-400 group-hover:text-gray-600 transition">
                View Collection →
              </div>
            </div>
          </Link>

          <Link href="/nano-banana" className="group h-full">
            <div className="border border-gray-200 p-8 hover:bg-gray-50 transition-colors h-full flex flex-col">
              <div className="text-3xl mb-4">🍌</div>
              <h3 className="font-serif text-xl mb-2 text-gray-900">Nano Banana</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                AI image generation studio with prompt testing and infographics
              </p>
              <div className="mt-4 text-xs text-gray-400 group-hover:text-gray-600 transition">
                Create Images →
              </div>
            </div>
          </Link>
        </div>

        {/* Access Notice */}
        <div className="py-20 text-center">
          <div className="max-w-2xl mx-auto border border-gray-200 p-12">
            <h2 className="font-serif text-2xl mb-4 text-gray-900">Not a Member Yet?</h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              The Vault is exclusively available to Substack subscribers.
              Support the work and gain access to all archived knowledge.
            </p>
            <a
              href="https://gencay.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-gray-900 text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition"
            >
              Subscribe on Substack
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 font-mono">
            © 2024 LearnAIWithMe. Reserved for members only.
          </p>
        </div>
      </footer>
    </div>
  );
}
