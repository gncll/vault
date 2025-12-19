'use client'

import { useState } from 'react'

const TECHNIQUES = [
  { id: 'zero-shot', name: 'Zero-Shot', description: 'Make prompts direct, specific, and clear' },
  { id: 'few-shot', name: 'Few-Shot', description: 'Add examples to guide the response' },
  { id: 'chain-of-thought', name: 'Chain of Thought', description: 'Break down into logical steps' },
  { id: 'role-prompting', name: 'Role Prompting', description: 'Assign an expert persona' }
]

const TONES = ['Normal', 'Concise', 'Explanatory', 'Conversational', 'Friendly', 'Confident', 'Minimalist', 'Witty']

const LANGUAGES = ['English', 'Turkish', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Korean']

export default function PromptOptimizerClient() {
  const [prompt, setPrompt] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Settings
  const [technique, setTechnique] = useState('zero-shot')
  const [language, setLanguage] = useState('English')
  const [tone, setTone] = useState('Normal')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [targetAudience, setTargetAudience] = useState('')
  const [persona, setPersona] = useState('')
  const [positiveExamples, setPositiveExamples] = useState('')
  const [negativeExamples, setNegativeExamples] = useState('')

  const optimizePrompt = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setOptimizedPrompt('')

    try {
      const response = await fetch('/api/prompt-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          technique,
          language,
          tone,
          targetAudience: targetAudience.trim() || undefined,
          persona: persona.trim() || undefined,
          positiveExamples: positiveExamples.trim() || undefined,
          negativeExamples: negativeExamples.trim() || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize prompt')
      }

      setOptimizedPrompt(data.optimizedPrompt)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimizedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openInChatGPT = () => {
    const url = `https://chatgpt.com/?prompt=${encodeURIComponent(optimizedPrompt)}`
    window.open(url, '_blank')
  }

  return (
    <div className="py-8">
      {/* Technique Selection */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Optimization Technique</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TECHNIQUES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTechnique(t.id)}
              className={`p-4 border rounded-lg text-left transition ${
                technique === t.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm text-gray-900">{t.name}</div>
              <div className="text-xs text-gray-500 mt-1">{t.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input/Output Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Input */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Original Prompt</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here... (e.g., 'Write about marketing')"
            rows={8}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gray-400 transition"
          />

          {/* Quick Settings */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs text-gray-500 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs text-gray-500 mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={optimizePrompt}
            disabled={isLoading || !prompt.trim()}
            className="w-full mt-6 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Optimizing...
              </span>
            ) : (
              'Optimize Prompt'
            )}
          </button>
        </div>

        {/* Output */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Optimized Prompt</h3>
            {optimizedPrompt && !isLoading && (
              <div className="flex gap-2">
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
                <button
                  onClick={openInChatGPT}
                  className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.4850 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                  </svg>
                  ChatGPT
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[220px] border border-gray-200 rounded-lg bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-[220px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-3"></div>
                  <div className="text-sm text-gray-600">Optimizing your prompt...</div>
                </div>
              </div>
            ) : optimizedPrompt ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 p-4 overflow-auto max-h-[300px]">
                {optimizedPrompt}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-[220px] text-gray-400">
                <div className="text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="text-sm">Your optimized prompt will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Advanced Settings */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
        >
          <span className="font-medium text-gray-900">Advanced Settings</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="px-6 pb-6 space-y-6 border-t border-gray-200">
            <div className="pt-6 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., 'Software developers', 'Beginners'"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Persona / Expert Role</label>
                <input
                  type="text"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  placeholder="e.g., 'Senior marketing strategist'"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Positive Examples <span className="font-normal text-gray-500">(What good outputs look like)</span>
              </label>
              <textarea
                value={positiveExamples}
                onChange={(e) => setPositiveExamples(e.target.value)}
                placeholder="Describe characteristics of ideal responses..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Negative Examples <span className="font-normal text-gray-500">(What to avoid)</span>
              </label>
              <textarea
                value={negativeExamples}
                onChange={(e) => setNegativeExamples(e.target.value)}
                placeholder="Describe characteristics to avoid in responses..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Tips for Better Prompts</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex gap-3">
            <span className="text-gray-400">1.</span>
            <span>Be specific about what you want - vague prompts get vague results</span>
          </div>
          <div className="flex gap-3">
            <span className="text-gray-400">2.</span>
            <span>Include context about your audience and purpose</span>
          </div>
          <div className="flex gap-3">
            <span className="text-gray-400">3.</span>
            <span>Specify the format you want (bullet points, paragraphs, etc.)</span>
          </div>
          <div className="flex gap-3">
            <span className="text-gray-400">4.</span>
            <span>Use the technique that matches your task complexity</span>
          </div>
        </div>
      </div>
    </div>
  )
}
