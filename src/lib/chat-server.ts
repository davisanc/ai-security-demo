import { createServerFn } from '@tanstack/react-start'
import { createChatCompletion, isAPIConfigured, generateFallbackResponse, type ChatMessage } from './api'

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

      // Call Azure OpenAI API
      const response = await createChatCompletion({
        messages,
        temperature: temperature ?? 0.7,
        maxTokens: maxTokens ?? 4096,
        topP: topP ?? 1,
      })

      return response
    } catch (error) {
      console.error('Error in chat server function:', error)
      
      // Log detailed Azure Content Safety information if available
      if (error && typeof error === 'object') {
        const azureError = error as any
        if (azureError.code === 'content_filter' || azureError.error?.code === 'content_filter') {
          console.log('Azure Content Safety Details:', {
            requestId: azureError.headers?.get?.('apim-request-id'),
            code: azureError.code,
            innerCode: azureError.error?.innererror?.code,
            deployment: azureError.headers?.get?.('x-ms-deployment-name'),
            region: azureError.headers?.get?.('x-ms-region'),
            raiInvoked: azureError.headers?.get?.('x-ms-rai-invoked'),
          })
        }
      }
      
      throw new Error(
        `Failed to process chat request: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  })
