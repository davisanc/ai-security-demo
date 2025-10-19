// API integration utilities for Azure OpenAI
import { AzureOpenAI } from 'openai'

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
 * Get environment variable that works in both browser and server
 */
function getEnvVar(name: string): string | undefined {
  // Check if we're in a browser environment with Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteValue = import.meta.env[`VITE_${name}`]
    if (viteValue) return viteValue
  }
  
  // Check if we're in Node.js server environment
  if (typeof process !== 'undefined' && process.env) {
    const nodeValue = process.env[name]
    if (nodeValue) return nodeValue
  }
  
  return undefined
}

/**
 * Get Azure OpenAI configuration from environment variables
 */
function getAzureOpenAIConfig() {
  return {
    endpoint: getEnvVar('AZURE_OPENAI_ENDPOINT'),
    apiKey: getEnvVar('AZURE_OPENAI_API_KEY'),
    deployment: getEnvVar('AZURE_OPENAI_DEPLOYMENT'),
    apiVersion: getEnvVar('AZURE_OPENAI_API_VERSION') || '2024-04-01-preview',
  }
}

/**
 * Create an Azure OpenAI client instance
 */
export function createAzureOpenAIClient(): AzureOpenAI {
  const config = getAzureOpenAIConfig()

  if (!config.endpoint || !config.apiKey || !config.deployment) {
    throw new Error('Azure OpenAI configuration is missing. Please check your .env file.')
  }

  console.log('Creating Azure OpenAI client with config:', {
    endpoint: config.endpoint,
    hasApiKey: !!config.apiKey,
    apiVersion: config.apiVersion,
    deployment: config.deployment
  })

  // AzureOpenAI wrapper needs the deployment for base URL resolution
  return new AzureOpenAI({
    endpoint: config.endpoint,
    apiKey: config.apiKey,
    deployment: config.deployment,
    apiVersion: config.apiVersion,
  })
}

/**
 * Send a chat completion request to Azure OpenAI (via MCP server for security)
 */
export async function createChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  // Direct call to Azure OpenAI only (MCP bypassed for now)
  const client = createAzureOpenAIClient()
  const config = getAzureOpenAIConfig()

  console.log('Calling Azure OpenAI (chat completion)', {
    deployment: config.deployment,
    messageCount: request.messages.length
  })

  try {
    // For AzureOpenAI wrapper the deployment is already configured; no need to pass model.
    const response = await client.chat.completions.create({
      model: config.deployment!,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1024,
      top_p: request.topP ?? 1,
      frequency_penalty: request.frequencyPenalty ?? 0,
      presence_penalty: request.presencePenalty ?? 0,
    })

    return {
      id: response.id,
      created: response.created,
      model: response.model,
      choices: response.choices.map((choice) => ({
        index: choice.index,
        message: {
          role: choice.message.role as 'system' | 'user' | 'assistant',
          content: choice.message.content || '',
        },
        finishReason: choice.finish_reason || '',
      })),
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    }
  } catch (error) {
    console.error('Error calling Azure OpenAI API:', error)
    throw error
  }
}

/**
 * Stream chat completions from Azure OpenAI (via MCP server for security)
 */
export async function* streamChatCompletion(
  request: ChatCompletionRequest
): AsyncGenerator<string, void, unknown> {
  // Direct streaming from Azure OpenAI (MCP bypassed)
  const client = createAzureOpenAIClient()
  const config = getAzureOpenAIConfig()

  console.log('Starting Azure OpenAI stream', { deployment: config.deployment })

  try {
    const stream = await client.chat.completions.create({
      model: config.deployment!,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 512,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  } catch (error) {
    console.error('Error streaming from Azure OpenAI API:', error)
    throw error
  }
}

/**
 * Check if the Azure OpenAI API is properly configured
 */
export function isAPIConfigured(): boolean {
  const config = getAzureOpenAIConfig()
  
  // Check if values are set and not the placeholder defaults
  const hasEndpoint = Boolean(config.endpoint && config.endpoint.trim() !== '')
  const hasApiKey = Boolean(config.apiKey && 
    config.apiKey !== 'your-api-key-here' && 
    config.apiKey.trim() !== '')
  const hasDeployment = Boolean(config.deployment && config.deployment.trim() !== '')
  
  console.log('API Configuration Check:', {
    hasEndpoint,
    hasApiKey: hasApiKey ? 'Present' : 'Missing',
    hasDeployment,
    endpoint: config.endpoint,
    deployment: config.deployment
  })
  
  return hasEndpoint && hasApiKey && hasDeployment
}

/**
 * Generate a fallback response when no backend is configured
 */
export function generateFallbackResponse(userMessage: string, _context?: string): ChatMessage {
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

*Note: This is a demo response. Configure your Azure OpenAI credentials in the .env file to see actual AI-powered security analysis.*`
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

*Note: This is a demo response. Configure your Azure OpenAI credentials in the .env file for production-grade threat protection.*`
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

*Note: This is a demo response. Configure your Azure OpenAI credentials in the .env file for comprehensive information protection.*`
    }
  }
  
  // Generic helpful response
  return {
    role: 'assistant',
    content: `👋 **Demo Mode Active**

Thank you for your message. This AI Security demonstration is currently running without a configured Azure OpenAI backend.

**To enable full functionality:**
1. Copy \`.env.example\` to \`.env\`
2. Fill in your Azure OpenAI credentials:
   - Endpoint (e.g., https://your-resource.cognitiveservices.azure.com/)
   - API Key
   - Deployment name (e.g., gpt-4o-mini)
3. Restart the development server

**What you're seeing:**
This demo showcases Microsoft's AI security tools including:
- Microsoft Defender for AI (threat detection)
- Microsoft Purview for AI (compliance and data governance)
- Microsoft Entra ID (identity and access management)

**Try example prompts** to see how various security threats would be detected and prevented in a production environment.

*Configure Azure OpenAI to experience live AI security capabilities.*`
  }
}
