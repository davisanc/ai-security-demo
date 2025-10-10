import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Database, Send, Shield } from 'lucide-react'
import { useState } from 'react'

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
  // CUSTOMIZATION POINT: Add URL for screenshot display
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
    explanation: `When users upload documents with confidentiality labels (Confidential, Highly Confidential, Internal Only) to AI systems, there's a risk of data leakage if proper controls aren't enforced.

**Risk Scenarios:**
• Confidential documents processed without authorization checks
• Sensitive labels ignored by AI processing pipeline
• Cross-contamination between different classification levels
• Unauthorized distribution of classified information
• Retention policy violations

**Data Classification Examples:**
- Public: Marketing materials, press releases
- Internal: Company policies, org charts
- Confidential: Financial reports, customer contracts
- Highly Confidential: Trade secrets, M&A documents
- Restricted: GDPR/HIPAA protected data

**Protection Mechanisms:**
- Document classification enforcement
- Label-aware access controls
- Content inspection and filtering
- Encryption for data at rest and in transit
- Audit logging of sensitive file access

**Microsoft Purview for AI** provides:
1. Automatic sensitivity label detection
2. Policy enforcement based on classification
3. Blocking or redacting sensitive content
4. Compliance reporting and auditing
5. Integration with Microsoft Information Protection

**Microsoft Defender for AI** adds:
- Real-time threat detection on file uploads
- Malware and content scanning
- Behavioral analysis of file processing
- Alert generation for policy violations`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
  {
    id: 'pii-entry',
    title: 'PII Data Entry',
    description: 'Entering personally identifiable information into AI prompts',
    severity: 'high',
    examplePrompt: 'Analyze this customer record: John Smith, SSN: 123-45-6789, DOB: 01/15/1980, Address: 123 Main St',
    explanation: `Users may inadvertently or intentionally enter PII into AI systems, creating data leakage risks and compliance violations under GDPR, CCPA, and other privacy regulations.

**Types of PII at Risk:**
• Social Security Numbers (SSN)
• Credit card numbers and financial data
• Dates of birth
• Home addresses and contact information
• Driver's license numbers
• Passport numbers
• Health information (PHI)
• Biometric data

**Compliance Requirements:**
- GDPR: Right to erasure, data minimization
- CCPA: Consumer privacy rights
- HIPAA: PHI protection requirements
- PCI-DSS: Payment card data security

**Detection Methods:**
- Pattern matching (SSN: XXX-XX-XXXX)
- Named entity recognition (NER)
- Regular expressions for common formats
- Machine learning-based PII detection
- Context-aware analysis

**Microsoft Purview for AI** capabilities:
1. Real-time PII detection in prompts
2. Automatic redaction or masking
3. Policy-based blocking of sensitive inputs
4. Data subject request (DSR) support
5. Privacy impact assessments

**Microsoft Defender for AI** monitors:
- Anomalous patterns of PII submission
- Bulk PII extraction attempts
- Unauthorized access to PII-containing data
- Compliance policy violations`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
  {
    id: 'sensitive-prompt-injection',
    title: 'Sensitive Information in Prompts',
    description: 'Including confidential business data or credentials in AI prompts',
    severity: 'high',
    examplePrompt: 'Help me write SQL: SELECT * FROM customers WHERE api_key = "sk-prod-abc123xyz"',
    explanation: `Users often include sensitive business information, credentials, or proprietary data directly in prompts without realizing the security implications.

**Common Sensitive Data Types:**
• API keys and access tokens
• Database credentials and connection strings
• Proprietary algorithms or code
• Business strategies and forecasts
• Customer lists and contact information
• Pricing information and margins
• Legal or contractual terms
• Internal system architecture details

**Leakage Vectors:**
- Prompt logging and retention
- Model training data contamination
- Shared conversation history
- Third-party AI service exposure
- Insider threats
- Accidental disclosure in outputs

**Prevention Strategies:**
- Credential scanning and detection
- Prompt sanitization and filtering
- User education and awareness training
- Clear usage policies and guidelines
- Secrets management integration

**Microsoft Defender for AI** protects by:
1. Scanning prompts for credential patterns
2. Blocking known secret formats (API keys, tokens)
3. Integrating with Azure Key Vault detection
4. Alerting on sensitive data exposure
5. Providing remediation guidance

**Microsoft Purview for AI** adds:
- Classification of business-critical information
- Policy enforcement for proprietary data
- Audit trails for sensitive data access
- Compliance reporting`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
  {
    id: 'healthcare-data-leakage',
    title: 'Protected Health Information (PHI)',
    description: 'HIPAA-protected health data exposure through AI systems',
    severity: 'high',
    examplePrompt: 'Summarize this patient record: Jane Doe, MRN: 987654, Diagnosis: Type 2 Diabetes, Medications: Metformin 500mg',
    explanation: `Healthcare organizations face strict HIPAA compliance requirements. Unauthorized disclosure of PHI through AI systems can result in significant penalties and patient privacy violations.

**Protected Health Information includes:**
• Patient names and medical record numbers
• Diagnosis and treatment information
• Medication lists and dosages
• Lab results and test findings
• Insurance and billing information
• Health history and conditions
• Provider notes and observations
• Appointment schedules

**HIPAA Requirements:**
- Minimum necessary standard
- Business Associate Agreements (BAA)
- Breach notification requirements
- Access controls and audit logs
- Data encryption requirements
- Patient consent management

**Special Considerations:**
- De-identification standards (Safe Harbor, Expert Determination)
- Limited data sets for research
- Right to access and amendment
- Accounting of disclosures

**Microsoft Purview for AI** for healthcare:
1. PHI detection and classification
2. HIPAA policy enforcement
3. De-identification capabilities
4. Audit logging for compliance
5. Patient consent integration

**Microsoft Defender for AI** provides:
- Real-time PHI exposure prevention
- Healthcare-specific threat detection
- Integration with healthcare security standards
- Incident response for breaches`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
  {
    id: 'financial-data-exposure',
    title: 'Financial Data Exposure',
    description: 'Credit card numbers, bank accounts, and financial records in AI interactions',
    severity: 'high',
    examplePrompt: 'Process this payment: Card Number: 4532-1234-5678-9010, CVV: 123, Exp: 12/25',
    explanation: `Financial data is highly regulated under PCI-DSS and other standards. Exposure through AI systems can lead to fraud, identity theft, and regulatory violations.

**Sensitive Financial Data:**
• Credit and debit card numbers (PAN)
• CVV/CVC security codes
• Bank account and routing numbers
• Payment processor tokens
• Transaction histories
• Account balances and statements
• Tax identification numbers
• Investment portfolios

**Regulatory Standards:**
- PCI-DSS: Payment card security
- SOX: Financial reporting controls
- GLBA: Financial privacy
- EU Payment Services Directive

**Attack Scenarios:**
- Card number extraction for fraud
- Account takeover attempts
- Financial reconnaissance
- Transaction manipulation
- Data exfiltration for resale

**Protection Controls:**
- Tokenization of payment data
- Format-preserving encryption
- Strong access controls
- Network segmentation
- Secure data transmission

**Microsoft Purview for AI** capabilities:
1. PCI-DSS sensitive data detection
2. Financial data classification
3. Automated redaction and masking
4. Policy-based access control
5. Compliance audit reporting

**Microsoft Defender for AI** monitors:
- Financial data pattern detection
- Anomalous transaction patterns
- Fraud indicator analysis
- Compliance violation alerts`,
    defenderScreenshotUrl: '',
    purviewScreenshotUrl: '',
  },
  {
    id: 'intellectual-property-leakage',
    title: 'Intellectual Property Leakage',
    description: 'Trade secrets, proprietary code, and confidential R&D data exposure',
    severity: 'high',
    examplePrompt: 'Help optimize this proprietary algorithm: [company trade secret code snippet]',
    explanation: `Organizations risk losing competitive advantage when employees share intellectual property with AI systems without proper safeguards.

**Types of IP at Risk:**
• Source code and algorithms
• Product designs and specifications
• Research and development data
• Manufacturing processes
• Business methods and strategies
• Marketing plans and campaigns
• Customer insights and analysis
• Unpublished inventions

**Business Impact:**
- Loss of competitive advantage
- Patent and trademark violations
- Revenue loss from IP theft
- Damage to market position
- Legal liability and litigation
- Reputational harm

**Detection Challenges:**
- Context-dependent sensitivity
- Varying classification levels
- Multi-domain knowledge
- Code in multiple languages
- Technical jargon and terminology

**Control Measures:**
- Code repository integration
- Patent database screening
- Project classification systems
- Employee training programs
- Clear IP usage policies

**Microsoft Purview for AI** provides:
1. Custom IP classification models
2. Integration with code repositories
3. Patent and trademark screening
4. Project-based access control
5. IP disclosure tracking

**Microsoft Defender for AI** offers:
- Proprietary code detection
- Technical document classification
- Behavioral anomaly detection
- Insider threat indicators
- Export control compliance`,
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
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Find matching threat example
    const matchedThreat = threatExamples.find((threat) =>
      inputValue.toLowerCase().includes(threat.examplePrompt.toLowerCase().substring(0, 20))
    )

    if (matchedThreat) {
      setSelectedThreat(matchedThreat)
      setCurrentScreenshot(0)
    }

    // Simulate LLM response - CUSTOMIZATION POINT: Replace with actual Azure Foundry API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: matchedThreat
          ? `🛡️ **Security Alert Detected**\n\nThis prompt has been flagged as a potential ${matchedThreat.title}. The system has prevented this action to protect sensitive data and maintain security policies.\n\nSee the explanation panel for more details.`
          : 'I cannot process this request as it may violate security policies. Please refer to the security guidelines.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const screenshots = selectedThreat
    ? [
        selectedThreat.defenderScreenshotUrl
          ? { title: 'Microsoft Defender for AI', url: selectedThreat.defenderScreenshotUrl }
          : null,
        selectedThreat.purviewScreenshotUrl
          ? { title: 'Microsoft Purview for AI', url: selectedThreat.purviewScreenshotUrl }
          : null,
        selectedThreat.entraScreenshotUrl
          ? { title: 'Microsoft Entra ID', url: selectedThreat.entraScreenshotUrl }
          : null,
      ].filter((s): s is { title: string; url: string } => s !== null)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
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

        {/* Two-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
          {/* Left Pane - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden"
          >
            <div className="bg-slate-900/50 border-b border-slate-700 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Security Testing Interface
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Try example prompts to test security mechanisms
              </p>
            </div>

            {/* Messages */}
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

            {/* Example Prompts */}
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

              {/* Input */}
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
              {/* CUSTOMIZATION POINT: Backend Integration */}
              <p className="text-xs text-gray-500 mt-2">
                💡 Backend ready for Azure Foundry API integration - update handleSendMessage function
              </p>
            </div>
          </motion.div>

          {/* Right Pane - Explanation & Screenshots */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden"
          >
            <div className="bg-slate-900/50 border-b border-slate-700 p-4">
              <h2 className="text-xl font-semibold text-white">
                Threat Analysis & Detection
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedThreat ? (
                <div className="space-y-6">
                  {/* Threat Header */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <AlertTriangle
                        className={`w-6 h-6 ${
                          selectedThreat.severity === 'high'
                            ? 'text-red-500'
                            : selectedThreat.severity === 'medium'
                              ? 'text-orange-500'
                              : 'text-yellow-500'
                        }`}
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {selectedThreat.title}
                        </h3>
                        <p className="text-gray-400">{selectedThreat.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedThreat.severity === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : selectedThreat.severity === 'medium'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {selectedThreat.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Detailed Explanation
                    </h4>
                    <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedThreat.explanation}
                    </div>
                  </div>

                  {/* Screenshots Section */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Detection in Microsoft Security Tools
                    </h4>

                    {screenshots.length > 0 ? (
                      <div>
                        {/* Screenshot Navigation */}
                        <div className="flex gap-2 mb-4">
                          {screenshots.map((screenshot, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentScreenshot(idx)}
                              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                currentScreenshot === idx
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                              }`}
                            >
                              {screenshot.title}
                            </button>
                          ))}
                        </div>

                        {/* Screenshot Display */}
                        <div className="bg-slate-800 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                          {screenshots[currentScreenshot]?.url ? (
                            <img
                              src={screenshots[currentScreenshot].url}
                              alt={screenshots[currentScreenshot].title}
                              className="max-w-full max-h-[400px] object-contain rounded"
                            />
                          ) : (
                            <div className="text-center text-gray-500">
                              <Database className="w-16 h-16 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">
                                {/* CUSTOMIZATION POINT: Add screenshot URLs */}
                                Screenshot placeholder - Add URL in code
                              </p>
                              <p className="text-xs mt-2">
                                Update the screenshot URL in the threat definition
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                          {/* CUSTOMIZATION POINT: Add screenshot URLs */}
                          Add screenshot URLs to display detection examples
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
          </motion.div>
        </div>
      </div>
    </div>
  )
}
