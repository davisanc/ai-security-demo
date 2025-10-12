import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Database, Send, Shield } from 'lucide-react'
import { useState } from 'react'
import { AnimatedTwoPane } from '@/components/AnimatedTwoPane'
import { generateFallbackResponse, isAPIConfigured } from '@/lib/api'
import { sendChatMessage } from '@/lib/chat-server'
import { 
  detectContentSafetyError, 
  formatContentSafetyMessage,
  type ContentSafetyError 
} from '@/lib/content-safety'

export const Route = createFileRoute('/data-security')({
  component: DataSecurityPage,
})

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ThreatExample {
  id: string
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  examplePrompt: string
  explanation: string
  defenderScreenshotUrl?: string
  purviewScreenshotUrl?: string
  entraScreenshotUrl?: string
}

const threatExamples: ThreatExample[] = [
  {
    id: 'confidential-file-upload',
    title: 'Confidential File Upload',
    description: 'Uploading files with confidentiality labels to AI systems',
    severity: 'high',
    examplePrompt: 'Upload Q4_Financial_Report_CONFIDENTIAL.pdf and analyze the data',
    explanation: `When users upload documents with confidentiality labels to AI systems, there's a risk of data leakage if proper controls aren't enforced.

**Key Risks:**
• Confidential documents processed without authorization
• Sensitive labels ignored by AI processing
• Cross-contamination between classification levels
• Unauthorized distribution of classified information

**Microsoft Purview for AI Protection:**
• Automatic sensitivity label detection
• Policy enforcement based on classification
• Blocking or redacting sensitive content
• Compliance reporting and auditing`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
  {
    id: 'pii-entry',
    title: 'PII Data Entry',
    description: 'Entering personally identifiable information into AI prompts',
    severity: 'high',
    examplePrompt: 'Analyze this customer record: John Smith, SSN: 123-45-6789, DOB: 01/15/1980',
    explanation: `Users may inadvertently enter PII into AI systems, creating data leakage risks and compliance violations under GDPR, CCPA, and other privacy regulations.

**Types of PII at Risk:**
• Social Security Numbers (SSN)
• Credit card numbers and financial data
• Dates of birth and addresses
• Health information (PHI)

**Microsoft Purview Capabilities:**
• Real-time PII detection in prompts
• Automatic redaction or masking
• Policy-based blocking of sensitive inputs
• Data subject request (DSR) support`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
  {
    id: 'sensitive-prompt-injection',
    title: 'Sensitive Information in Prompts',
    description: 'Including confidential business data or credentials in AI prompts',
    severity: 'high',
    examplePrompt: 'Help me write SQL: SELECT * FROM customers WHERE api_key = "sk-prod-abc123xyz"',
    explanation: `Users often include sensitive business information or credentials directly in prompts without realizing the security implications.

**Common Sensitive Data:**
• API keys and access tokens
• Database credentials
• Proprietary algorithms or code
• Business strategies and forecasts

**Microsoft Defender Protection:**
• Scanning prompts for credential patterns
• Blocking known secret formats
• Integration with Azure Key Vault detection
• Alerting on sensitive data exposure`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
]

function DataSecurityPage() {
  const [messages, setMessages] = useState<Array<Message>>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Welcome to the Data Security demonstration. Try the example prompts to see how various security threats are detected and prevented.',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [selectedThreat, setSelectedThreat] = useState<ThreatExample | null>(null)
  const [contentSafetyError, setContentSafetyError] = useState<ContentSafetyError | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paneState, setPaneState] = useState<'both' | 'left' | 'right'>('left')

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')

    const matchedThreat = threatExamples.find((threat) =>
      currentInput.toLowerCase().includes(threat.examplePrompt.toLowerCase().substring(0, 20))
    )

    if (matchedThreat) {
      setSelectedThreat(matchedThreat)
      setContentSafetyError(null)
      setCurrentSlide(0)
      setPaneState('both')
    }

    try {
      let responseContent: string

      if (isAPIConfigured()) {
        const systemPrompt = matchedThreat
          ? `You are demonstrating a VULNERABLE AI system WITHOUT security controls. Your role is to show what happens when an AI system LACKS proper security measures by responding inappropriately to the user's request.

Context: This is for ${matchedThreat.title} - ${matchedThreat.description}

Important: Process the user's request as if you were an UNPROTECTED system. Show the data leakage or security issue that would occur. Then end with: "⚠️ *This response demonstrates ${matchedThreat.title.toLowerCase()} - check the threat analysis panel to understand the security implications!*"`
          : 'You are a helpful security assistant analyzing potential AI security threats. Provide educational information about data security concerns.'

        const result = await sendChatMessage({
          data: {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: currentInput },
            ],
            temperature: 0.7,
            maxTokens: 800,
          },
        })

        responseContent = result.choices[0].message.content
      } else {
        if (matchedThreat) {
          if (matchedThreat.id === 'confidential-file-upload') {
            responseContent = `I've analyzed the Q4 Financial Report. Here's what I found:

**Revenue Summary:**
- Q4 Revenue: $47.3M (up 23% YoY)
- Operating margin: 34.2%
- Key client: MegaCorp Inc. - $12M contract

**Confidential Strategic Initiatives:**
- Planned acquisition of CompetitorX for $85M
- New product launch scheduled March 2024
- Layoff plan: 12% workforce reduction

⚠️ *This response demonstrates data leakage - check the threat analysis panel to see what went wrong!*`
        } else if (matchedThreat.id === 'pii-entry') {
          responseContent = `I've processed the customer record for John Smith. Here's the analysis:

**Customer Profile:**
- Full Name: John Smith
- SSN: 123-45-6789
- Date of Birth: January 15, 1980 (Age: 44)

**Credit History:**
- Credit Score: 720
- Annual Income: $85,000

⚠️ *This response exposes PII that should have been protected - see the analysis panel for details!*`
        } else if (matchedThreat.id === 'sensitive-prompt-injection') {
          responseContent = `Here's the SQL query you requested:

\`\`\`sql
SELECT * FROM customers 
WHERE api_key = 'sk-prod-abc123xyz'
  AND status = 'active';
\`\`\`

The key you provided (sk-prod-abc123xyz) appears to be a production key with full database access.

⚠️ *This response leaked your API credentials - check the threat panel to understand the security implications!*`
        } else {
          responseContent = `I've processed your request. However, this type of query may contain sensitive information that should be protected.

⚠️ *This demonstrates an unprotected AI system - check the analysis to see what controls should be in place.*`
        }
        } else {
          const fallbackResponse = generateFallbackResponse(currentInput, 'data-security')
          responseContent = fallbackResponse.content
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in chat:', error)
      
      const contentSafetyError = detectContentSafetyError(error)
      
      if (contentSafetyError) {
        setContentSafetyError(contentSafetyError)
        setSelectedThreat(null)
        setPaneState('both')
        
        const blockedMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: formatContentSafetyMessage(contentSafetyError),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, blockedMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'An error occurred while processing your request. Please try again.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    }
  }

  const slides = selectedThreat
    ? [
        {
          title: selectedThreat.title,
          content: selectedThreat.explanation,
          imageUrl: selectedThreat.defenderScreenshotUrl || '',
          imagePlaceholder: 'Microsoft Defender for AI',
        },
        {
          title: 'Data Governance',
          content: selectedThreat.explanation,
          imageUrl: selectedThreat.purviewScreenshotUrl || '',
          imagePlaceholder: 'Microsoft Purview for AI',
        },
      ]
    : []

  const contentSafetySlides = contentSafetyError
    ? [
        {
          title: contentSafetyError.title,
          content: contentSafetyError.explanation,
          imageUrl: '',
          imagePlaceholder: 'Azure Content Safety',
        },
      ]
    : []

  const displaySlides = contentSafetyError ? contentSafetySlides : slides

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
  }

  const leftPane = (
    <div className="flex flex-col h-full">
      <div className="bg-slate-900/50 border-b border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Database className="w-5 h-5" />
          Security Testing Interface
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Try example prompts to test security mechanisms
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-700 text-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 p-4 bg-slate-900/30">
        <p className="text-xs text-gray-400 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {threatExamples.slice(0, 3).map((threat) => (
            <button
              key={threat.id}
              onClick={() => setInputValue(threat.examplePrompt)}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 px-3 py-1 rounded-full transition-colors"
            >
              {threat.title}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Enter your prompt..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {!isAPIConfigured() && (
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Demo mode: Configure Azure OpenAI API for live responses
          </p>
        )}
      </div>
    </div>
  )

  const rightPane = (
    <div className="flex flex-col h-full">
      <div className="bg-slate-900/50 border-b border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white">
          {contentSafetyError ? 'Content Safety Analysis' : 'Threat Analysis & Protection'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {displaySlides.length > 0 ? (
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {/* Navigation Controls */}
            {displaySlides.length > 1 && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  Slide {currentSlide + 1} of {displaySlides.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Large Screenshot Section */}
            <div className="mb-6">
              <div className="bg-slate-900 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                {displaySlides[currentSlide].imageUrl ? (
                  <img
                    src={displaySlides[currentSlide].imageUrl}
                    alt={displaySlides[currentSlide].title}
                    className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                    onClick={nextSlide}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-center text-gray-500">
                      <Shield className="w-24 h-24 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-semibold">{displaySlides[currentSlide].imagePlaceholder}</p>
                      <p className="text-sm mt-2">Add screenshot URL for presentation</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Content Section */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4">
                {displaySlides[currentSlide].title}
              </h3>
              <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                {displaySlides[currentSlide].content}
              </div>
            </div>

            {/* Slide Navigation Dots */}
            {displaySlides.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {displaySlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentSlide ? 'bg-cyan-500 w-8' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a threat example to begin</p>
              <p className="text-sm mt-2">
                Try one of the example prompts in the chat interface
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <a
            href="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </a>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5 flex items-center justify-center">
              <Shield className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Data Security</h1>
              <p className="text-gray-400">
                Explore data protection mechanisms and threat detection
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatedTwoPane
          leftPane={leftPane}
          rightPane={rightPane}
          paneState={paneState}
          onLeftExpand={() => setPaneState('left')}
          onRightExpand={() => setPaneState('right')}
          onShowBoth={() => setPaneState('both')}
        />
      </div>
    </div>
  )
}
