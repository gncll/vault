'use client'

import { useState } from 'react'

export default function AIHumanizerClient() {
  const [inputText, setInputText] = useState('')
  const [humanizedText, setHumanizedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const humanizeContent = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)
    setError(null)
    setHumanizedText('')

    try {
      const response = await fetch('/api/humanizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to humanize content')
      }

      setHumanizedText(data.content)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(humanizedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setInputText('')
    setHumanizedText('')
    setError(null)
  }

  const wordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

  return (
    <div className="py-8">
      {/* Two Panel Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">AI-Generated Text</h3>
            <span className="text-xs text-gray-500">{wordCount(inputText)} words</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your AI-generated content here..."
            className="w-full h-[400px] px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gray-400 transition"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={humanizeContent}
              disabled={isLoading || !inputText.trim()}
              className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Humanizing...
                </span>
              ) : (
                'Humanize Content'
              )}
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Humanized Version</h3>
            <div className="flex items-center gap-3">
              {humanizedText && (
                <span className="text-xs text-gray-500">{wordCount(humanizedText)} words</span>
              )}
              {humanizedText && !isLoading && (
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="h-[400px] border border-gray-200 rounded-lg bg-gray-50 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-3"></div>
                  <div className="text-sm text-gray-600">Making it sound human...</div>
                </div>
              </div>
            ) : humanizedText ? (
              <div className="p-4">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800">
                  {humanizedText}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">🧑</div>
                  <div className="text-sm">Humanized content will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">How it works</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">1. Paste your text</span>
            <p className="mt-1">Add any AI-generated content that sounds robotic or unnatural.</p>
          </div>
          <div>
            <span className="font-medium text-gray-900">2. Click Humanize</span>
            <p className="mt-1">Our AI rewrites the content with a natural, conversational tone.</p>
          </div>
          <div>
            <span className="font-medium text-gray-900">3. Copy & use</span>
            <p className="mt-1">Get authentic-sounding content ready to publish anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
