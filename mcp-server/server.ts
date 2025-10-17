import express from 'express'
import cors from 'cors'
import { AzureOpenAI } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// Enable CORS for your Static Web App
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}))

app.use(express.json())

// Initialize Azure OpenAI client
const openai = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview'
})

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    name: 'MCP Server - AI Security Gateway',
    version: '1.0.0',
    status: 'running',
    description: 'Secure AI inference gateway with content safety and threat detection',
    endpoints: {
      health: 'GET /health - Health check',
      chat: 'POST /api/chat - Secure chat completions with Azure OpenAI'
    },
    features: [
      'Content Safety Analysis',
      'Threat Detection (Prompt Injection, Jailbreak)',
      'Azure OpenAI Integration',
      'CORS Protection'
    ],
    timestamp: new Date().toISOString()
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Content Safety Analysis (simulated - integrate with Azure Content Safety in production)
function analyzeContentSafety(content: string) {
  const lowerContent = content.toLowerCase()
  const risks = []
  
  if (lowerContent.includes('hack') || lowerContent.includes('exploit')) {
    risks.push('Security Threat')
  }
  if (lowerContent.includes('bypass') || lowerContent.includes('ignore')) {
    risks.push('Prompt Injection')
  }
  
  return {
    isSafe: risks.length === 0,
    categories: risks,
    severity: risks.length > 0 ? 'HIGH' : 'NONE'
  }
}

// Threat Detection
function detectThreats(content: string) {
  const lowerContent = content.toLowerCase()
  const threats = []
  
  const threatPatterns = [
    { pattern: /ignore (previous|all) (instructions|prompts)/i, threat: 'Prompt Injection Attempt' },
    { pattern: /jailbreak/i, threat: 'Jailbreak Attempt' },
    { pattern: /system prompt/i, threat: 'System Prompt Extraction' },
  ]
  
  threatPatterns.forEach(({ pattern, threat }) => {
    if (pattern.test(content)) {
      threats.push(threat)
    }
  })
  
  return {
    detected: threats.length > 0,
    threats,
    confidence: threats.length > 0 ? 0.85 : 0.0
  }
}

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request:', {
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
      hasMessages: !!req.body?.messages
    })

    const { messages, temperature = 0.7, maxTokens = 500, enableContentSafety = true, enableThreatDetection = true } = req.body

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid request: messages array missing')
      return res.status(400).json({ error: 'Invalid request: messages array required' })
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || ''

    // Perform security checks
    let safetyAnalysis = null
    let threatDetection = null

    if (enableContentSafety) {
      safetyAnalysis = analyzeContentSafety(lastUserMessage)
      
      if (!safetyAnalysis.isSafe) {
        return res.status(400).json({
          error: 'Content safety violation',
          safetyAnalysis
        })
      }
    }

    if (enableThreatDetection) {
      threatDetection = detectThreats(lastUserMessage)
      
      if (threatDetection.detected) {
        return res.json({
          content: `🚨 **Threat Detected**: ${threatDetection.threats.join(', ')}\n\nThis request has been flagged as a potential security threat and blocked by Microsoft Defender for AI.`,
          safetyAnalysis,
          threatDetection
        })
      }
    }

    // Call Azure OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT!,
      messages: messages,
      temperature,
      max_tokens: maxTokens
    })

    // Return in OpenAI-compatible format
    res.json({
      id: completion.id,
      created: completion.created,
      model: completion.model,
      choices: completion.choices.map((choice) => ({
        index: choice.index,
        message: {
          role: choice.message.role,
          content: choice.message.content || '',
        },
        finishReason: choice.finish_reason || '',
      })),
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      } : undefined,
      // Additional security metadata
      _security: {
        safetyAnalysis,
        threatDetection
      }
    })

  } catch (error) {
    console.error('Error calling Azure OpenAI:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  })
})

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`CORS allowed origins: ${process.env.ALLOWED_ORIGINS || 'http://localhost:3000'}`)
})
