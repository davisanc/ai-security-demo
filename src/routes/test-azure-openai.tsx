import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { sendChatMessage } from '@/lib/chat-server'
import { isAPIConfigured } from '@/lib/api'

export const Route = createFileRoute('/test-azure-openai')({
  component: TestAzureOpenAI,
})

function TestAzureOpenAI() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const configured = isAPIConfigured()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setResponse('')

    try {
      const result = await sendChatMessage({
        data: {
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: input },
          ],
          temperature: 0.7,
          maxTokens: 500,
        },
      })

      setResponse(result.choices[0].message.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">
          Azure OpenAI Integration Test
        </h1>
        <p className="text-gray-400 mb-8">
          Test your Azure OpenAI configuration
        </p>

        {/* Configuration Status */}
        <div
          className={`mb-6 p-4 rounded-lg border ${
            configured
              ? 'bg-green-900/20 border-green-500'
              : 'bg-yellow-900/20 border-yellow-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                configured ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className="text-white font-medium">
              {configured ? 'Azure OpenAI Configured' : 'Demo Mode Active'}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {configured
              ? 'Your Azure OpenAI credentials are configured and ready to use.'
              : 'Configure your Azure OpenAI credentials in the .env file to enable live API calls. See AZURE_OPENAI_SETUP.md for details.'}
          </p>
        </div>

        {/* Test Form */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="input" className="block text-white font-medium mb-2">
                Your Message
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your message here..."
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : 'Send Message'}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="mt-6">
              <h3 className="text-white font-medium mb-2">Response:</h3>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}
        </div>

        {/* Example Prompts */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-medium mb-4">Example Prompts</h3>
          <div className="space-y-2">
            {[
              'What are the main security risks in AI systems?',
              'Explain prompt injection attacks',
              'How can Microsoft Defender for AI help secure AI applications?',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="w-full text-left px-4 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg border border-gray-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
