'use client'

import { useState, useRef } from 'react'

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
  { value: 'custom', label: 'Custom Colors', colors: [] },
]

const INSPIRATION_STYLES = [
  { value: '', label: 'None' },
  { value: 'harry_potter', label: 'Harry Potter / Wizarding World', description: 'Magical, mystical, parchment textures' },
  { value: 'lord_of_rings', label: 'Lord of the Rings / Fantasy', description: 'Epic, medieval, elvish aesthetics' },
  { value: 'star_wars', label: 'Star Wars / Sci-Fi', description: 'Space opera, galactic, futuristic' },
  { value: 'cyberpunk', label: 'Cyberpunk 2077', description: 'Neon lights, dystopian, high-tech' },
  { value: 'studio_ghibli', label: 'Studio Ghibli / Anime', description: 'Whimsical, nature-inspired, soft colors' },
  { value: 'marvel', label: 'Marvel / Comic Book', description: 'Bold, dynamic, superhero aesthetics' },
  { value: 'disney', label: 'Disney / Pixar', description: 'Colorful, family-friendly, magical' },
  { value: 'game_of_thrones', label: 'Game of Thrones', description: 'Dark, medieval, gritty realism' },
  { value: 'stranger_things', label: 'Stranger Things / 80s', description: 'Retro 80s, nostalgic, neon' },
  { value: 'matrix', label: 'The Matrix', description: 'Green code, digital rain, noir' },
  { value: 'wes_anderson', label: 'Wes Anderson', description: 'Pastel colors, symmetry, quirky' },
  { value: 'noir', label: 'Film Noir', description: 'Black & white, shadows, dramatic' },
  { value: 'art_deco', label: 'Art Deco / Great Gatsby', description: 'Golden, geometric, 1920s elegance' },
  { value: 'japanese', label: 'Japanese Traditional', description: 'Ukiyo-e, minimalist, zen aesthetics' },
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
  const [customColors, setCustomColors] = useState<string[]>(['#3b82f6', '#10b981', '#f59e0b'])
  const [currentColorIndex, setCurrentColorIndex] = useState<number | null>(null)
  const [inspirationStyle, setInspirationStyle] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [additionalNotes, setAdditionalNotes] = useState('')

  const colorPickerRef = useRef<HTMLInputElement>(null)

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
    const inspirationInfo = INSPIRATION_STYLES.find(s => s.value === inspirationStyle)

    // Get color description
    let colorDescription = colorInfo?.label || ''
    if (colorScheme === 'custom') {
      colorDescription = `Custom colors: ${customColors.join(', ')}`
    }

    const userInput = `Create an infographic about: ${topic}

Type: ${typeInfo?.label} - ${typeInfo?.description}
Visual Style: ${styleInfo?.label}
Color Scheme: ${colorDescription}
${inspirationStyle ? `Inspiration/Theme: ${inspirationInfo?.label} - ${inspirationInfo?.description}` : ''}
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
                    {color.value !== 'custom' ? (
                      <div className="flex gap-1 mb-1">
                        {color.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-1 mb-1">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                        <span className="text-xs">+</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-600">{color.label}</div>
                  </button>
                ))}
              </div>

              {/* Custom Color Picker */}
              {colorScheme === 'custom' && (
                <div className="mt-4 p-4 border border-gray-200 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Pick Your Colors
                  </label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {customColors.map((color, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() => {
                            setCurrentColorIndex(index)
                            setTimeout(() => colorPickerRef.current?.click(), 0)
                          }}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        {customColors.length > 1 && (
                          <button
                            onClick={() => {
                              setCustomColors(customColors.filter((_, i) => i !== index))
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {customColors.length < 5 && (
                      <button
                        onClick={() => {
                          setCustomColors([...customColors, '#6366f1'])
                          setCurrentColorIndex(customColors.length)
                          setTimeout(() => colorPickerRef.current?.click(), 0)
                        }}
                        className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-500 transition flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <input
                    ref={colorPickerRef}
                    type="color"
                    value={currentColorIndex !== null ? customColors[currentColorIndex] : '#3b82f6'}
                    onChange={(e) => {
                      if (currentColorIndex !== null) {
                        const newColors = [...customColors]
                        newColors[currentColorIndex] = e.target.value
                        setCustomColors(newColors)
                      }
                    }}
                    className="absolute opacity-0 pointer-events-none"
                  />
                  <p className="text-xs text-gray-500">Click on a color to change it. Add up to 5 colors.</p>
                </div>
              )}
            </div>
          </div>

          {/* Inspiration Style */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Inspiration / Theme Style <span className="text-gray-400">(optional)</span>
            </label>
            <div className="grid md:grid-cols-3 gap-2">
              {INSPIRATION_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setInspirationStyle(style.value)}
                  className={`p-3 border text-left transition ${
                    inspirationStyle === style.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{style.label}</div>
                  {style.description && (
                    <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                  )}
                </button>
              ))}
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
