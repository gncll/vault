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

interface NanoBananaPrompt {
  id: number
  title: string
  category: string
  description: string
  prompt: string
  tags: string[]
  customizableFields?: CustomizableField[]
}

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '4:3', label: '4:3 (Standard)' },
  { value: '3:4', label: '3:4 (Portrait)' },
  { value: '4:5', label: '4:5 (Instagram)' },
]

export default function PromptTester({ prompt }: { prompt: NanoBananaPrompt }) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  // Build the final prompt with customizable fields filled in
  const buildFinalPrompt = () => {
    let finalPrompt = prompt.prompt

    if (prompt.customizableFields) {
      prompt.customizableFields.forEach((field) => {
        const value = fieldValues[field.name]
        if (value) {
          // Replace placeholders like [BRAND], {brand_name}, etc.
          const patterns = [
            new RegExp(`\\[${field.name.toUpperCase()}\\]`, 'gi'),
            new RegExp(`\\{${field.name}\\}`, 'gi'),
            new RegExp(`\\[${field.name}\\]`, 'gi'),
          ]
          patterns.forEach((pattern) => {
            finalPrompt = finalPrompt.replace(pattern, value)
          })
        }
      })
    }

    return finalPrompt
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const generateImage = async () => {
    const finalPrompt = buildFinalPrompt()
    if (!finalPrompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt.trim(),
          aspectRatio,
          model: 'pro',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      if (data.image) {
        setGeneratedImage(`data:${data.image.mimeType};base64,${data.image.data}`)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(buildFinalPrompt())
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  return (
    <div className="py-8">
      {/* Customizable Fields */}
      {prompt.customizableFields && prompt.customizableFields.length > 0 && (
        <div className="border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Customize Prompt</h3>
          <div className="space-y-4">
            {prompt.customizableFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Display */}
      <div className="border border-gray-200 p-6 mb-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Prompt</h3>
          <button
            onClick={copyPrompt}
            className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
          >
            {copiedPrompt ? (
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
        </div>
        <div className="bg-white border border-gray-200 p-4 max-h-64 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{buildFinalPrompt()}</pre>
        </div>
      </div>

      {/* Generation Options */}
      <div className="border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Generation Options</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
            >
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <div className="px-4 py-2 border border-gray-200 text-sm bg-gray-50 text-gray-600">
              Nano Banana Pro (Best Quality)
            </div>
          </div>
        </div>

        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="w-full mt-6 bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Image...
            </span>
          ) : (
            '🍌 Generate with Nano Banana Pro'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Generated Image */}
      {isGenerating && (
        <div className="border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-sm text-gray-600">Nano Banana Pro is creating your image...</p>
          <p className="text-xs text-gray-400 mt-2">This may take a moment</p>
        </div>
      )}

      {generatedImage && !isGenerating && (
        <div className="border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Generated Image</h3>
            <div className="flex gap-2">
              <button
                onClick={generateImage}
                disabled={isGenerating}
                className="border border-gray-300 text-gray-700 px-4 py-2 text-sm hover:bg-gray-50 transition"
              >
                Regenerate
              </button>
              <a
                href={generatedImage}
                download={`nano-banana-${prompt.id}.png`}
                className="border border-gray-900 text-gray-900 px-4 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
              >
                Download
              </a>
            </div>
          </div>

          <div className="flex justify-center bg-gray-100 p-4 rounded">
            <img
              src={generatedImage}
              alt={prompt.title}
              className="max-w-full max-h-[600px] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
