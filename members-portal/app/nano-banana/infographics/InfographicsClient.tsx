'use client'

import { useState } from 'react'

const INFOGRAPHIC_TYPES = [
  { value: 'comparison', label: 'Comparison', description: 'Compare two or more items side by side' },
  { value: 'timeline', label: 'Timeline', description: 'Show events or steps in chronological order' },
  { value: 'process', label: 'Process Flow', description: 'Illustrate steps in a process' },
  { value: 'statistics', label: 'Statistics', description: 'Visualize data and numbers' },
  { value: 'list', label: 'List / Tips', description: 'Present information in a list format' },
  { value: 'hierarchy', label: 'Hierarchy', description: 'Show organizational or ranking structure' },
  { value: 'map', label: 'Geographic', description: 'Location-based information' },
  { value: 'howto', label: 'How-To Guide', description: 'Step-by-step instructions' },
]

const VISUAL_STYLES = [
  { value: 'modern', label: 'Modern Minimalist' },
  { value: 'corporate', label: 'Corporate Professional' },
  { value: 'playful', label: 'Playful & Colorful' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'vintage', label: 'Vintage Retro' },
  { value: 'tech', label: 'Tech / Futuristic' },
  { value: 'handdrawn', label: 'Hand-drawn Style' },
  { value: 'flat', label: 'Flat Design' },
]

const COLOR_SCHEMES = [
  { value: 'blue', label: 'Blue Tones', colors: ['#1e40af', '#3b82f6', '#93c5fd'] },
  { value: 'green', label: 'Green Tones', colors: ['#166534', '#22c55e', '#86efac'] },
  { value: 'purple', label: 'Purple Tones', colors: ['#7c3aed', '#a78bfa', '#ddd6fe'] },
  { value: 'orange', label: 'Orange/Warm', colors: ['#ea580c', '#fb923c', '#fed7aa'] },
  { value: 'neutral', label: 'Neutral/Gray', colors: ['#374151', '#6b7280', '#d1d5db'] },
  { value: 'rainbow', label: 'Multi-color', colors: ['#ef4444', '#eab308', '#22c55e', '#3b82f6'] },
]

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Square - Instagram)' },
  { value: '4:5', label: '4:5 (Portrait - Instagram)' },
  { value: '9:16', label: '9:16 (Stories/Reels)' },
  { value: '16:9', label: '16:9 (Presentation)' },
  { value: '2:3', label: '2:3 (Pinterest)' },
  { value: '3:4', label: '3:4 (Portrait)' },
]

export default function InfographicsClient() {
  const [topic, setTopic] = useState('')
  const [infographicType, setInfographicType] = useState('comparison')
  const [visualStyle, setVisualStyle] = useState('modern')
  const [colorScheme, setColorScheme] = useState('blue')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [additionalNotes, setAdditionalNotes] = useState('')

  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)

  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const generatePrompt = async () => {
    if (!topic.trim()) return

    setIsGeneratingPrompt(true)
    setError(null)

    const typeInfo = INFOGRAPHIC_TYPES.find(t => t.value === infographicType)
    const styleInfo = VISUAL_STYLES.find(s => s.value === visualStyle)
    const colorInfo = COLOR_SCHEMES.find(c => c.value === colorScheme)

    const userInput = `Create an infographic about: ${topic}

Type: ${typeInfo?.label} - ${typeInfo?.description}
Visual Style: ${styleInfo?.label}
Color Scheme: ${colorInfo?.label}
${additionalNotes ? `Additional notes: ${additionalNotes}` : ''}`

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          type: 'infographic',
          style: visualStyle,
          infographicType
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
          model: 'pro'
        })
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
      setIsGeneratingImage(false)
    }
  }

  const handleCreateInfographic = async () => {
    await generatePrompt()
  }

  const handleTestWithNanoBanana = () => {
    if (generatedPrompt) {
      generateImage(generatedPrompt)
    }
  }

  return (
    <div className="py-8">
      {/* Configuration Section */}
      <div className="border border-gray-200 p-8 mb-8">
        <h2 className="font-serif text-2xl text-gray-900 mb-6">Configure Your Infographic</h2>

        <div className="space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Topic / Subject <span className="text-red-500">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The benefits of remote work, Steps to learn programming, Comparing iPhone vs Android..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition resize-none"
            />
          </div>

          {/* Infographic Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Infographic Type
            </label>
            <div className="grid md:grid-cols-4 gap-3">
              {INFOGRAPHIC_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setInfographicType(type.value)}
                  className={`p-4 border text-left transition ${
                    infographicType === type.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Style & Color Scheme Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Visual Style */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Visual Style
              </label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
              >
                {VISUAL_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Color Scheme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_SCHEMES.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setColorScheme(color.value)}
                    className={`p-3 border transition ${
                      colorScheme === color.value
                        ? 'border-gray-900'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex gap-1 mb-1">
                      {color.colors.map((c, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">{color.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Aspect Ratio / Size
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition"
            >
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any specific elements, data points, or requirements..."
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleCreateInfographic}
            disabled={!topic.trim() || isGeneratingPrompt}
            className="w-full bg-gray-900 text-white px-6 py-4 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPrompt ? 'Creating Prompt...' : '✨ Generate Infographic Prompt'}
          </button>
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
            <h3 className="font-serif text-xl text-gray-900">Generated Prompt</h3>
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
                {isGeneratingImage ? 'Creating...' : '🍌 Create with Nano Banana Pro'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedPrompt}</p>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            You can edit this prompt before generating, or copy it to use elsewhere.
          </p>
        </div>
      )}

      {/* Generated Image Section */}
      {isGeneratingImage && (
        <div className="border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-sm text-gray-600">Nano Banana Pro is creating your infographic...</p>
          <p className="text-xs text-gray-400 mt-2">This may take a moment for complex designs</p>
        </div>
      )}

      {generatedImage && !isGeneratingImage && (
        <div className="border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-gray-900">Your Infographic</h3>
            <div className="flex gap-2">
              <button
                onClick={handleTestWithNanoBanana}
                disabled={isGeneratingImage}
                className="border border-gray-300 text-gray-700 px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                Regenerate
              </button>
              <a
                href={generatedImage}
                download="infographic.png"
                className="border border-gray-900 text-gray-900 px-4 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
              >
                Download
              </a>
            </div>
          </div>

          <div className="flex justify-center bg-gray-100 p-4">
            <img
              src={generatedImage}
              alt="Generated Infographic"
              className="max-w-full max-h-[800px] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
