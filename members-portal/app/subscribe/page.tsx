import Image from 'next/image'
import Link from 'next/link'

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* About Section - God of Prompt Style */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-200/50 rounded-3xl p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-2">
                Hey, I'm Gencay.
              </h1>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                Founder of LearnAIWithMe
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Photo */}
              <div className="flex justify-center md:justify-start">
                <Image
                  src="/me.png"
                  alt="Gencay"
                  width={220}
                  height={220}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              </div>

              {/* Story - Column 1 */}
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  I discovered ChatGPT's transformative potential a couple of years ago
                  and have since built 60+ AI agents. My work demonstrates extensive
                  hands-on experience with practical AI implementation.
                </p>
                <p>
                  That's why I created LearnAIWithMe—to share my journey and the
                  lessons I've learned.
                </p>
                <p>
                  I used to be an engineer struggling to keep up with the rapid pace
                  of AI development. But when ChatGPT arrived, it opened up a whole
                  new world for me.
                </p>
              </div>

              {/* Story - Column 2 */}
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  My goal is to empower everyone, no matter the technical skill, to
                  harness the full power of AI and achieve their dreams.
                </p>
                <p>
                  Join me on this exciting adventure as we explore the world of prompt
                  engineering and unlock AI's full potential together!
                </p>
                <p className="pt-4">
                  With gratitude,
                </p>
                <p className="font-bold text-gray-900">
                  Gencay from LearnAIWithMe
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-300">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">60+</div>
                <div className="text-sm text-gray-600">AI Agents Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">6,000+</div>
                <div className="text-sm text-gray-600">Hours Teaching AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Build AI That Ships?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to get access to 640+ prompts, AI tools, projects, and weekly updates.
            Not theory. Practical, working AI systems.
          </p>
          <a
            href="https://gencay.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-yellow-400 text-gray-900 font-bold text-lg rounded-full hover:bg-yellow-300 transition shadow-lg"
          >
            Subscribe on Substack
          </a>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            What You'll Get Access To
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Lab */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🧪</span> The Lab
              </h4>
              <p className="text-gray-600 mb-4">
                Practical, working AI systems—not theory. Real projects you can use immediately.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Claude Code projects for data analysis and app building
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  n8n automation and AI agent construction
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  NotebookLM and Gemini integrations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  ChatGPT advanced techniques
                </li>
              </ul>
            </div>

            {/* The Vault */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔐</span> The Vault
              </h4>
              <p className="text-gray-600 mb-4">
                Your toolkit for AI productivity. Updated weekly with new resources.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  640+ Prompt Library with optimizer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Infographic Studio for visual content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  AI Humanizer tool
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Custom GPTs and Projects
                </li>
              </ul>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-6">
              For people who want to build AI tools that actually get used.
            </p>
            <a
              href="https://gencay.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Join the Community
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 font-mono">
            © 2024 LearnAIWithMe. Reserved for members only.
          </p>
        </div>
      </footer>
    </div>
  )
}
