import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, FileCheck, Scale } from 'lucide-react'
import { useState } from 'react'
import { AnimatedTwoPane } from '@/components/AnimatedTwoPane'

export const Route = createFileRoute('/compliance')({
  component: CompliancePage,
})

interface Regulation {
  id: string
  name: string
  shortName: string
  description: string
  scope: string
  keyRequirements: Array<{
    title: string
    description: string
    controls: Array<string>
  }>
}

const regulations: Array<Regulation> = [
  {
    id: 'eu-ai-act',
    name: 'European Union Artificial Intelligence Act',
    shortName: 'EU AI Act',
    description:
      'Comprehensive regulatory framework for AI systems based on risk levels, establishing harmonized rules for development, placement on market, and use of AI systems in the EU.',
    scope: 'All AI systems placed on the EU market or used in the EU, regardless of provider location',
    keyRequirements: [
      {
        title: 'Risk Classification',
        description: 'AI systems must be classified into risk categories',
        controls: [
          'Unacceptable Risk: Prohibited systems (e.g., social scoring)',
          'High Risk: Strict requirements for critical applications',
          'Limited Risk: Transparency obligations',
          'Minimal Risk: No specific obligations beyond general law',
        ],
      },
      {
        title: 'High-Risk System Requirements',
        description: 'Mandatory requirements for high-risk AI systems',
        controls: [
          'Risk management system implementation',
          'Data governance and quality standards',
          'Technical documentation and record keeping',
          'Transparency and information provision to users',
          'Human oversight measures',
          'Accuracy, robustness, and cybersecurity',
        ],
      },
      {
        title: 'Transparency Obligations',
        description: 'Disclosure requirements for AI interactions',
        controls: [
          'Users must be informed when interacting with AI',
          'AI-generated content must be clearly labeled',
          'Deep fakes must be disclosed',
          'Emotion recognition and biometric systems require notification',
        ],
      },
      {
        title: 'Governance and Compliance',
        description: 'Organizational and oversight requirements',
        controls: [
          'Conformity assessment procedures',
          'CE marking for high-risk systems',
          'Post-market monitoring and incident reporting',
          'Quality management system',
          'Registration in EU database for high-risk systems',
        ],
      },
      {
        title: 'Documentation and Auditing',
        description: 'Record keeping and audit trail requirements',
        controls: [
          'Technical documentation maintenance',
          'Automatically generated logs',
          'Instructions for use documentation',
          'Regular system evaluations',
          'Compliance monitoring reports',
        ],
      },
    ],
  },
  {
    id: 'us-ai-executive-order',
    name: 'US Executive Order on Safe, Secure, and Trustworthy AI',
    shortName: 'US AI EO 14110',
    description:
      'Executive order establishing new standards for AI safety and security, protecting privacy, advancing equity, defending workers, promoting innovation, and advancing American leadership.',
    scope: 'Federal agencies and AI developers/deployers serving federal government or critical infrastructure',
    keyRequirements: [
      {
        title: 'Safety and Security Testing',
        description: 'Requirements for AI system validation and security',
        controls: [
          'Red-team testing before public release for powerful models',
          'Share safety test results with government',
          'Report training metrics for large models',
          'Vulnerability disclosure for AI systems',
          'Cybersecurity standards for AI infrastructure',
        ],
      },
      {
        title: 'Privacy Protection',
        description: 'Safeguards for personal data in AI systems',
        controls: [
          'Privacy-preserving techniques in AI development',
          'Evaluation of privacy risks in AI systems',
          'Guidance on privacy-preserving data sharing',
          'Minimize collection and retention of personal data',
          'Transparent privacy practices',
        ],
      },
      {
        title: 'Civil Rights and Equity',
        description: 'Preventing algorithmic discrimination',
        controls: [
          'Guidance on preventing algorithmic discrimination',
          'Civil rights impact assessments',
          'Fairness testing and validation',
          'Accessible AI systems for persons with disabilities',
          'Community engagement in AI deployment',
        ],
      },
      {
        title: 'Transparency and Accountability',
        description: 'Disclosure and governance requirements',
        controls: [
          'Content authentication and provenance tracking',
          'Watermarking of AI-generated content',
          'Clear labeling of AI involvement',
          'Explainability for decisions affecting individuals',
          'Regular audits and assessments',
        ],
      },
      {
        title: 'Innovation and Competition',
        description: 'Supporting responsible AI development',
        controls: [
          'Standards development for AI systems',
          'Support for AI research and development',
          'Small business access to AI technologies',
          'International cooperation on AI standards',
          'Workforce development for AI sector',
        ],
      },
    ],
  },
]

interface Slide {
  title: string
  content: string
  imageUrl: string
  imagePlaceholder: string
}

