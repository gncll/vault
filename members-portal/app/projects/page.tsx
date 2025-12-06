import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Header from '@/app/components/Header'
import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getProjects } from '@/lib/github'

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-white">
        <Header showNav>
          <UserButton afterSignOutUrl="/" />
        </Header>

        <main className="max-w-6xl mx-auto px-6">
          <div className="py-16 border-b border-gray-200">
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-900 transition mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="font-serif text-4xl text-gray-900 mb-3">Project Archives</h1>
            <p className="text-sm text-gray-600">
              Detailed guides for hands-on engineering projects
            </p>
          </div>

          {/* Projects List */}
          <div className="py-12 space-y-1">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block border border-gray-200 p-8 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-serif text-2xl text-gray-900">{project.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 font-mono">
                        {project.category}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 font-mono">
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition ml-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info Box */}
          <div className="pb-20">
            <div className="border border-gray-200 p-8 bg-gray-50">
              <h3 className="font-mono text-xs text-gray-500 mb-4 uppercase tracking-wider">About Project Guides</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Comprehensive PDF documentation for each project</p>
                <p>• Step-by-step implementation guides</p>
                <p>• Download for offline access</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SubscriptionCheck>
  )
}
