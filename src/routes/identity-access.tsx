import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bot, ChevronLeft, ChevronRight, GitBranch, Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AnimatedList } from '@/components/ui/animated-list'
import { AnimatedTwoPane } from '@/components/AnimatedTwoPane'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/identity-access')({
  component: IdentityAccessPage,
})

interface AgentLifecycleStage {
  id: string
  title: string
  description: string
  risks: Array<string>
  controls: Array<string>
}

const lifecycleStages: Array<AgentLifecycleStage> = [
  {
    id: 'creation',
    title: 'Agent Creation',
    description: 'Initial provisioning and configuration of AI agents',
    risks: [
      'Unauthorized agent creation',
      'Misconfigured permissions',
      'Missing approval workflows',
      'Shadow AI deployment',
    ],
    controls: [
      'Approval-based provisioning',
      'Template-based configuration',
      'Automated compliance checks',
      'Registration in identity system',
    ],
  },
  {
    id: 'authentication',
    title: 'Authentication & Authorization',
    description: 'Establishing and verifying agent identities',
    risks: [
      'Weak authentication mechanisms',
      'Shared credentials across agents',
      'Missing MFA for critical agents',
      'Credential exposure',
    ],
    controls: [
      'Certificate-based authentication',
      'Managed identities',
      'Zero-trust architecture',
      'Conditional access policies',
    ],
  },
  {
    id: 'operation',
    title: 'Active Operation',
    description: 'Day-to-day agent activities and interactions',
    risks: [
      'Privilege escalation attempts',
      'Unauthorized resource access',
      'Lateral movement',
      'Anomalous behavior patterns',
    ],
    controls: [
      'Continuous monitoring',
      'Behavioral analytics',
      'Just-in-time access',
      'Least privilege enforcement',
    ],
  },
  {
    id: 'review',
    title: 'Access Review',
    description: 'Periodic validation of agent permissions and necessity',
    risks: [
      'Permission creep over time',
      'Orphaned access rights',
      'Unused agents with active credentials',
      'Compliance violations',
    ],
    controls: [
      'Automated access reviews',
      'Permission recertification',
      'Usage analytics',
      'Automated deprovisioning alerts',
    ],
  },
  {
    id: 'modification',
    title: 'Modification & Updates',
    description: 'Changes to agent configuration and capabilities',
    risks: [
      'Unauthorized modifications',
      'Security regression',
      'Breaking change impacts',
      'Audit trail gaps',
    ],
    controls: [
      'Change approval workflows',
      'Version control',
      'Rollback capabilities',
      'Comprehensive logging',
    ],
  },
  {
    id: 'decommission',
    title: 'Decommissioning',
    description: 'Secure retirement of AI agents',
    risks: [
      'Lingering credentials',
      'Orphaned permissions',
      'Data retention violations',
      'Incomplete cleanup',
    ],
    controls: [
      'Automated deprovisioning',
      'Credential revocation',
      'Access removal validation',
      'Archival procedures',
    ],
  },
]

interface Screenshot {
  id: string
  title: string
  description: string
  url: string
}

