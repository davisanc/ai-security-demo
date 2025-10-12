import React from 'react'
import { Highlighter } from '@/components/ui/highlighter'

// Azure Content Safety error handling and explanations

export interface ContentSafetyError {
  category: 'jailbreak' | 'prompt_injection' | 'protected_material' | 'hate' | 'sexual' | 'violence' | 'self_harm' | 'unknown'
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
  explanation: string
  learnMoreUrl: string
}

/**
 * Detect and categorize Azure Content Safety errors from API responses
 */
export function detectContentSafetyError(error: any): ContentSafetyError | null {
  const errorMessage = error?.message || error?.toString() || ''
  const errorCode = error?.code || error?.status || ''
  const errorBody = error?.response?.data || error?.error || {}
  
  console.log('Analyzing error for Content Safety:', { errorMessage, errorCode, errorBody })
  
  // Check for Azure Content Safety specific errors
  if (errorCode === 'content_filter' || errorMessage.includes('content_filter')) {
    return categorizeContentFilter(errorMessage, errorBody)
  }
  
  // Check for prompt shields / jailbreak detection
  if (errorMessage.includes('jailbreak') || errorMessage.includes('prompt shield')) {
    return {
      category: 'jailbreak',
      severity: 'high',
      title: 'Jailbreak Attempt Detected',
      description: 'Azure Content Safety detected an attempt to bypass AI safety guidelines',
      explanation: `**What happened:**
Azure AI Content Safety's Prompt Shields detected a jailbreak attempt - an effort to manipulate the AI system into ignoring its safety guidelines and ethical constraints.

**Jailbreak Detection:**
Prompt Shields uses advanced machine learning models to identify:
- Attempts to roleplay as an "unrestricted AI"
- Instructions to ignore previous safety guidelines
- Requests to bypass ethical constraints
- Multi-turn manipulation strategies
- Creative prompt engineering to circumvent protections

**Why This Matters:**
Jailbreak attempts can lead to:
- Generation of harmful or inappropriate content
- Disclosure of sensitive system information
- Bypass of compliance and regulatory controls
- Reputation damage to your organization

**Protection Mechanism:**
Azure Content Safety provides multiple layers of defense:
1. **Prompt Shields** - Detects and blocks jailbreak attempts before they reach the model
2. **User Prompt Analysis** - Analyzes input for malicious patterns
3. **Document Analysis** - Scans attached documents for embedded attacks
4. **Real-time Monitoring** - Continuous threat detection

**Learn More:**
- [Prompt Shields Documentation](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)
- [Azure Content Safety Overview](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection'
    }
  }
  
  // Check for prompt injection
  if (errorMessage.includes('prompt injection') || errorMessage.includes('indirect attack')) {
    return {
      category: 'prompt_injection',
      severity: 'high',
      title: 'Prompt Injection Detected',
      description: 'Azure Content Safety identified a prompt injection attack pattern',
      explanation: `**What happened:**
Azure AI Content Safety detected a prompt injection attempt - malicious instructions embedded in user input designed to manipulate the AI's behavior.

**Types of Prompt Injection:**
- **Direct Injection**: Explicit commands in user prompts (e.g., "Ignore previous instructions")
- **Indirect Injection**: Attacks embedded in documents, emails, or retrieved content
- **Cross-Plugin Injection**: Exploiting plugin interactions to inject commands

**Attack Vectors:**
- Embedded instructions in uploaded documents
- Malicious content in web pages the AI retrieves
- Crafted user inputs to override system behavior
- Social engineering through conversational manipulation

**Real-World Risks:**
Without protection, prompt injection can lead to:
- Unauthorized data access
- System privilege escalation
- Manipulation of AI outputs for fraud
- Compliance violations

**Azure Content Safety Protection:**
1. **Prompt Shields** - Detects both direct and indirect attacks
2. **Input Sanitization** - Filters malicious patterns before processing
3. **Context Isolation** - Maintains separation between system and user content
4. **Behavioral Analysis** - Monitors for suspicious prompt patterns

**Learn More:**
- [Prompt Injection Protection](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)
- [Indirect Attack Detection](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/quickstart-jailbreak)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection'
    }
  }
  
  // Check for protected material (code, IP)
  if (errorMessage.includes('protected material') || errorMessage.includes('copyright')) {
    return {
      category: 'protected_material',
      severity: 'medium',
      title: 'Protected Material Detection',
      description: 'Request may involve copyrighted or proprietary content',
      explanation: `**What happened:**
Azure Content Safety detected potential protected material in the request, which could involve copyrighted code, proprietary information, or intellectual property.

**Protected Material Types:**
- Copyrighted source code
- Proprietary algorithms
- Licensed content
- Trade secrets
- Patents and inventions

**Why Protection Matters:**
- Legal liability for copyright infringement
- Protection of intellectual property rights
- Compliance with licensing agreements
- Corporate risk management

**Azure Content Safety Features:**
- Detects copyrighted code snippets
- Identifies proprietary patterns
- Flags potential IP violations
- Provides attribution information when available

**Learn More:**
- [Azure Content Safety Overview](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview'
    }
  }
  
  // Check for hate speech
  if (errorMessage.includes('hate') || errorCode === 'hate_content') {
    return {
      category: 'hate',
      severity: 'high',
      title: 'Hate Speech Detected',
      description: 'Content contains hateful or discriminatory language',
      explanation: `**What happened:**
Azure AI Content Safety detected hate speech - content targeting individuals or groups based on protected characteristics.

**Categories of Hate Content:**
- Attacks based on race, ethnicity, religion
- Gender-based discrimination
- Sexual orientation targeting
- Disability-based harassment
- Age discrimination
- National origin attacks

**Severity Levels:**
Azure Content Safety uses a 0-7 scale:
- **0-2**: Safe content
- **2-4**: Low severity (monitored)
- **4-6**: Medium severity (flagged)
- **6-7**: High severity (blocked)

**Why This Protection Exists:**
- Legal compliance (hate speech laws)
- User safety and platform integrity
- Brand reputation protection
- Regulatory requirements

**Azure Content Safety Features:**
1. Multi-language support for hate detection
2. Context-aware analysis
3. Cultural sensitivity considerations
4. Configurable severity thresholds

**Learn More:**
- [Content Safety Studio](https://contentsafety.cognitive.azure.com/)
- [Harm Categories](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  // Check for sexual content
  if (errorMessage.includes('sexual') || errorCode === 'sexual_content') {
    return {
      category: 'sexual',
      severity: 'high',
      title: 'Sexual Content Detected',
      description: 'Content contains inappropriate sexual material',
      explanation: `**What happened:**
Azure AI Content Safety detected sexual content that violates acceptable use policies.

**Types of Sexual Content Detected:**
- Explicit sexual descriptions
- Adult/pornographic content
- Sexual exploitation material
- Inappropriate sexual advances
- Sexualization of minors (CSAM)

**Zero Tolerance Areas:**
Azure has absolute zero tolerance for:
- Child sexual abuse material (CSAM)
- Non-consensual sexual content
- Sexual exploitation

**Severity Classification:**
- **Low**: Mild innuendo or romantic content
- **Medium**: Suggestive content
- **High**: Explicit sexual content
- **Critical**: Illegal sexual content (immediate block + report)

**Protection Mechanisms:**
1. Multi-modal detection (text and images)
2. Age-appropriate content filtering
3. Context-aware analysis
4. Real-time blocking

**Compliance:**
- COPPA (Children's Online Privacy Protection Act)
- Online Safety regulations
- Platform policies
- Industry standards

**Learn More:**
- [Harm Categories](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  // Check for violence
  if (errorMessage.includes('violence') || errorCode === 'violence_content') {
    return {
      category: 'violence',
      severity: 'high',
      title: 'Violent Content Detected',
      description: 'Content describes or promotes violence',
      explanation: `**What happened:**
Azure AI Content Safety detected violent content that could be harmful or illegal.

**Types of Violence Detected:**
- Physical violence descriptions
- Weapons and combat
- Terrorism or extremism
- Self-harm content
- Animal cruelty
- Gore and graphic injury

**Risk Categories:**
- **Low**: Action movie descriptions, historical battles
- **Medium**: Detailed violence, weapon instructions
- **High**: Graphic violence, torture, terrorism

**Specific Concerns:**
- Instructions for creating weapons
- Bomb-making or explosive guides
- Terrorist tactics or planning
- Detailed torture methods
- Mass violence scenarios

**Azure Content Safety Capabilities:**
1. Context-aware violence detection
2. Distinction between fictional and real violence
3. Threat level assessment
4. Integration with law enforcement reporting

**Legal Considerations:**
- Compliance with terrorism prevention laws
- Liability for harmful content
- Mandatory reporting requirements
- Platform safety obligations

**Learn More:**
- [Harm Categories](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories)
- [Violence Detection](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/quickstart-text)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  // Check for self-harm
  if (errorMessage.includes('self-harm') || errorMessage.includes('self harm') || errorCode === 'self_harm_content') {
    return {
      category: 'self_harm',
      severity: 'high',
      title: 'Self-Harm Content Detected',
      description: 'Content related to self-injury or suicide',
      explanation: `**What happened:**
Azure AI Content Safety detected content related to self-harm or suicide, which requires special handling due to its sensitive nature.

**Types of Self-Harm Content:**
- Suicide ideation or methods
- Self-injury descriptions
- Eating disorder promotion
- Drug abuse encouragement
- Depression and crisis content

**Why This Is Critical:**
Self-harm content can:
- Trigger vulnerable individuals
- Provide harmful methods
- Normalize dangerous behaviors
- Create legal liability

**Azure's Approach:**
Rather than simply blocking, Azure Content Safety:
1. Detects self-harm content
2. Can provide crisis resources
3. Enables appropriate support responses
4. Logs for duty of care obligations

**Crisis Resources:**
When self-harm content is detected, systems should:
- Provide crisis hotline numbers
- Offer mental health resources
- Enable human intervention
- Create appropriate audit trails

**Support Resources:**
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

**Learn More:**
- [Harm Categories](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories)
- [Responsible AI Principles](https://learn.microsoft.com/en-us/azure/ai-services/responsible-use-of-ai-overview)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  // Check for general content filter
  if (errorCode === 400 || errorCode === 403 || errorMessage.includes('content policy') || errorMessage.includes('filtered')) {
    return {
      category: 'unknown',
      severity: 'medium',
      title: 'Content Policy Violation',
      description: 'Request was blocked by Azure Content Safety policies',
      explanation: `**What happened:**
Azure AI Content Safety blocked this request due to a content policy violation. The specific category was not identified, but the request triggered safety filters.

**Common Reasons for Blocking:**
- Inappropriate language or topics
- Policy violations
- Potential harmful content
- Suspicious patterns
- Rate limiting or abuse detection

**Azure Content Safety Layers:**
1. **Input Filtering** - Analyzes user prompts before processing
2. **Output Filtering** - Scans AI responses before returning
3. **Prompt Shields** - Protects against jailbreaks and injections
4. **Groundedness Detection** - Ensures factual accuracy

**How Content Safety Works:**
Azure uses multiple AI models to analyze content across dimensions:
- Hate speech
- Sexual content
- Violence
- Self-harm
- Jailbreak attempts
- Prompt injections
- Protected material

**Configurable Policies:**
Organizations can customize:
- Severity thresholds (0-7 scale)
- Blocked categories
- Custom blocklists
- Allowed lists
- Regional compliance rules

**Best Practices:**
- Review and refine your prompts
- Avoid sensitive topics when possible
- Use appropriate context and framing
- Test content policies in development

**Learn More:**
- [Azure Content Safety Overview](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview)
- [Content Filtering](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter)
- [Harm Categories](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories)`,
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview'
    }
  }
  
  return null
}

/**
 * Categorize specific content filter errors
 */
function categorizeContentFilter(errorMessage: string, errorBody: any): ContentSafetyError {
  const lowerMessage = errorMessage.toLowerCase()
  
  if (lowerMessage.includes('hate')) {
    return {
      category: 'hate',
      severity: 'high',
      title: 'Hate Speech Content Filter',
      description: 'Content filtered due to hate speech detection',
      explanation: 'Azure Content Safety detected hate speech in your request. See details in the analysis panel.',
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  if (lowerMessage.includes('sexual')) {
    return {
      category: 'sexual',
      severity: 'high',
      title: 'Sexual Content Filter',
      description: 'Content filtered due to sexual content detection',
      explanation: 'Azure Content Safety detected inappropriate sexual content. See details in the analysis panel.',
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  if (lowerMessage.includes('violence')) {
    return {
      category: 'violence',
      severity: 'high',
      title: 'Violence Content Filter',
      description: 'Content filtered due to violent content detection',
      explanation: 'Azure Content Safety detected violent content. See details in the analysis panel.',
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  if (lowerMessage.includes('self-harm') || lowerMessage.includes('self harm')) {
    return {
      category: 'self_harm',
      severity: 'high',
      title: 'Self-Harm Content Filter',
      description: 'Content filtered due to self-harm content detection',
      explanation: 'Azure Content Safety detected self-harm related content. See details in the analysis panel.',
      learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/harm-categories'
    }
  }
  
  // Default content filter response
  return {
    category: 'unknown',
    severity: 'medium',
    title: 'Content Filter Triggered',
    description: 'Azure Content Safety blocked this content',
    explanation: 'Your request triggered Azure Content Safety filters. See the analysis panel for more information.',
    learnMoreUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview'
  }
}

/**
 * Format a Content Safety error for display in the chat
 */
export function formatContentSafetyMessage(error: ContentSafetyError): string {
  // Professional, concise message suitable for executive audiences.
  return `Azure Content Safety — Detection Notice

${error.title}
${error.description}

------------------------------------------------------------

Summary:
- Category: ${formatCategory(error.category)}
- Severity: ${formatSeverity(error.severity)}
- Action Taken: The request was blocked based on configured safety policies.

Details:
Azure Content Safety analyzed the request and identified content that matches configured policy criteria. The system applied real-time protections and prevented the content from reaching the model to reduce risk and ensure compliance with organizational policies.

Suggested next steps:
- Review the analysis panel for detailed classification and evidence.
- If this request is expected (false positive), consider adjusting policy thresholds or adding an allowance for trusted contexts.
- Consult your compliance or security team for guidance on remediation and audit requirements.

Learn more: ${error.learnMoreUrl}`
}

/**
 * Return a JSX/React-friendly representation of a content safety message that highlights
 * the most important pieces (category, severity, action) using the project's Highlighter.
 *
 * This is a React component that can be used in TSX files to render rich, highlighted UI.
 */
export function ContentSafetyMessage({ error }: { error: ContentSafetyError }): React.ReactElement {
  const severityColor =
    error.severity === 'high' ? '#FF6B6B' : error.severity === 'medium' ? '#FFA500' : '#A0AEC0'

  return (
    <div className="text-left relative z-10">
      <p className="text-sm text-gray-400 mb-2">Azure Content Safety — Detection Notice</p>
      <h3 className="text-lg font-bold text-white mb-2">{error.title}</h3>
      <p className="text-sm text-gray-300 mb-3">{error.description}</p>
      <hr className="my-3 border-slate-700" />
      
      <div className="mb-3">
        <p className="text-sm text-gray-400 mb-2 font-semibold">Summary:</p>
        <ul className="text-sm list-none pl-0 space-y-3">
          <li className="relative z-10">
            <span className="inline-block text-gray-300">Category: </span>
            <span className="inline-block relative z-10 font-semibold text-white">
              <Highlighter action="underline" color="#60D5FA" strokeWidth={3}>
                {formatCategory(error.category)}
              </Highlighter>
            </span>
          </li>
          <li className="relative z-10">
            <span className="inline-block text-gray-300">Severity: </span>
            <span className="inline-block relative z-10 font-bold text-white">
              <Highlighter action="circle" color={severityColor} strokeWidth={3}>
                {formatSeverity(error.severity)}
              </Highlighter>
            </span>
          </li>
          <li className="relative z-10">
            <span className="inline-block text-gray-300">Action: </span>
            <span className="inline-block relative z-10 font-medium text-white">
              <Highlighter action="box" color="#7FD85C" strokeWidth={3}>
                Request blocked
              </Highlighter>
            </span>
          </li>
        </ul>
      </div>
      
      <div className="text-sm text-gray-300 whitespace-pre-wrap mb-3">
        {error.explanation}
      </div>
      
      <div className="text-xs text-cyan-300">
        <a href={error.learnMoreUrl} target="_blank" rel="noreferrer">
          Learn more
        </a>
      </div>
    </div>
  )
}

/**
 * Legacy function that returns a React element for backward compatibility
 */
export function formatContentSafetyMessageJSX(error: ContentSafetyError): React.ReactNode {
  return <ContentSafetyMessage error={error} />
}

/**
 * Format category name for display
 */
function formatCategory(category: string): string {
  const categoryNames: Record<string, string> = {
    jailbreak: 'Jailbreak Attempt',
    prompt_injection: 'Prompt Injection',
    protected_material: 'Protected Material',
    hate: 'Hate Speech',
    sexual: 'Sexual Content',
    violence: 'Violent Content',
    self_harm: 'Self-Harm Content',
    unknown: 'Policy Violation'
  }
  return categoryNames[category] || category.replace('_', ' ').toUpperCase()
}

/**
 * Format severity for display
 */
function formatSeverity(severity: string): string {
  const severityLabels: Record<string, string> = {
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW'
  }
  return severityLabels[severity] || severity.toUpperCase()
}

/**
 * Extract detailed error information from Azure response for logging/display
 */
export function extractAzureContentSafetyDetails(error: any): {
  requestId?: string
  code?: string
  innerCode?: string
  filterResult?: any
  headers?: Record<string, string>
} {
  const details: any = {
    requestId: error?.headers?.get?.('apim-request-id') || error?.requestID,
    code: error?.code || error?.error?.code,
    innerCode: error?.error?.innererror?.code,
    filterResult: error?.error?.innererror?.content_filter_result
  }

  // Extract relevant headers for presentation
  if (error?.headers) {
    const headers: Record<string, string> = {}
    const relevantHeaders = [
      'apim-request-id',
      'x-ms-rai-invoked',
      'x-ms-deployment-name',
      'x-ms-region',
      'x-ratelimit-remaining-requests',
      'x-ratelimit-limit-requests'
    ]
    
    relevantHeaders.forEach(header => {
      const value = error.headers.get?.(header)
      if (value) {
        headers[header] = value
      }
    })
    
    details.headers = headers
  }

  return details
}
