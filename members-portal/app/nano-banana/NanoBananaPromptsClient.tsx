'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CustomizableField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'date'
  required: boolean
  placeholder?: string
  options?: string[]
}

interface NanoBananaPrompt {
  id: number
  title: string
  category: string
  description: string
  prompt: string
  tags: string[]
  customizableFields?: CustomizableField[]
}

export default function NanoBananaPromptsClient({ prompts }: { prompts: NanoBananaPrompt[] }) {
  const categories = Array.from(new Set(prompts.map(p => p.category))).sort()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(prompt.category)
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const copyToClipboard = (prompt: string, id: number) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex gap-8 py-8">
      {/* Left Sidebar - Categories */}
      <aside className="w-56 flex-shrink-0">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Categories</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                {category}
              </span>
            </label>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
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
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition"
            />
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Header with category */}
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                  {prompt.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                {prompt.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-1">
                {prompt.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {prompt.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-0.5 text-xs text-gray-500 bg-gray-50 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
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
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-500">
            No prompts found matching your criteria.
          </div>
        )}
      </main>
    </div>
  )
}
