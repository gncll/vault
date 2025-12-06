'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const projects: { [key: string]: { title: string; pdfUrl: string } } = {
  '1': {
    title: 'AI-Powered Web Scraper',
    pdfUrl: '/pdfs/web-scraper-project.pdf'
  },
  '2': {
    title: 'Sentiment Analysis Dashboard',
    pdfUrl: '/pdfs/sentiment-analysis.pdf'
  },
  '3': {
    title: 'Chatbot with RAG',
    pdfUrl: '/pdfs/rag-chatbot.pdf'
  }
}

export default function ProjectViewerPage({ params }: { params: { id: string } }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)

  const project = projects[params.id]

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link href="/projects" className="text-indigo-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center mb-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-600">LearnAI</span>
                <span className="text-sm text-gray-500">Premium</span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/projects" className="text-gray-600 hover:text-indigo-600 font-medium">
                  ← Back to Projects
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>

            {/* PDF Controls */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <h2 className="font-semibold text-gray-900">{project.title}</h2>
              <div className="flex items-center gap-4">
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-sm text-gray-600 min-w-[50px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale(Math.min(2, scale + 0.1))}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                    disabled={pageNumber <= 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 min-w-[80px] text-center">
                    Page {pageNumber} of {numPages || '...'}
                  </span>
                  <button
                    onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                    disabled={pageNumber >= numPages}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* Download Button */}
                <a
                  href={project.pdfUrl}
                  download
                  className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* PDF Viewer */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 flex justify-center">
            <Document
              file={project.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              }
              error={
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Failed to load PDF</p>
                  <p className="text-sm text-gray-600">
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
    </SubscriptionCheck>
  )
}
