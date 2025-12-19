'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Category {
  name: string
  icon: string
  count: number
}

interface HomeCategoriesProps {
  chatgptCategories: Category[]
  imageCategories: Category[]
}

export default function HomeCategories({ chatgptCategories, imageCategories }: HomeCategoriesProps) {
  const [activeTab, setActiveTab] = useState<'chatgpt' | 'image'>('chatgpt')

  const categories = activeTab === 'chatgpt' ? chatgptCategories : imageCategories
  const totalPrompts = categories.reduce((acc, cat) => acc + cat.count, 0)

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('chatgpt')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition ${
                activeTab === 'chatgpt'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.4850 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
              </svg>
              ChatGPT
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition ${
                activeTab === 'image'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image Generation
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-gray-900 mb-2">
            {activeTab === 'chatgpt' ? 'Prompt Library Categories:' : 'Image Prompt Categories:'}
          </h2>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href="/prompts"
              className="group bg-gray-900 hover:bg-gray-800 rounded-2xl p-6 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{category.icon}</span>
                    <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{category.count} Prompts</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Total Count */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {totalPrompts} prompts in {categories.length} categories
          </p>
        </div>
      </div>

      {/* Floating Action Button */}
      {activeTab === 'chatgpt' ? (
        <Link
          href="/prompts/prompt-optimizer"
          className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition hover:scale-105 z-40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Prompt Optimizer
        </Link>
      ) : (
        <Link
          href="/nano-banana/infographics"
          className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition hover:scale-105 z-40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Infographic Hub
        </Link>
      )}
    </section>
  )
}