interface AgentNotification {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

const userNames = [
  'Alice Chen', 'Bob Smith', 'Carol Martinez', 'David Kim', 'Emma Wilson', 'Frank Lee', 'Grace Taylor', 'Henry Brown',
  'Isabella Rodriguez', 'Jack Thompson', 'Katie Johnson', 'Liam O\'Connor', 'Maya Patel', 'Noah Anderson', 'Olivia Zhang',
  'Paul Nguyen', 'Quinn Foster', 'Rachel Green', 'Sam Williams', 'Tara Singh', 'Uma Krishnan', 'Victor Lopez',
  'Wendy Chang', 'Xavier Mitchell', 'Yuki Tanaka', 'Zara Ahmed', 'Aaron Clark', 'Bella Rossi', 'Carlos Hernandez',
  'Diana White', 'Ethan Moore', 'Fatima Al-Rashid', 'George Baker', 'Hannah Lee', 'Ian Fraser', 'Julia Santos'
]

const modelActions = [
  'created model GPT-4', 'started using Claude-3', 'deployed Llama-2', 'created agent Assistant-Pro',
  'started using Gemini', 'created agent DataAnalyzer', 'deployed Mistral-7B', 'created agent CodeHelper',
  'initialized GPT-4-Turbo', 'deployed Claude-3-Opus', 'created agent SecurityBot', 'started using PaLM-2',
  'created agent MarketingAssistant', 'deployed GPT-3.5-Turbo', 'created agent CustomerSupport', 'started using Cohere',
  'deployed Falcon-40B', 'created agent ContentWriter', 'started using Llama-3', 'created agent ResearchAnalyst',
  'deployed Mixtral-8x7B', 'created agent SalesBot', 'started using Claude-3-Sonnet', 'created agent DevOps-Agent',
  'deployed Vicuna-13B', 'created agent TranslationBot', 'started using GPT-4-Vision', 'created agent FinanceTracker',
  'deployed Zephyr-7B', 'created agent HRAssistant', 'started using Gemini-Pro', 'created agent LegalAdvisor',
  'deployed MPT-30B', 'created agent ProjectManager', 'started using Claude-Instant', 'created agent QABot',
  'deployed Phi-2', 'created agent DocumentScanner', 'started using Bard', 'created agent InventoryManager'
]

const icons = [
  '🤖', '🎯', '⚡', '🚀', '💡', '🔮', '✨', '🎨', '🔥', '💎', '🌟', '⭐', '🎪', '🎭', '🎬', '🎮',
  '🎲', '🎰', '🧩', '🧠', '💻', '📱', '🖥️', '⌨️', '🖱️', '🔧', '🔨', '⚙️', '🛠️', '🔬', '🔭', '📡',
  '🛸', '🚁', '🛰️', '🌐', '📊', '📈', '📉', '💰', '💳', '💸', '🏆', '🎖️', '🏅', '🎓', '📚', '📖'
]

const colors = [
  '#00C9A7', '#FFB800', '#FF3D71', '#1E86FF', '#9D4EDD', '#06FFA5', '#FF006E', '#3A86FF',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#52B788', '#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0', '#06FFA5', '#FFD60A',
  '#FF4365', '#00BBF9', '#00F5FF', '#FCBF49', '#F77F00', '#D62828', '#003049', '#EF476F',
  '#06D6A0', '#118AB2', '#073B4C', '#FFD166', '#EF476F', '#26547C', '#F94144', '#F3722C'
]

function generateRandomNotification(): AgentNotification {
  const randomUser = userNames[Math.floor(Math.random() * userNames.length)]
  const randomAction = modelActions[Math.floor(Math.random() * modelActions.length)]
  const randomIcon = icons[Math.floor(Math.random() * icons.length)]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const timeOptions = ['Just now', '1m ago', '2m ago', '3m ago', '5m ago']
  const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)]
  
  return {
    name: randomUser,
    description: randomAction,
    icon: randomIcon,
    color: randomColor,
    time: randomTime,
  }
}

const Notification = ({ name, description, icon, color, time }: AgentNotification) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-slate-800/50 backdrop-blur-md [border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  )
}

