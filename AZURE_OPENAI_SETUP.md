# Azure OpenAI Integration Guide

This guide explains how to configure and use Azure OpenAI with this application.

## Prerequisites

- An Azure subscription
- An Azure OpenAI resource created in Azure Portal
- A deployed model (e.g., gpt-4o-mini)

## Configuration Steps

### 1. Get Your Azure OpenAI Credentials

From the Azure Portal:
1. Navigate to your Azure OpenAI resource
2. Go to "Keys and Endpoint" section
3. Copy the following information:
   - **Endpoint**: Your resource endpoint (e.g., `https://your-resource.cognitiveservices.azure.com/`)
   - **API Key**: One of the two keys provided (Key 1 or Key 2)
   - **Deployment Name**: The name you gave to your deployed model
   - **Model Name**: The base model name (e.g., `gpt-4o-mini`, `gpt-4`, `gpt-35-turbo`)

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your credentials:
   ```env
   VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
   VITE_AZURE_OPENAI_API_KEY=your-actual-api-key-here
   VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
   VITE_AZURE_OPENAI_MODEL=gpt-4o-mini
   VITE_AZURE_OPENAI_API_VERSION=2024-04-01-preview
   ```

3. **Important**: Never commit your `.env` file to version control. It's already listed in `.gitignore`.

### 3. Restart the Development Server

After configuring the environment variables, restart your development server:

```bash
npm run dev
```

## Usage in Your Application

### Using the Server Function (Recommended)

The application provides a secure server function that keeps your API keys on the server side:

```typescript
import { sendChatMessage } from '~/lib/chat-server'

// In your component
const handleChat = async () => {
  try {
    const response = await sendChatMessage({
      data: {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello!' }
        ],
        temperature: 0.7,
        maxTokens: 4096,
      }
    })
    
    console.log(response.choices[0].message.content)
  } catch (error) {
    console.error('Chat error:', error)
  }
}
```

### Direct API Usage (Client-side - Not Recommended for Production)

For testing or specific use cases, you can also use the API client directly:

```typescript
import { createChatCompletion } from '~/lib/api'

const response = await createChatCompletion({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ],
  temperature: 0.7,
  maxTokens: 4096,
})
```

**Note**: This exposes your API credentials to the client. Use the server function approach for production applications.

## API Reference

### Server Function: `sendChatMessage`

```typescript
interface ChatRequest {
  messages: ChatMessage[]
  temperature?: number      // Default: 0.7
  maxTokens?: number       // Default: 4096
  topP?: number            // Default: 1
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
```

### Response Format

```typescript
interface ChatCompletionResponse {
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
```

## Demo Mode

If the Azure OpenAI API is not configured, the application automatically falls back to demo mode with simulated responses. This allows you to:
- Test the UI without API credentials
- Demonstrate security concepts without live API calls
- Run the application in environments where API access is not available

To check if the API is configured:

```typescript
import { isAPIConfigured } from '~/lib/api'

if (isAPIConfigured()) {
  // Use real API
} else {
  // Use demo mode
}
```

## Streaming Support

For real-time responses, use the streaming function:

```typescript
import { streamChatCompletion } from '~/lib/api'

const stream = streamChatCompletion({
  messages: [
    { role: 'user', content: 'Tell me a story' }
  ],
})

for await (const chunk of stream) {
  console.log(chunk) // Each token as it arrives
}
```

## Troubleshooting

### "Configuration is missing" Error

- Verify your `.env` file exists and has correct values
- Restart the development server after changing `.env`
- Check that variable names start with `VITE_` prefix (required by Vite)

### API Call Failures

- Verify your API key is valid and not expired
- Check that your deployment name matches exactly
- Ensure your Azure OpenAI resource is active
- Verify your endpoint URL is correct (should end with `/`)

### CORS Errors

- Azure OpenAI endpoints should handle CORS automatically
- If issues persist, check your Azure OpenAI resource CORS settings

## Security Best Practices

1. **Never commit API keys**: Always use environment variables
2. **Use server functions**: Keep API keys on the server side
3. **Rotate keys regularly**: Use Azure Portal to regenerate keys periodically
4. **Monitor usage**: Set up Azure Monitor alerts for unusual activity
5. **Use managed identities**: For production, consider using Azure Managed Identities instead of API keys

## Example Integration in Existing Routes

To integrate Azure OpenAI into your existing routes (e.g., `data-security.tsx`):

```typescript
import { sendChatMessage } from '~/lib/chat-server'

const handleSendMessage = async () => {
  try {
    const response = await sendChatMessage({
      data: {
        messages: [
          { 
            role: 'system', 
            content: 'You are a security assistant analyzing potential threats in AI systems.' 
          },
          { role: 'user', content: inputValue }
        ],
      }
    })
    
    const aiMessage = response.choices[0].message
    setMessages([...messages, userMessage, aiMessage])
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## Additional Resources

- [Azure OpenAI Service Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

For issues specific to this application, refer to the inline code comments or the main README.md file.
