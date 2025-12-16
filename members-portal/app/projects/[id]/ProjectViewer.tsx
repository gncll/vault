'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import Header from '@/app/components/Header'
import ChatPanel from './ChatPanel'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Project {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  slides: string
  solutionPdf: string
  solutionNotebook: string
  data: Array<{name: string, url: string}>
}

type ViewMode = 'slides' | 'solution' | 'notebook' | 'data'

export default function ProjectViewer({ project }: { project: Project | null }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [viewMode, setViewMode] = useState<ViewMode>('slides')
  const [chatOpen, setChatOpen] = useState(false)
  const [pdfText, setPdfText] = useState<string>('')

  // Extract text from PDF for AI context
  useEffect(() => {
    if (project?.solutionPdf) {
      extractPdfText(project.solutionPdf)
    }
  }, [project?.solutionPdf])

  const extractPdfText = async (pdfUrl: string) => {
    try {
      const loadingTask = pdfjs.getDocument(pdfUrl)
      const pdf = await loadingTask.promise
      let fullText = ''

      // Extract text from first 10 pages (to limit context size)
      const maxPages = Math.min(pdf.numPages, 10)
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n\n'
      }

      // Limit to ~15000 chars to stay within token limits
      setPdfText(fullText.substring(0, 15000))
      console.log('[PDF] Extracted text length:', fullText.length)
    } catch (error) {
      console.error('[PDF] Text extraction failed:', error)
    }
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Header showNav>
          <UserButton afterSignOutUrl="/" />
        </Header>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-serif text-2xl text-gray-900 mb-4">Project not found</h2>
          <Link href="/projects" className="text-sm text-gray-600 hover:text-gray-900 transition">
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const getCurrentPdfUrl = () => {
    if (viewMode === 'slides') return project.slides
    if (viewMode === 'solution') return project.solutionPdf
    return ''
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showNav>
        <UserButton afterSignOutUrl="/" />
      </Header>

      {/* Header with Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/projects" className="text-xs text-gray-500 hover:text-gray-900 transition inline-block mb-2">
                ← Back to Projects
              </Link>
              <h2 className="font-serif text-xl text-gray-900">{project.title}</h2>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
            <button
              onClick={() => setViewMode('slides')}
              className={`px-4 py-2 text-sm transition border-b-2 ${
                viewMode === 'slides'
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Slides
            </button>
            {project.solutionPdf && (
              <button
                onClick={() => setViewMode('solution')}
                className={`px-4 py-2 text-sm transition border-b-2 ${
                  viewMode === 'solution'
                    ? 'border-gray-900 text-gray-900 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Solution PDF
              </button>
            )}
            {project.solutionNotebook && (
              <button
                onClick={() => setViewMode('notebook')}
                className={`px-4 py-2 text-sm transition border-b-2 ${
                  viewMode === 'notebook'
                    ? 'border-gray-900 text-gray-900 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Jupyter Notebook
              </button>
            )}
            {project.data && project.data.length > 0 && (
              <button
                onClick={() => setViewMode('data')}
                className={`px-4 py-2 text-sm transition border-b-2 ${
                  viewMode === 'data'
                    ? 'border-gray-900 text-gray-900 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Data Files
              </button>
            )}

            {/* Chat Button - in tab bar */}
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Ask AI
            </button>
          </div>

          {/* PDF Controls - Only show for Slides and Solution */}
          {(viewMode === 'slides' || viewMode === 'solution') && (
            <div className="flex items-center justify-between">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  className="px-3 py-1 border border-gray-200 text-sm hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="text-xs text-gray-600 min-w-[50px] text-center font-mono">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                  className="px-3 py-1 border border-gray-200 text-sm hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="px-3 py-1 border border-gray-200 text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600 min-w-[100px] text-center font-mono">
                  Page {pageNumber} of {numPages || '...'}
                </span>
                <button
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="px-3 py-1 border border-gray-200 text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* PDF Viewer for Slides and Solution */}
        {(viewMode === 'slides' || viewMode === 'solution') && (
          <div className="border border-gray-200 p-8 flex justify-center bg-gray-50">
            <Document
              file={getCurrentPdfUrl()}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Loading PDF...</p>
                </div>
              }
              error={
                <div className="text-center py-12">
                  <p className="text-sm text-red-600 mb-4">Failed to load PDF</p>
                  <p className="text-xs text-gray-500">
                    The PDF file could not be loaded from GitHub.
                  </p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}

        {/* Jupyter Notebook Viewer */}
        {viewMode === 'notebook' && project.solutionNotebook && (
          <div className="border border-gray-200 p-8 bg-white">
            <h3 className="font-serif text-2xl text-gray-900 mb-6">Jupyter Notebook</h3>
            <p className="text-sm text-gray-600 mb-8">
              Download the Jupyter notebook file to run it locally in your preferred environment (Jupyter, VS Code, Google Colab, etc.)
            </p>
            <div className="border border-gray-200 p-6 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Solution Notebook</h4>
                  <p className="text-xs text-gray-500 font-mono">
                    {decodeURIComponent(project.solutionNotebook.split('/').pop()?.split('?')[0] || 'notebook.ipynb')}
                  </p>
                </div>
                <a
                  href={project.solutionNotebook}
                  download={decodeURIComponent(project.solutionNotebook.split('/').pop()?.split('?')[0] || 'notebook.ipynb')}
                  className="border border-gray-900 text-gray-900 px-6 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
                >
                  Download Notebook
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Data Files Download Section */}
        {viewMode === 'data' && project.data && project.data.length > 0 && (
          <div className="border border-gray-200 p-8 bg-white">
            <h3 className="font-serif text-2xl text-gray-900 mb-6">Download Data Files</h3>
            <p className="text-sm text-gray-600 mb-8">
              Download the datasets required for this project. All files are provided in CSV format.
            </p>

            <div className="space-y-4">
              {project.data.map((file: {name: string, url: string}, index: number) => (
                <div key={index} className="border border-gray-200 p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{file.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{file.url.split('/').pop()}</p>
                    </div>
                    <a
                      href={file.url}
                      download
                      className="border border-gray-900 text-gray-900 px-6 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
                    >
                      Download CSV
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Chat Button - Fixed bottom right */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition z-40"
        title="Ask AI about this project"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        projectTitle={project.title}
        pdfContent={pdfText}
      />
    </div>
  )
}
