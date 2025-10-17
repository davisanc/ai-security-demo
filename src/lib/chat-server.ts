import { createServerFn } from '@tanstack/react-start'
import { createChatCompletion, isAPIConfigured, generateFallbackResponse, type ChatMessage } from './api'
import { isMCPConfigured, createMCPChatCompletion } from './mcp-client'

export interface ChatRequest {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  topP?: number
}

/**
 * Server function to handle chat completion requests
 * This runs on the server side, keeping API keys secure
 */
export const sendChatMessage = createServerFn({ method: 'POST' })
  .inputValidator((data: ChatRequest) => data)
  .handler(async ({ data }) => {
    try {
      const { messages, temperature, maxTokens, topP } = data

      console.log('Chat server function called', {
        messageCount: messages.length,
        isMCPConfigured: isMCPConfigured(),
        mcpEndpoint: process.env.MCP_SERVER_ENDPOINT || 'not set',
        viteEndpoint: process.env.VITE_MCP_SERVER_ENDPOINT || 'not set (should be runtime only)',
        isAPIConfigured: isAPIConfigured()
      })

      // Try MCP server first (works from both client and server)
      if (isMCPConfigured()) {
        try {
          console.log('Attempting MCP server call')
          const response = await createMCPChatCompletion({
            messages,
            temperature: temperature ?? 0.7,
            maxTokens: maxTokens ?? 4096,
            topP: topP ?? 1,
          })
          console.log('MCP server call successful')
          return response
        } catch (mcpError) {
          console.error('MCP server call failed:', mcpError)
          console.error('MCP error details:', {
            message: mcpError instanceof Error ? mcpError.message : 'Unknown',
            stack: mcpError instanceof Error ? mcpError.stack : undefined
          })
          // Fall through to direct API call
        }
      }

      // Check if API is configured
      if (!isAPIConfigured()) {
        // Return fallback response if API is not configured
        const lastUserMessage = messages.filter(m => m.role === 'user').pop()
        const fallbackMessage = generateFallbackResponse(
          lastUserMessage?.content || 'Hello'
        )
        
        return {
          choices: [
            {
              index: 0,
              message: fallbackMessage,
              finishReason: 'stop',
            },
          ],
          id: 'demo-' + Date.now(),
          created: Date.now(),
          model: 'demo-mode',
        }
      }

      // Call Azure OpenAI API directly (server-side only)
      const response = await createChatCompletion({
        messages,
        temperature: temperature ?? 0.7,
        maxTokens: maxTokens ?? 4096,
        topP: topP ?? 1,
      })

      return response
    } catch (error) {
      console.error('Error in chat server function:', error)
      
      // Log detailed error information
      if (error && typeof error === 'object') {
        const azureError = error as any
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown',
          code: azureError.code,
          status: azureError.status,
        })
      }
      
      throw new Error(
        `Failed to process chat request: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  })
