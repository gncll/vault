'use client'

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Header() {
  return (
    <header className="bg-gray-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="hidden md:flex items-center gap-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="LearnAIWithMe"
              width={32}
              height={32}
              className="object-contain invert"
            />
            <span className="font-serif text-white text-lg">LearnAIWithMe</span>
          </Link>
          <Link href="/prompts" className="text-base text-gray-300 hover:text-white transition">
            Prompts
          </Link>
          <div className="relative group">
            <button className="text-base text-gray-300 hover:text-white transition flex items-center gap-1">
              Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link href="/customgpts" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-t-lg">
                Custom GPTs
              </Link>
              <Link href="/projects" className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-b-lg">
                Projects
              </Link>
            </div>
          </div>
          <a
            href="https://learnwithmeai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-gray-300 hover:text-white transition"
          >
            Blog
          </a>
          <a
            href="https://www.learnwithmeai.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-gray-300 hover:text-white transition"
          >
            About
          </a>
          <a
            href="https://www.learnwithmeai.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-gray-300 hover:text-white transition"
          >
            Subscribe
          </a>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-base text-gray-300 hover:text-white transition">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-base px-5 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-full transition font-medium">
                Sign up
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-base text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
          </SignedIn>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
