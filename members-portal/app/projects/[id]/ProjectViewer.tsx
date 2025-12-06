'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import Header from '@/app/components/Header'

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
        {viewMode === 'notebook' && (
          <div className="border border-gray-200 p-8 bg-white">
            <h3 className="font-serif text-2xl text-gray-900 mb-6">Jupyter Notebook</h3>
            <p className="text-sm text-gray-600 mb-8">
              Download the Jupyter notebook file to run it locally or view it in your preferred notebook environment.
            </p>
            <div className="border border-gray-200 p-6 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Solution Notebook</h4>
                  <p className="text-xs text-gray-500 font-mono">Solution.ipynb</p>
                </div>
                <a
                  href={project.solutionNotebook}
                  download
                  className="border border-gray-900 text-gray-900 px-6 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
                >
                  Download Notebook
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Data Files Download Section */}
        {viewMode === 'data' && (
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
    </div>
  )
}
