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
  pdfUrl: string
  description?: string
  category?: string
  difficulty?: string
}

export default function ProjectViewer({ project }: { project: Project | null }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)

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

  return (
    <div className="min-h-screen bg-white">
      <Header showNav>
        <UserButton afterSignOutUrl="/" />
      </Header>

      {/* PDF Controls */}
      <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Link href="/projects" className="text-xs text-gray-500 hover:text-gray-900 transition inline-block mb-2">
                ← Back to Projects
              </Link>
              <h2 className="font-serif text-xl text-gray-900">{project.title}</h2>
            </div>
            <a
              href={project.pdfUrl}
              download
              className="border border-gray-900 text-gray-900 px-4 py-2 text-sm hover:bg-gray-900 hover:text-white transition"
            >
              Download PDF
            </a>
          </div>

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
        </div>
      </div>

      {/* PDF Viewer */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="border border-gray-200 p-8 flex justify-center bg-gray-50">
          <Document
            file={project.pdfUrl}
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
                  The PDF file might not exist yet. Please add your PDF files to the /public/pdfs directory.
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
      </main>
    </div>
  )
}
