'use client'

import { useState, useRef, useEffect } from 'react'

const INFOGRAPHIC_TYPES = [
  { value: 'comparison', label: 'Comparison', icon: '⚖️' },
  { value: 'timeline', label: 'Timeline', icon: '📅' },
  { value: 'process', label: 'Process Flow', icon: '🔄' },
  { value: 'statistics', label: 'Statistics', icon: '📈' },
  { value: 'list', label: 'List / Tips', icon: '📝' },
  { value: 'hierarchy', label: 'Hierarchy', icon: '🏛️' },
  { value: 'map', label: 'Geographic', icon: '🗺️' },
  { value: 'howto', label: 'How-To Guide', icon: '📖' },
]

const VISUAL_STYLES = [
  { value: 'modern', label: 'Modern Minimalist' },
  { value: 'corporate', label: 'Corporate Professional' },
  { value: 'playful', label: 'Playful & Colorful' },
  { value: 'flat', label: 'Flat Design' },
  { value: 'handdrawn', label: 'Hand-drawn Sketch' },
  { value: 'whiteboard', label: 'Whiteboard' },
  { value: '3d', label: '3D Rendered' },
  { value: 'isometric', label: 'Isometric' },
  { value: 'gradient', label: 'Gradient & Glassmorphism' },
]

const COLOR_SCHEMES = [
  { value: 'blue', label: 'Blue', colors: ['#1e40af', '#3b82f6', '#93c5fd'] },
  { value: 'green', label: 'Green', colors: ['#166534', '#22c55e', '#86efac'] },
  { value: 'purple', label: 'Purple', colors: ['#7c3aed', '#a78bfa', '#ddd6fe'] },
  { value: 'orange', label: 'Orange', colors: ['#ea580c', '#fb923c', '#fed7aa'] },
  { value: 'neutral', label: 'Neutral', colors: ['#374151', '#6b7280', '#d1d5db'] },
  { value: 'rainbow', label: 'Multi', colors: ['#ef4444', '#eab308', '#22c55e', '#3b82f6'] },
  { value: 'custom', label: 'Custom', colors: [] },
]

const INSPIRATION_STYLES = [
  { value: '', label: 'None' },
  { value: 'harry_potter', label: 'Harry Potter' },
  { value: 'lord_of_rings', label: 'Lord of the Rings' },
  { value: 'star_wars', label: 'Star Wars' },
  { value: 'marvel', label: 'Marvel / DC' },
  { value: 'disney', label: 'Disney / Pixar' },
  { value: 'studio_ghibli', label: 'Studio Ghibli' },
  { value: 'game_of_thrones', label: 'Game of Thrones' },
  { value: 'stranger_things', label: 'Stranger Things' },
  { value: 'matrix', label: 'The Matrix' },
  { value: 'avatar', label: 'Avatar' },
  { value: 'dune', label: 'Dune' },
  { value: 'blade_runner', label: 'Blade Runner' },
]

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1', desc: 'Square' },
  { value: '4:5', label: '4:5', desc: 'Portrait' },
  { value: '9:16', label: '9:16', desc: 'Stories' },
  { value: '16:9', label: '16:9', desc: 'Wide' },
  { value: '2:3', label: '2:3', desc: 'Pinterest' },
  { value: '3:4', label: '3:4', desc: 'Portrait' },
]

const IMAGE_MODELS = [
  { value: 'chatgpt', label: 'ChatGPT Image', badge: '✨' },
  { value: 'nano-banana', label: 'Nano Banana Pro', badge: '🍌' },
]

