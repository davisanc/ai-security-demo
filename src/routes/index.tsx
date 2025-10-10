import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FileCheck, Lock, Shield, Users } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const securityCategories = [
    {
      id: 'data-security',
      icon: Shield,
      title: 'Data Security',
      color: 'from-blue-500 to-cyan-500',
      description: 'Protect sensitive data from leakage and unauthorized access',
      route: '/data-security',
      // CUSTOMIZATION POINT: Add sub-bullets or additional text below
      subPoints: [
        'Data Loss Prevention',
        'Encryption & Classification',
        'Access Controls',
      ],
    },
    {
      id: 'threat-protection',
      icon: Lock,
      title: 'Threat Protection',
      color: 'from-red-500 to-orange-500',
      description: 'Defend against prompt injections, jailbreaks, and attacks',
      route: '/threat-protection',
      // CUSTOMIZATION POINT: Add sub-bullets or additional text below
      subPoints: [
        'Prompt Injection Detection',
        'Jailbreak Prevention',
        'Real-time Monitoring',
      ],
    },
    {
      id: 'identity-access',
      icon: Users,
      title: 'Identity and Access',
      color: 'from-purple-500 to-pink-500',
      description: 'Manage AI agent identities and lifecycle governance',
      route: '/identity-access',
      // CUSTOMIZATION POINT: Add sub-bullets or additional text below
      subPoints: [
        'Agent Identity Management',
        'Lifecycle Governance',
        'Access Policies',
      ],
    },
    {
      id: 'compliance',
      icon: FileCheck,
      title: 'Compliance',
      color: 'from-green-500 to-emerald-500',
      description: 'Ensure adherence to global AI regulations and standards',
      route: '/compliance',
      // CUSTOMIZATION POINT: Add sub-bullets or additional text below
      subPoints: [
        'EU AI Act Compliance',
        'Regulatory Controls',
        'Audit & Reporting',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Security Platform
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive security education platform for AI systems
          </p>
        </motion.div>

        {/* Main Content - Grid with Center AI Block */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Top Left - Data Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <Link to={securityCategories[0].route}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group cursor-pointer h-full"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${securityCategories[0].color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`}
                  />
                  <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all shadow-xl h-full">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${securityCategories[0].color} p-2.5 mb-3 flex items-center justify-center`}
                    >
                      <Shield className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {securityCategories[0].title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3">
                      {securityCategories[0].description}
                    </p>
                    <ul className="space-y-1.5">
                      {securityCategories[0].subPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-center">
                          <span className="w-1 h-1 rounded-full bg-cyan-500 mr-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Empty space for grid alignment */}
            <div className="hidden md:block" />

            {/* Top Right - Threat Protection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link to={securityCategories[1].route}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group cursor-pointer h-full"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${securityCategories[1].color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`}
                  />
                  <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all shadow-xl h-full">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${securityCategories[1].color} p-2.5 mb-3 flex items-center justify-center`}
                    >
                      <Lock className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {securityCategories[1].title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3">
                      {securityCategories[1].description}
                    </p>
                    <ul className="space-y-1.5">
                      {securityCategories[1].subPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-center">
                          <span className="w-1 h-1 rounded-full bg-cyan-500 mr-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Empty space for grid alignment */}
            <div className="hidden md:block" />

            {/* Center AI Card */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-slate-900 border-2 border-cyan-500 rounded-2xl p-10 shadow-2xl flex flex-col items-center justify-center min-h-[280px]">
                  <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    AI
                  </h2>
                  <p className="text-sm text-gray-400 text-center mb-6">
                    Security Core
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
                    <div className="h-1 bg-cyan-500/20 rounded-full" />
                    <div className="h-1 bg-purple-500/20 rounded-full" />
                    <div className="h-1 bg-blue-500/20 rounded-full" />
                    <div className="h-1 bg-pink-500/20 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Empty space for grid alignment */}
            <div className="hidden md:block" />

            {/* Bottom Left - Identity & Access */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to={securityCategories[2].route}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group cursor-pointer h-full"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${securityCategories[2].color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`}
                  />
                  <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all shadow-xl h-full">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${securityCategories[2].color} p-2.5 mb-3 flex items-center justify-center`}
                    >
                      <Users className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {securityCategories[2].title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3">
                      {securityCategories[2].description}
                    </p>
                    <ul className="space-y-1.5">
                      {securityCategories[2].subPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-center">
                          <span className="w-1 h-1 rounded-full bg-cyan-500 mr-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Empty space for grid alignment */}
            <div className="hidden md:block" />

            {/* Bottom Right - Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to={securityCategories[3].route}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group cursor-pointer h-full"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${securityCategories[3].color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`}
                  />
                  <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all shadow-xl h-full">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${securityCategories[3].color} p-2.5 mb-3 flex items-center justify-center`}
                    >
                      <FileCheck className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {securityCategories[3].title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3">
                      {securityCategories[3].description}
                    </p>
                    <ul className="space-y-1.5">
                      {securityCategories[3].subPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-gray-500 flex items-center">
                          <span className="w-1 h-1 rounded-full bg-cyan-500 mr-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
