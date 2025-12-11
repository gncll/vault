import { getNews } from '@/lib/github'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 300 // Cache for 5 minutes

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="LearnAIWithMe"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <div className="font-serif text-xl text-gray-900">LearnAIWithMe</div>
                <div className="text-xs text-gray-500 font-mono tracking-wider">THE VAULT</div>
              </div>
            </Link>
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6">
          {/* Subscribe Section */}
          <div className="py-20 text-center border-b border-gray-200">
            <h1 className="font-serif text-5xl text-gray-900 mb-4">Subscribe to See AI News</h1>
            <p className="text-xl text-gray-600 mb-12">
              Get access to exclusive AI news, insights, and resources
            </p>

            <div className="flex justify-center mb-8">
              <iframe
                src="https://www.learnwithmeai.com/embed"
                width="480"
                height="320"
                style={{ border: '1px solid #EEE', background: 'white' }}
                scrolling="no"
                title="Subscribe to LearnAIWithMe"
              />
            </div>
          </div>

          {/* 4-Column Grid */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item: any) => (
              <Link
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <article className="border border-gray-200 hover:bg-gray-50 transition-colors overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-video relative bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={item.image.includes('placeholder')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=AI+News'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="font-serif text-lg text-gray-900 mb-2 group-hover:text-gray-600 transition line-clamp-3">
                      {item.title}
                    </h2>
                    <div className="text-xs text-gray-400 font-mono">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {news.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-3xl mb-4">📰</div>
              <h2 className="font-serif text-2xl text-gray-900 mb-2">No News Yet</h2>
              <p className="text-sm text-gray-600">Check back soon for the latest AI updates</p>
            </div>
          )}
        </main>
      </div>
  )
}
