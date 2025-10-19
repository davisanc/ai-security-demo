import { createFileRoute } from '@tanstack/react-router'
import { debugEcho } from '@/lib/debug-server'
import { useState } from 'react'

export const Route = createFileRoute('/debug')({
  component: DebugPage,
})

function DebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEcho = async () => {
    setLoading(true)
    try {
      const res = await debugEcho({
        data: {
          messages: [
            { role: 'user', content: 'test message' }
          ],
          temperature: 0.7
        }
      } as any)
      setResult(res)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Debug Server Function</h1>
        <p className="text-gray-400 mb-8">
          This page calls a debug endpoint to inspect what payload shape TanStack passes to server functions.
        </p>

        <button
          onClick={testEcho}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {loading ? 'Calling...' : 'Test Echo (check server logs)'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Result:</h2>
            <pre className="text-green-400 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            <p className="text-yellow-400 mt-4 text-sm">
              ⚠️ Check container logs for detailed output: az containerapp logs show --name ai-security-web --resource-group ai-security-rg --tail 100
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
