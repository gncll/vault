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

interface Prompt {
  id: number
  title: string
  category: string
  description: string
  prompt: string
  tags: string[]
  customizableFields?: CustomizableField[]
}

export default function PromptsClient({ prompts }: { prompts: Prompt[] }) {
  const categories = ['All', ...Array.from(new Set(prompts.map(p => p.category)))]
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyToClipboard = (prompt: string, id: number) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="py-8 space-y-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs font-mono transition ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts List */}
      <div className="py-12 space-y-1">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="border border-gray-200 p-8 hover:bg-gray-50 transition-colors">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-serif text-2xl text-gray-900">{prompt.title}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 font-mono">
                  {prompt.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {prompt.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="text-xs text-gray-400 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 mb-4">
              <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700">
                {prompt.prompt}
              </pre>
            </div>

            <div className="flex gap-2">
              {prompt.customizableFields && prompt.customizableFields.length > 0 && (
                <Link
                  href={`/prompts/${prompt.id}`}
                  className="flex-1 border border-gray-900 bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800 transition text-center"
                >
                  Customize
                </Link>
              )}
              <button
                onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                className={`${prompt.customizableFields && prompt.customizableFields.length > 0 ? 'flex-1' : 'w-full'} border border-gray-900 text-gray-900 px-4 py-2 text-sm hover:bg-gray-900 hover:text-white transition`}
              >
                {copiedId === prompt.id ? '✓ Copied to Clipboard' : 'Copy to Clipboard'}
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

      {/* Info Box */}
      <div className="pb-20">
        <div className="border border-gray-200 p-8 bg-gray-50">
          <h3 className="font-mono text-xs text-gray-500 mb-4 uppercase tracking-wider">How to Use</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. Click "Copy to Clipboard" on any prompt</p>
            <p>2. Paste into ChatGPT, Claude, or your AI assistant</p>
            <p>3. Customize for your specific needs</p>
          </div>
        </div>
      </div>
    </>
  )
}
