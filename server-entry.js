// Production server entry point for TanStack Start
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import serverModule from './dist/server/server.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    
    // Try to serve static files from dist/client/assets first
    if (url.pathname.startsWith('/assets/')) {
      try {
        const filePath = join(__dirname, 'dist', 'client', url.pathname)
        const content = await readFile(filePath)
        const ext = extname(filePath)
        const mimeType = mimeTypes[ext] || 'application/octet-stream'
        
        res.writeHead(200, {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        })
        res.end(content)
        return
      } catch (err) {
        // File not found, continue to SSR
        console.log('Static file not found:', url.pathname)
      }
    }

    // Create a Request object from the incoming request
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
