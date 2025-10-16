// Production server entry point for TanStack Start
import { createServer } from 'node:http'
import serverModule from './dist/server/server.js'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

const server = createServer(async (req, res) => {
  try {
    // Create a Request object from the incoming request
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    const request = new Request(url, {
      method: req.method,
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : value || '',
        ])
      ),
    })

    // Call the TanStack Start server
    const response = await serverModule.fetch(request)

    // Send the response back
    res.statusCode = response.status
    
    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    // Stream the body
    if (response.body) {
      const reader = response.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    
    res.end()
  } catch (error) {
    console.error('Server error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Internal Server Error')
  }
})

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`)
})
