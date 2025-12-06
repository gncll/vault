import Link from 'next/link'
import Image from 'next/image'

export default function Header({ showNav = false, children }: { showNav?: boolean, children?: React.ReactNode }) {
  return (
    <header className="border-b border-gray-200 bg-white">
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
          {showNav && (
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition">
              Dashboard
            </Link>
          )}
          {children}
        </nav>
      </div>
    </header>
  )
}
