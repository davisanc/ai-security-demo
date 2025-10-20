import { createServerFn } from '@tanstack/react-start'
import { createChatCompletion, isAPIConfigured, generateFallbackResponse, type ChatMessage } from './api'
// import { isMCPConfigured, createMCPChatCompletion } from './mcp-client' // Disabled for now - testing direct connection

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
export const sendChatMessage = createServerFn({
  method: 'POST',
}).handler(async function(ctx: any) {
    try {
      console.log('=== FULL CTX DUMP ===')
      console.log('ctx keys:', Object.keys(ctx || {}))
      console.log('ctx.context:', JSON.stringify(ctx.context)?.slice(0, 300))
      console.log('ctx.sendContext:', JSON.stringify(ctx.sendContext)?.slice(0, 300))
      console.log('ctx.headers:', JSON.stringify(ctx.headers)?.slice(0, 300))
      
      // Check if data was already parsed and stored somewhere
      let data: ChatRequest | null = null
      
      // Try every possible location
      if (ctx.data) {
        console.log('Found data in ctx.data')
        data = ctx.data
      } else if (ctx.body) {
        console.log('Found data in ctx.body')
        data = ctx.body
      } else if (ctx.payload) {
        console.log('Found data in ctx.payload')
        data = ctx.payload
      } else if (ctx.input) {
        console.log('Found data in ctx.input')
        data = ctx.input
      } else if (ctx.context?.data) {
        console.log('Found data in ctx.context.data')
        data = ctx.context.data
      } else if (ctx.sendContext?.data) {
        console.log('Found data in ctx.sendContext.data')
        data = ctx.sendContext.data
      } else {
        console.log('Data not found in any expected location - dumping full ctx')
        console.log(JSON.stringify(ctx, null, 2)?.slice(0, 1000))
        throw new Error('Cannot find request data in context')
      }
      
      console.log('Using data from:', { hasMessages: !!data?.messages, messageCount: data?.messages?.length })
      
      if (!data) {
        throw new Error('Data is null after checking all locations')
      }
      
      const { messages, temperature, maxTokens, topP } = data

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error('Invalid or empty messages array:', { messages, dataKeys: Object.keys(data || {}) })
        return {
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Input validation failed: messages array is empty or missing.'
              },
              finishReason: 'stop'
            }
          ],
          id: 'validation-' + Date.now(),
          created: Date.now(),
          model: 'validation'
        }
      }

      console.log('Chat server function called', {
        messageCount: messages.length,
        isAPIConfigured: isAPIConfigured(),
        azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT || 'not set',
        azureDeployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'not set',
        hasApiKey: !!process.env.AZURE_OPENAI_API_KEY
      })

      // Skip MCP server for now - connect directly to Azure OpenAI
      // TODO: Re-enable MCP server once direct connection is working
      // if (isMCPConfigured()) {
      //   try {
      //     console.log('Attempting MCP server call')
      //     const response = await createMCPChatCompletion({
      //       messages,
      //       temperature: temperature ?? 0.7,
      //       maxTokens: maxTokens ?? 4096,
      //       topP: topP ?? 1,
      //     })
      //     console.log('MCP server call successful', { response })
      //     return response
      //   } catch (mcpError) {
      //     console.error('MCP server call failed:', mcpError)
      //     console.error('MCP error details:', {
      //       message: mcpError instanceof Error ? mcpError.message : 'Unknown',
      //       stack: mcpError instanceof Error ? mcpError.stack : undefined,
      //       error: mcpError
      //     })
      //     // Fall through to direct API call
      //   }
      // }

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
