'use client'

import { useState } from 'react'

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

export default function PromptCustomizer({ prompt }: { prompt: Prompt }) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [customizedPrompt, setCustomizedPrompt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Replace placeholders in prompt with form data
    let result = prompt.prompt
    Object.keys(formData).forEach(key => {
      const placeholder = `{${key}}`
      result = result.replace(new RegExp(placeholder, 'g'), formData[key])
    })

    setCustomizedPrompt(result)
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const copyToClipboard = () => {
    if (customizedPrompt) {
      navigator.clipboard.writeText(customizedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!prompt.customizableFields || prompt.customizableFields.length === 0) {
    return (
      <div className="py-12">
        <div className="bg-gray-50 border border-gray-200 p-8">
          <p className="text-sm text-gray-600">
            This prompt doesn't have customizable fields. You can copy it directly from the prompts library.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      {/* Customization Form */}
      <div className="border border-gray-200 p-8 mb-8">
        <h2 className="font-serif text-2xl text-gray-900 mb-6">Customize Your Prompt</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {prompt.customizableFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition resize-none"
                />
              )}

              {field.type === 'select' && field.options && (
                <select
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
                >
                  <option value="">Select an option...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white px-6 py-3 text-sm hover:bg-gray-800 transition"
          >
            Generate Customized Prompt
          </button>
        </form>
      </div>

      {/* Customized Result */}
      {customizedPrompt && (
        <div className="border border-gray-200 p-8 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-gray-900">Your Customized Prompt</h3>
            <button
              onClick={copyToClipboard}
              className="border border-gray-900 text-gray-900 px-4 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>

          <div className="bg-white border border-gray-200 p-4 mb-4">
            <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700">
              {customizedPrompt}
            </pre>
          </div>

          <p className="text-xs text-gray-500">
            Paste this customized prompt into ChatGPT, Claude, or your preferred AI assistant.
          </p>
        </div>
      )}

      {/* Original Prompt Reference */}
      {!customizedPrompt && (
        <div className="border border-gray-200 p-8 bg-gray-50">
          <h3 className="font-serif text-xl text-gray-900 mb-4">Original Prompt Template</h3>
          <div className="bg-white border border-gray-200 p-4">
            <pre className="whitespace-pre-wrap text-xs font-mono text-gray-600">
              {prompt.prompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
