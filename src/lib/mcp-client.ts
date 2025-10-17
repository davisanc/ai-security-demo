// MCP Server client for secure AI interactions
import type { ChatCompletionRequest, ChatCompletionResponse } from './api'

// Support both build-time (browser) and runtime (server) environment variables
const MCP_SERVER_ENDPOINT = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_MCP_SERVER_ENDPOINT 
  : (typeof process !== 'undefined' && process.env ? process.env.MCP_SERVER_ENDPOINT : undefined)

const MCP_API_KEY = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_MCP_API_KEY
  : (typeof process !== 'undefined' && process.env ? process.env.MCP_API_KEY : undefined)

/**
 * Check if MCP server is configured
 */
export function isMCPConfigured(): boolean {
  return Boolean(MCP_SERVER_ENDPOINT)
}

/**
 * Send a chat completion request to the MCP server
 */
export async function createMCPChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  if (!MCP_SERVER_ENDPOINT) {
    throw new Error('MCP server is not configured')
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Add API key if available
    if (MCP_API_KEY) {
      headers['Authorization'] = `Bearer ${MCP_API_KEY}`
    }

    console.log('Calling MCP server:', {
      endpoint: MCP_SERVER_ENDPOINT,
      hasApiKey: !!MCP_API_KEY,
      messageCount: request.messages.length
    })

    const response = await fetch(`${MCP_SERVER_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        top_p: request.topP,
        frequency_penalty: request.frequencyPenalty,
        presence_penalty: request.presencePenalty,
      }),
    })

    console.log('MCP server response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('MCP server error response:', errorText)
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText }
      }
      throw new Error(`MCP server error: ${response.status} - ${errorData.error || errorText || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log('MCP server success:', { hasChoices: !!data.choices })
    return data
  } catch (error) {
    console.error('Error calling MCP server:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      endpoint: MCP_SERVER_ENDPOINT
    })
    throw error
  }
}

/**
 * Stream chat completions from the MCP server (for real-time responses)
 */
export async function* streamMCPChatCompletion(
  request: ChatCompletionRequest
): AsyncGenerator<string, void, unknown> {
  if (!MCP_SERVER_ENDPOINT) {
    throw new Error('MCP server is not configured')
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Add API key if available
    if (MCP_API_KEY) {
      headers['Authorization'] = `Bearer ${MCP_API_KEY}`
    }

    const response = await fetch(`${MCP_SERVER_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`MCP server error: ${response.status} - ${errorData.error || 'Unknown error'}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              yield content
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error('Error streaming from MCP server:', error)
    throw error
  }
}