function CompliancePage() {
  const [selectedRegulation, setSelectedRegulation] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paneState, setPaneState] = useState<'both' | 'left' | 'right'>('left')

  const slides: Array<Slide> = [
    {
      title: 'Compliance Dashboard',
      content: `Overview of compliance status across all applicable regulations.

**Key Features:**
• Real-time compliance score
• Regulatory requirement tracking
• Risk assessment summaries
• Automated control monitoring
• Gap analysis and remediation`,
      imageUrl: '',
      imagePlaceholder: 'Microsoft Purview for AI - Dashboard',
    },
    {
      title: 'AI Risk Assessment',
      content: `Classification and assessment tools for AI systems.

**Assessment Areas:**
• Risk level classification
• Impact analysis
• Control effectiveness
• Compliance mapping
• Continuous monitoring`,
      imageUrl: '',
      imagePlaceholder: 'Risk Assessment Tools',
    },
    {
      title: 'Control Implementation',
      content: `Track implementation of required controls across frameworks.

**Implementation Tracking:**
• Control status monitoring
• Evidence collection
• Policy enforcement
• Audit trail generation
• Remediation workflows`,
      imageUrl: '',
      imagePlaceholder: 'Control Management',
    },
    {
      title: 'Documentation Management',
      content: `Maintain technical documentation and compliance records.

**Document Types:**
• Technical specifications
• Risk assessments
• Training data documentation
• System architecture
• Change logs`,
      imageUrl: '',
      imagePlaceholder: 'Documentation Repository',
    },
    {
      title: 'Audit and Reporting',
      content: `Generate compliance reports and maintain audit trails.

**Reporting Capabilities:**
• Automated report generation
• Compliance score cards
• Audit-ready documentation
• Incident reporting
• Regulatory submissions`,
      imageUrl: '',
      imagePlaceholder: 'Compliance Reports',
    },
    {
      title: 'Continuous Monitoring',
      content: `Real-time compliance monitoring and alerting.

**Monitoring Features:**
• Policy violation detection
• Drift monitoring
• Automated assessments
• Alert notifications
• Trending analysis`,
      imageUrl: '',
      imagePlaceholder: 'Continuous Monitoring Dashboard',
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const leftPane = (
    <div className="flex flex-col h-full">
      <div className="bg-slate-900/50 border-b border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Scale className="w-5 h-5" />
          AI Regulations & Requirements
        </h2>
        <p className="text-sm text-gray-400 mt-1">Key compliance frameworks for AI systems</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-2 mb-6">
          {regulations.map((reg, idx) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegulation(idx)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                selectedRegulation === idx
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              {reg.shortName}
            </button>
          ))}
        </div>

        <motion.div
          key={selectedRegulation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-2">
              {regulations[selectedRegulation].name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {regulations[selectedRegulation].description}
            </p>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-400 mb-1">Scope</p>
              <p className="text-xs text-gray-400">{regulations[selectedRegulation].scope}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Key Compliance Requirements</h4>
            {regulations[selectedRegulation].keyRequirements.map((req, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs">
                    {idx + 1}
                  </span>
                  {req.title}
                </h5>
                <p className="text-xs text-gray-400 mb-3 ml-8">{req.description}</p>
                <ul className="space-y-1.5 ml-8">
                  {req.controls.map((control, cidx) => (
                    <li key={cidx} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <span>{control}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-600/30 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-green-400 mb-2">Implementation Steps</h5>
            <ul className="space-y-2">
              {[
                'Assess AI system risk classification',
                'Document technical specifications',
                'Implement required controls',
                'Establish monitoring procedures',
                'Prepare for audits and assessments',
              ].map((step, idx) => (
                <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                  <FileCheck className="w-3 h-3 text-green-400 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )

  const rightPane = (
    <div className="flex flex-col h-full">
      <div className="bg-slate-900/50 border-b border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white">
          Microsoft Purview for AI - Compliance Manager
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Slide {currentSlide + 1} of {slides.length}
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

          {/* Large Screenshot Section */}
          <div className="mb-6">
            <div className="bg-slate-900 rounded-lg overflow-hidden" style={{ height: '450px' }}>
              {slides[currentSlide].imageUrl ? (
                <img
                  src={slides[currentSlide].imageUrl}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                  onClick={nextSlide}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="text-center text-gray-500">
                    <FileCheck className="w-24 h-24 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-semibold">{slides[currentSlide].imagePlaceholder}</p>
                    <p className="text-sm mt-2">Add screenshot URL for presentation</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Content Section */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              {slides[currentSlide].title}
            </h3>
            <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
              {slides[currentSlide].content}
            </div>
          </div>

          {/* Slide Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentSlide ? 'bg-green-500 w-8' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </motion.div>
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2.5 flex items-center justify-center">
              <FileCheck className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Compliance</h1>
              <p className="text-gray-400">Global AI regulations and compliance frameworks</p>
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