const OPENAI_SIZE_MAP: Record<string, '1024x1024' | '1536x1024' | '1024x1536'> = {
  '1:1': '1024x1024',
  '4:5': '1024x1536',
  '9:16': '1024x1536',
  '16:9': '1536x1024',
  '2:3': '1024x1536',
  '3:4': '1024x1536',
}

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
  const [imageModel, setImageModel] = useState('chatgpt')

  const colorPickerRef = useRef<HTMLInputElement>(null)

  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)

  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [dailyUsage, setDailyUsage] = useState<{ used: number; remaining: number; limit: number } | null>(null)

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    style: true,
    colors: false,
    inspiration: false,
    advanced: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/openai-image')
      if (response.ok) {
        const data = await response.json()
        setDailyUsage(data)
      }
    } catch (err) {
      console.error('Failed to fetch usage:', err)
    }
  }

  const generatePrompt = async () => {
    if (!topic.trim()) return

    setIsGeneratingPrompt(true)
    setError(null)

    const typeInfo = INFOGRAPHIC_TYPES.find(t => t.value === infographicType)
    const styleInfo = VISUAL_STYLES.find(s => s.value === visualStyle)
    const colorInfo = COLOR_SCHEMES.find(c => c.value === colorScheme)
    const inspirationInfo = INSPIRATION_STYLES.find(s => s.value === inspirationStyle)

    let colorDescription = colorInfo?.label || ''
    if (colorScheme === 'custom') {
      colorDescription = `Custom colors: ${customColors.join(', ')}`
    }

    const userInput = `Create an infographic about: ${topic}

Type: ${typeInfo?.label}
Visual Style: ${styleInfo?.label}
Color Scheme: ${colorDescription}
${inspirationStyle ? `Inspiration/Theme: ${inspirationInfo?.label}` : ''}
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

    try {
      let response: Response
      let data: any

      if (imageModel === 'chatgpt') {
        const openaiSize = OPENAI_SIZE_MAP[aspectRatio] || '1024x1024'
        response = await fetch('/api/openai-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            size: openaiSize,
            quality: 'high'
          })
        })

        data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate image')
        }

        if (data.image) {
          setGeneratedImage(`data:${data.image.mimeType};base64,${data.image.data}`)
        }

        if (data.remaining !== undefined) {
          setDailyUsage(prev => prev ? { ...prev, remaining: data.remaining, used: prev.limit - data.remaining } : null)
        }
      } else {
        response = await fetch('/api/nano-banana', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            aspectRatio,
            model: 'pro'
          })
        })

        data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate image')
        }

        if (data.image) {
          setGeneratedImage(`data:${data.image.mimeType};base64,${data.image.data}`)
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleCreateInfographic = async () => {
    // Generate prompt and immediately create image
    await generatePrompt()
  }

  // Auto-generate image when prompt is ready
  useEffect(() => {
    if (generatedPrompt && !generatedImage && !isGeneratingImage) {
      generateImage(generatedPrompt)
    }
  }, [generatedPrompt])

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* LEFT SIDEBAR - Settings */}
      <div className="w-72 flex-shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50">
        <div className="p-4 space-y-4">
          {/* Model Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_MODELS.map((model) => (
                <button
                  key={model.value}
                  onClick={() => setImageModel(model.value)}
                  className={`px-3 py-2 text-xs font-medium rounded transition ${
                    imageModel === model.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {model.badge} {model.label}
                </button>
              ))}
            </div>
            {imageModel === 'chatgpt' && dailyUsage && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(dailyUsage.limit)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < dailyUsage.used ? 'bg-gray-300' : 'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{dailyUsage.remaining} left</span>
              </div>
            )}
          </div>

          {/* Infographic Type */}
          <div>
            <button
              onClick={() => toggleSection('type')}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
            >
              <span>Type</span>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.type && (
              <div className="grid grid-cols-2 gap-1.5">
                {INFOGRAPHIC_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setInfographicType(type.value)}
                    className={`px-2 py-2 text-xs rounded transition text-left ${
                      infographicType === type.value
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Visual Style */}
          <div>
            <button
              onClick={() => toggleSection('style')}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
            >
              <span>Style</span>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.style ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.style && (
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:border-gray-400"
              >
                {VISUAL_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Color Scheme */}
          <div>
            <button
              onClick={() => toggleSection('colors')}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
            >
              <span>Colors</span>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.colors && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-1.5">
                  {COLOR_SCHEMES.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setColorScheme(color.value)}
                      className={`p-2 rounded transition ${
                        colorScheme === color.value
                          ? 'ring-2 ring-gray-900 ring-offset-1'
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                      title={color.label}
                    >
                      {color.value !== 'custom' ? (
                        <div className="flex gap-0.5 justify-center">
                          {color.colors.slice(0, 3).map((c, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="w-4 h-4 mx-auto rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                      )}
                    </button>
                  ))}
                </div>

                {colorScheme === 'custom' && (
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {customColors.map((color, index) => (
                        <div key={index} className="relative">
                          <button
                            onClick={() => {
                              setCurrentColorIndex(index)
                              setTimeout(() => colorPickerRef.current?.click(), 0)
                            }}
                            className="w-8 h-8 rounded border border-gray-300 hover:border-gray-500 transition"
                            style={{ backgroundColor: color }}
                          />
                          {customColors.length > 1 && (
                            <button
                              onClick={() => setCustomColors(customColors.filter((_, i) => i !== index))}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
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
                          className="w-8 h-8 rounded border-2 border-dashed border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-400"
                        >
                          +
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
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Dimensions
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`px-2 py-2 text-xs rounded transition ${
                    aspectRatio === ratio.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">{ratio.label}</div>
                  <div className="text-[10px] opacity-70">{ratio.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inspiration */}
          <div>
            <button
              onClick={() => toggleSection('inspiration')}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
            >
              <span>Theme Inspiration</span>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.inspiration ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.inspiration && (
              <select
                value={inspirationStyle}
                onChange={(e) => setInspirationStyle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:border-gray-400"
              >
                {INSPIRATION_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => toggleSection('advanced')}
              className="flex items-center justify-between w-full text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
            >
              <span>Advanced</span>
              <svg className={`w-4 h-4 transition-transform ${expandedSections.advanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.advanced && (
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:border-gray-400 resize-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Prompt & Image */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Prompt Section - Top (Compact) */}
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex gap-3 items-start">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe your infographic topic..."
              rows={2}
              className="flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition resize-none rounded"
            />
            <button
              onClick={handleCreateInfographic}
              disabled={!topic.trim() || isGeneratingPrompt}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed rounded whitespace-nowrap"
            >
              {isGeneratingPrompt ? 'Creating...' : 'Generate ✨'}
            </button>
          </div>


          {/* Error Display */}
          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}
        </div>

        {/* Image Section - Main Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {isGeneratingImage ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-sm text-gray-600">
                  {imageModel === 'chatgpt' ? 'ChatGPT' : 'Nano Banana Pro'} is creating your infographic...
                </p>
                <p className="text-xs text-gray-400 mt-2">This may take a moment</p>
              </div>
            </div>
          ) : generatedImage ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <span className="text-xs font-medium text-gray-500 uppercase">Result</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => generateImage(generatedPrompt)}
                    disabled={isGeneratingImage}
                    className="text-xs border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-white transition"
                  >
                    Regenerate
                  </button>
                  <a
                    href={generatedImage}
                    download="infographic.png"
                    className="text-xs bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
                  >
                    Download
                  </a>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center bg-white rounded-lg p-4 border border-gray-200 min-h-0">
                <img
                  src={generatedImage}
                  alt="Generated Infographic"
                  className="max-w-full max-h-full object-contain rounded"
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-sm">Your infographic will appear here</p>
                <p className="text-xs mt-1">Enter a topic and click Generate</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
