'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Prompt {
  id: number
  title: string
  category: string
  primaryCategory?: string
  description: string
  prompt: string
  tags: string[]
}

interface PromptLibraryClientProps {
  chatgptPrompts: Prompt[]
  imagePrompts: Prompt[]
}

// Primary category icons and colors
const primaryCategoryConfig: Record<string, { icon: string; color: string }> = {
  'Analysis': { icon: '🔍', color: 'from-blue-500 to-blue-600' },
  'Business': { icon: '💼', color: 'from-slate-600 to-slate-700' },
  'Career': { icon: '🎯', color: 'from-purple-500 to-purple-600' },
  'Coding': { icon: '💻', color: 'from-green-500 to-green-600' },
  'Creative': { icon: '🎨', color: 'from-pink-500 to-pink-600' },
  'Education': { icon: '📚', color: 'from-yellow-500 to-yellow-600' },
  'Finance': { icon: '💰', color: 'from-emerald-500 to-emerald-600' },
  'Marketing': { icon: '📣', color: 'from-orange-500 to-orange-600' },
  'Productivity': { icon: '⚡', color: 'from-cyan-500 to-cyan-600' },
  'Writing': { icon: '✍️', color: 'from-indigo-500 to-indigo-600' },
}

export default function PromptLibraryClient({ chatgptPrompts, imagePrompts }: PromptLibraryClientProps) {
  const [activeTab, setActiveTab] = useState<'chatgpt' | 'image'>('chatgpt')
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const currentPrompts = activeTab === 'chatgpt' ? chatgptPrompts : imagePrompts

  // Get primary categories with counts
  const primaryCategories = useMemo(() => {
    const counts: Record<string, number> = {}
    currentPrompts.forEach(p => {
      const cat = p.primaryCategory || p.category || 'Other'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        ...primaryCategoryConfig[name] || { icon: '📄', color: 'from-gray-500 to-gray-600' }
      }))
      .sort((a, b) => b.count - a.count)
  }, [currentPrompts])

  // Get prompts for selected primary category
  const categoryPrompts = useMemo(() => {
    if (!selectedPrimaryCategory) return []
    return currentPrompts.filter(p =>
      (p.primaryCategory || p.category) === selectedPrimaryCategory
    )
  }, [currentPrompts, selectedPrimaryCategory])

  // Get unique tags for selected category
  const availableTags = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    categoryPrompts.forEach(p => {
      p.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12) // Top 12 tags
  }, [categoryPrompts])

  // Filter prompts by selected tags and search
  const filteredPrompts = useMemo(() => {
    return categoryPrompts.filter(prompt => {
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => prompt.tags?.includes(tag))
      const matchesSearch = !searchTerm ||
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesTags && matchesSearch
    })
  }, [categoryPrompts, selectedTags, searchTerm])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleTabChange = (tab: 'chatgpt' | 'image') => {
    setActiveTab(tab)
    setSelectedPrimaryCategory(null)
    setSelectedTags([])
    setSearchTerm('')
  }

  const handleBackToCategories = () => {
    setSelectedPrimaryCategory(null)
    setSelectedTags([])
    setSearchTerm('')
  }

  const copyToClipboard = (prompt: string, id: number) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      {/* Tab Toggle */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => handleTabChange('chatgpt')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition ${
              activeTab === 'chatgpt'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
            </svg>
            ChatGPT Prompts
          </button>
          <button
            onClick={() => handleTabChange('image')}
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

      {/* Main Content */}
      <div className="py-8">
        {!selectedPrimaryCategory ? (
          // Category Cards View
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeTab === 'chatgpt' ? 'ChatGPT Prompt Categories' : 'Image Prompt Categories'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {primaryCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedPrimaryCategory(category.name)}
                  className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-left hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl`}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count} Prompts</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          // Prompts List View for Selected Category
          <>
            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Categories
              </button>
            </div>

            {/* Category Title */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">
                {primaryCategoryConfig[selectedPrimaryCategory]?.icon || '📄'}
              </span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedPrimaryCategory}</h2>
                <p className="text-gray-600">{categoryPrompts.length} prompts available</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
                />
              </div>
            </div>

            {/* Tag Filters */}
            {availableTags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedTags.includes(tag)
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                      <span className="ml-1 opacity-60">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <div
                  key={`${activeTab}-${prompt.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {prompt.tags?.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                    {prompt.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
                    {prompt.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                    {activeTab === 'chatgpt' ? (
                      <>
                        <Link
                          href={`/prompts/${prompt.id}`}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2.5 rounded-lg text-sm text-center transition"
                        >
                          View Prompt
                        </Link>
                        <button
                          onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          title="Copy to clipboard"
                        >
                          {copiedId === prompt.id ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        <a
                          href={`https://chatgpt.com/?prompt=${encodeURIComponent(prompt.prompt)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          title="Open in ChatGPT"
                        >
                          <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729z"/>
                          </svg>
                        </a>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`/nano-banana/prompt/${prompt.id}`}
                          className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2.5 rounded-lg text-sm text-center transition"
                        >
                          Test Prompt
                        </Link>
                        <button
                          onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          title="Copy to clipboard"
                        >
                          {copiedId === prompt.id ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredPrompts.length === 0 && (
              <div className="py-20 text-center text-sm text-gray-500">
                No prompts found matching your criteria.
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      {activeTab === 'chatgpt' ? (
        <Link
          href="/prompts/prompt-optimizer"
          className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Prompt Optimizer
        </Link>
      ) : (
        <Link
          href="/nano-banana/infographics"
          className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Infographic Hub
        </Link>
      )}
    </>
  )
}
