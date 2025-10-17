// MCP Server client for secure AI interactions
import type { ChatCompletionRequest, ChatCompletionResponse } from './api'

const MCP_SERVER_ENDPOINT = import.meta.env.VITE_MCP_SERVER_ENDPOINT
const MCP_API_KEY = import.meta.env.VITE_MCP_API_KEY

/**
 * Check if MCP server is configured
 */
export function isMCPConfigured(): boolean {
  return Boolean(MCP_SERVER_ENDPOINT && MCP_API_KEY)
}

/**
 * Send a chat completion request to the MCP server
 */
export async function createMCPChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  if (!MCP_SERVER_ENDPOINT || !MCP_API_KEY) {
    throw new Error('MCP server is not configured')
  }

  try {
    const response = await fetch(`${MCP_SERVER_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MCP_API_KEY}`,
      },
      body: JSON.stringify({
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        top_p: request.topP,
        frequency_penalty: request.frequencyPenalty,
        presence_penalty: request.presencePenalty,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`MCP server error: ${response.status} - ${errorData.error || 'Unknown error'}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error calling MCP server:', error)
    throw error
  }
}

/**
 * Stream chat completions from the MCP server (for real-time responses)
 */
export async function* streamMCPChatCompletion(
  request: ChatCompletionRequest
): AsyncGenerator<string, void, unknown> {
  if (!MCP_SERVER_ENDPOINT || !MCP_API_KEY) {
    throw new Error('MCP server is not configured')
  }

  try {
    const response = await fetch(`${MCP_SERVER_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MCP_API_KEY}`,
      },
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
