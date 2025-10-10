// API integration utilities for Azure Foundry and other LLM services
// CUSTOMIZATION POINT: Configure your Azure Foundry API endpoints here

export interface LLMConfig {
  endpoint: string
  apiKey: string
  deploymentName?: string
  apiVersion?: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionRequest {
  messages: Array<ChatMessage>
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface ChatCompletionResponse {
  id: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: ChatMessage
    finishReason: string
  }>
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Azure Foundry API client
 * Configure your endpoint and API key in environment variables or directly here
 */
export class AzureFoundryClient {
  private config: LLMConfig

  constructor(config: LLMConfig) {
    this.config = config
  }

  /**
   * Send a chat completion request to Azure Foundry
   */
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const url = `${this.config.endpoint}/openai/deployments/${this.config.deploymentName}/chat/completions?api-version=${this.config.apiVersion || '2024-08-01-preview'}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 800,
          top_p: request.topP ?? 0.95,
          frequency_penalty: request.frequencyPenalty ?? 0,
          presence_penalty: request.presencePenalty ?? 0,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error calling Azure Foundry API:', error)
      throw error
    }
  }

  /**
   * Stream chat completions (for real-time responses)
   */
  async *streamChatCompletion(
    request: ChatCompletionRequest
  ): AsyncGenerator<string, void, unknown> {
    const url = `${this.config.endpoint}/openai/deployments/${this.config.deploymentName}/chat/completions?api-version=${this.config.apiVersion || '2024-08-01-preview'}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 800,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((line) => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                yield content
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming from Azure Foundry API:', error)
      throw error
    }
  }
}

/**
 * Create a configured Azure Foundry client
 * CUSTOMIZATION POINT: Replace with your actual configuration
 */
export function createAzureFoundryClient(): AzureFoundryClient {
  // Option 1: Use environment variables (recommended for production)
  const config: LLMConfig = {
    endpoint: process.env.AZURE_FOUNDRY_ENDPOINT || 'https://your-resource.openai.azure.com',
    apiKey: process.env.AZURE_FOUNDRY_API_KEY || 'your-api-key-here',
    deploymentName: process.env.AZURE_FOUNDRY_DEPLOYMENT || 'your-deployment-name',
    apiVersion: process.env.AZURE_FOUNDRY_API_VERSION || '2024-08-01-preview',
  }

  // Option 2: Direct configuration (for development/testing)
  // Uncomment and replace with your values:
  /*
  const config: LLMConfig = {
    endpoint: 'https://your-resource.openai.azure.com',
    apiKey: 'your-api-key-here',
    deploymentName: 'gpt-4',
    apiVersion: '2024-08-01-preview',
  }
  */

  return new AzureFoundryClient(config)
}

/**
 * Generic LLM client interface for other providers
 */
export interface GenericLLMClient {
  createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse>
  streamChatCompletion(request: ChatCompletionRequest): AsyncGenerator<string, void, unknown>
}

/**
 * OpenAI-compatible API client (for OpenAI, Azure OpenAI, etc.)
 */
export class OpenAICompatibleClient implements GenericLLMClient {
  private config: LLMConfig & { model?: string }

  constructor(config: LLMConfig & { model?: string }) {
    this.config = config
  }

  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    try {
      const response = await fetch(`${this.config.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 800,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error calling OpenAI-compatible API:', error)
      throw error
    }
  }

  async *streamChatCompletion(
    request: ChatCompletionRequest
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${this.config.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 800,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((line) => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                yield content
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming from OpenAI-compatible API:', error)
      throw error
    }
  }
}
