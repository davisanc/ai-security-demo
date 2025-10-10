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
 * Check if the API client is properly configured
 */
export function isAPIConfigured(): boolean {
  const hasEndpoint = process.env.AZURE_FOUNDRY_ENDPOINT && 
    process.env.AZURE_FOUNDRY_ENDPOINT !== 'https://your-resource.openai.azure.com'
  const hasApiKey = process.env.AZURE_FOUNDRY_API_KEY && 
    process.env.AZURE_FOUNDRY_API_KEY !== 'your-api-key-here'
  
  return Boolean(hasEndpoint && hasApiKey)
}

/**
 * Generate a fallback response when no backend is configured
 */
export function generateFallbackResponse(userMessage: string, context?: string): ChatMessage {
  // Analyze the message for common patterns
  const lowerMessage = userMessage.toLowerCase()
  
  // Security-related fallback responses
  if (lowerMessage.includes('confidential') || lowerMessage.includes('password') || 
      lowerMessage.includes('api key') || lowerMessage.includes('secret')) {
    return {
      role: 'assistant',
      content: `🛡️ **Security Alert**

This request contains potentially sensitive information. For demonstration purposes:

**What would happen with a real backend:**
- Microsoft Defender for AI would scan the prompt for sensitive data patterns
- Microsoft Purview would enforce data loss prevention policies
- The system would block or redact sensitive information based on configured rules
- An audit log entry would be created for compliance tracking

**Recommendation:** In a production environment, this type of request would be intercepted and processed according to your organization's security policies.

*Note: This is a demo response. Connect a real Azure Foundry backend to see actual AI-powered security analysis.*`
    }
  }
  
  if (lowerMessage.includes('ignore') || lowerMessage.includes('bypass') || 
      lowerMessage.includes('jailbreak') || lowerMessage.includes('override')) {
    return {
      role: 'assistant',
      content: `🚨 **Threat Detected: Potential Prompt Injection**

This request has been flagged as a potential security threat.

**What would happen with a real backend:**
- Microsoft Defender for AI would analyze the prompt structure for manipulation attempts
- The system would enforce instruction hierarchy to prevent override attempts
- High-risk patterns would be blocked before reaching the model
- Security teams would be alerted to the attempted breach

**Protection Mechanism:**
The AI system maintains strict separation between system instructions and user input to prevent unauthorized behavior modifications.

*Note: This is a demo response. Connect a real Azure Foundry backend for production-grade threat protection.*`
    }
  }
  
  if (lowerMessage.includes('training data') || lowerMessage.includes('system prompt') || 
      lowerMessage.includes('architecture')) {
    return {
      role: 'assistant',
      content: `ℹ️ **Information Disclosure Prevention**

This request seeks system-level information that should be protected.

**What would happen with a real backend:**
- Output filtering would prevent disclosure of training data
- System architecture details would remain confidential
- Microsoft Defender for AI would log the information disclosure attempt
- Response sanitization would ensure no sensitive system details are revealed

**Security Principle:**
AI systems should not reveal internal implementation details, training data sources, or system prompts that could be exploited.

*Note: This is a demo response. Connect a real Azure Foundry backend for comprehensive information protection.*`
    }
  }
  
  // Generic helpful response
  return {
    role: 'assistant',
    content: `👋 **Demo Mode Active**

Thank you for your message. This AI Security demonstration is currently running without a connected backend.

**To see full functionality:**
1. Configure your Azure Foundry API credentials in \`src/lib/api.ts\`
2. Set environment variables for endpoint and API key
3. The system will then provide real-time AI-powered security analysis

**What you're seeing:**
This demo showcases Microsoft's AI security tools including:
- Microsoft Defender for AI (threat detection)
- Microsoft Purview for AI (compliance and data governance)
- Microsoft Entra ID (identity and access management)

**Try example prompts** to see how various security threats would be detected and prevented in a production environment.

*Connect a real backend to experience live AI security capabilities.*`
  }
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
