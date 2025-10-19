import { createServerFn } from '@tanstack/react-start'

/**
 * Debug server function to echo back the raw input
 * This helps diagnose payload shape issues
 */
export const debugEcho = createServerFn({ method: 'POST' })
  .handler(async ({ context }) => {
    // Log the entire context to see what TanStack passes
    console.log('=== DEBUG ECHO - Full context ===')
    console.log('context keys:', Object.keys(context || {}))
    console.log('context:', JSON.stringify(context, null, 2))
    
    // Also check request details
    const req = (context as any)?.request
    if (req) {
      console.log('request.method:', req.method)
      console.log('request.url:', req.url)
      console.log('request.headers:', Array.from(req.headers?.entries?.() || []))
      
      // Try to read body if available
      try {
        const clonedReq = req.clone ? req.clone() : req
        const body = await clonedReq.text()
        console.log('request.body (text):', body)
        try {
          const json = JSON.parse(body)
          console.log('request.body (parsed):', JSON.stringify(json, null, 2))
        } catch (e) {
          console.log('Body is not JSON')
        }
      } catch (e) {
        console.log('Could not read body:', e)
      }
    }
    
    return {
      message: 'Debug echo complete - check server logs',
      timestamp: Date.now()
    }
  })