function IdentityAccessPage() {
  const [currentStage, setCurrentStage] = useState(0)
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const [notifications, setNotifications] = useState<Array<AgentNotification>>([])
  const [paneState, setPaneState] = useState<'both' | 'left' | 'right'>('left')


  useEffect(() => {
    // Generate initial notifications
    const initialNotifications = Array.from({ length: 10000 }, () => generateRandomNotification())
    setNotifications(initialNotifications)
  }, [])

  // CUSTOMIZATION POINT: Add your Entra Agent ID screenshot URLs here
  const screenshots: Array<Screenshot> = [
    {
      id: 'overview',
      title: 'Agent Identity Dashboard',
      description: 'Overview of all registered AI agents and their status',
      url: '', // Add your screenshot URL
    },
    {
      id: 'lifecycle',
      title: 'Lifecycle Management',
      description: 'Visual representation of agent lifecycle stages',
      url: '', // Add your screenshot URL
    },
    {
      id: 'permissions',
      title: 'Permission Management',
      description: 'Granular permission controls for AI agents',
      url: '', // Add your screenshot URL
    },
    {
      id: 'monitoring',
      title: 'Activity Monitoring',
      description: 'Real-time monitoring of agent activities',
      url: '', // Add your screenshot URL
    },
    {
      id: 'compliance',
      title: 'Compliance Reports',
      description: 'Compliance and audit reports for agent identities',
      url: '', // Add your screenshot URL
    },
  ]

  const nextStage = () => {
    setCurrentStage((prev) => (prev + 1) % lifecycleStages.length)
  }

  const prevStage = () => {
    setCurrentStage((prev) => (prev - 1 + lifecycleStages.length) % lifecycleStages.length)
  }

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % screenshots.length)
  }

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  const leftPane = (
    <div className="flex flex-col h-full">
            <div className="bg-slate-900/50 border-b border-slate-700 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Agent Lifecycle Governance
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Understanding agent sprawl and the need for lifecycle management
              </p>
            </div>

            <div className="p-6">
              {/* Agent Activity Feed */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  Real-Time Agent Activity
                </h3>
                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <div className="relative h-[400px] w-full overflow-hidden">
                    <AnimatedList>
                      {notifications.map((item, idx) => (
                        <Notification {...item} key={`${item.name}-${item.description}-${idx}`} />
                      ))}
                    </AnimatedList>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-900/50"></div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-gray-300 text-sm mb-2">
                      Without governance, organizations face:
                    </p>
                    <ul className="text-left text-gray-400 text-xs space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Untracked agent proliferation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Unknown permission boundaries
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Security and compliance risks
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Orphaned credentials and access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Lifecycle Stage Display */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Lifecycle Stage {currentStage + 1} of {lifecycleStages.length}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={prevStage}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      aria-label="Previous stage"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={nextStage}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      aria-label="Next stage"
                    >
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex gap-1 mb-6">
                  {lifecycleStages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        idx === currentStage
                          ? 'bg-purple-500'
                          : idx < currentStage
                            ? 'bg-purple-500/50'
                            : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <motion.div
                  key={currentStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900/50 rounded-lg p-6"
                >
                  <h4 className="text-xl font-bold text-white mb-2">
                    {lifecycleStages[currentStage].title}
                  </h4>
                  <p className="text-gray-400 mb-4">
                    {lifecycleStages[currentStage].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Key Risks
                      </h5>
                      <ul className="space-y-1">
                        {lifecycleStages[currentStage].risks.map((risk, idx) => (
                          <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-red-500" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Controls
                      </h5>
                      <ul className="space-y-1">
                        {lifecycleStages[currentStage].controls.map((control, idx) => (
                          <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                            <span>{control}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Navigation Hint */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Use the navigation buttons to explore each lifecycle stage
                </p>
              </div>
            </div>
    </div>
  )

  const rightPane = (
    <div className="flex flex-col h-full">
            <div className="bg-slate-900/50 border-b border-slate-700 p-4">
              <h2 className="text-xl font-semibold text-white">
                Microsoft Entra Agent ID
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Identity and access management for AI agents
              </p>
            </div>

            <div className="p-6">
              {/* Screenshot Navigation */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300">
                  {currentScreenshot + 1} / {screenshots.length}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={prevScreenshot}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={nextScreenshot}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Screenshot Display */}
              <motion.div
                key={currentScreenshot}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="bg-slate-900/50 rounded-lg p-4 mb-3">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {screenshots[currentScreenshot].title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {screenshots[currentScreenshot].description}
                  </p>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
                  {screenshots[currentScreenshot].url ? (
                    <img
                      src={screenshots[currentScreenshot].url}
                      alt={screenshots[currentScreenshot].title}
                      className="max-w-full max-h-[500px] object-contain rounded cursor-pointer hover:scale-105 transition-transform"
                      onClick={nextScreenshot}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <Users className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-sm mb-2">
                        {/* CUSTOMIZATION POINT: Add screenshot URLs */}
                        Screenshot placeholder - Add URL in code
                      </p>
                      <p className="text-xs text-gray-600">
                        Update the screenshot URL in the screenshots array
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Click arrows to navigate through presentation slides
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Screenshot Dots */}
              <div className="flex justify-center gap-2">
                {screenshots.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentScreenshot(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentScreenshot ? 'bg-purple-500' : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to screenshot ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Key Features */}
              <div className="mt-6 bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Key Features of Entra Agent ID
                </h4>
                <ul className="space-y-2">
                  {[
                    'Centralized agent identity management',
                    'Lifecycle automation and orchestration',
                    'Granular permission and role assignment',
                    'Real-time activity monitoring and alerts',
                    'Compliance reporting and audit trails',
                    'Integration with security tools',
                  ].map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                      <Shield className="w-3 h-3 text-purple-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 flex items-center justify-center">
              <Users className="w-full h-full text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Identity and Access</h1>
              <p className="text-gray-400">
                AI Agent Lifecycle Management and Governance
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
