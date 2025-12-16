'use client'

import { useState } from 'react'

const STYLE_OPTIONS = [
  { value: '', label: 'No specific style' },
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'anime', label: 'Anime' },
  { value: 'digital art', label: 'Digital Art' },
  { value: 'oil painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'sketch', label: 'Sketch' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: '3d render', label: '3D Render' },
  { value: 'pixel art', label: 'Pixel Art' },
]

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '4:3', label: '4:3 (Standard)' },
  { value: '3:4', label: '3:4 (Portrait)' },
  { value: '21:9', label: '21:9 (Ultra Wide)' },
]

export default function NanoBananaClient() {
  const [userInput, setUserInput] = useState('')
  const [style, setStyle] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [model, setModel] = useState<'flash' | 'pro'>('flash')

  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)

  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const generatePrompt = async () => {
    if (!userInput.trim()) return

    setIsGeneratingPrompt(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: userInput.trim(),
          type: 'image',
          style: style || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prompt')
      }

      setGeneratedPrompt(data.prompt)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const generateImage = async (prompt: string) => {
    if (!prompt.trim()) return

    setIsGeneratingImage(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          model
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.retryAfter) {
          throw new Error(`${data.error}`)
        }
        throw new Error(data.error || 'Failed to generate image')
      }

      if (data.image) {
        setGeneratedImage(`data:${data.image.mimeType};base64,${data.image.data}`)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleTestWithNanoBanana = () => {
    if (generatedPrompt) {
      generateImage(generatedPrompt)
    }
  }

  const handleDirectGenerate = () => {
    if (userInput.trim()) {
      generateImage(userInput.trim())
    }
  }

  return (
    <div className="py-8">
      {/* Input Section */}
      <div className="border border-gray-200 p-8 mb-8">
        <h2 className="font-serif text-2xl text-gray-900 mb-6">Create Your Image</h2>

        <div className="space-y-6">
          {/* User Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Describe what you want to create
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g., A futuristic city with flying cars at sunset..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition resize-none"
            />
          </div>

          {/* Options Row */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
              >
                {STYLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
              >
                {ASPECT_RATIOS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as 'flash' | 'pro')}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
              >
                <option value="flash">Nano Banana (Fast)</option>
                <option value="pro">Nano Banana Pro</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={generatePrompt}
              disabled={!userInput.trim() || isGeneratingPrompt}
              className="flex-1 bg-gray-900 text-white px-6 py-3 text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPrompt ? 'Generating Prompt...' : '✨ Generate Optimized Prompt'}
            </button>
            <button
              onClick={handleDirectGenerate}
              disabled={!userInput.trim() || isGeneratingImage}
              className="flex-1 border border-gray-900 text-gray-900 px-6 py-3 text-sm hover:bg-gray-900 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingImage ? 'Creating...' : '🍌 Generate Directly'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Generated Prompt Section */}
      {generatedPrompt && (
        <div className="border border-gray-200 p-8 mb-8 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-gray-900">Optimized Prompt</h3>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                className="border border-gray-300 text-gray-700 px-4 py-2 text-sm hover:bg-white transition"
              >
                Copy
              </button>
              <button
                onClick={handleTestWithNanoBanana}
                disabled={isGeneratingImage}
                className="bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isGeneratingImage ? 'Creating...' : '🍌 Test with Nano Banana Pro'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedPrompt}</p>
          </div>
        </div>
      )}

      {/* Generated Image Section */}
      {isGeneratingImage && (
        <div className="border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-sm text-gray-600">Nano Banana is creating your image...</p>
        </div>
      )}

      {generatedImage && !isGeneratingImage && (
        <div className="border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-gray-900">Generated Image</h3>
            <a
              href={generatedImage}
              download="nano-banana-image.png"
              className="border border-gray-900 text-gray-900 px-4 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
            >
              Download
            </a>
          </div>

          <div className="flex justify-center bg-gray-100 p-4">
            <img
              src={generatedImage}
              alt="Generated"
              className="max-w-full max-h-[600px] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
