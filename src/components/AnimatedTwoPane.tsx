import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { ReactNode } from 'react'

type PaneState = 'both' | 'left' | 'right'

interface AnimatedTwoPaneProps {
  leftPane: ReactNode
  rightPane: ReactNode
  paneState: PaneState
  onLeftExpand: () => void
  onRightExpand: () => void
  onShowBoth: () => void
}

export function AnimatedTwoPane({
  leftPane,
  rightPane,
  paneState,
  onLeftExpand,
  onRightExpand,
  onShowBoth,
}: AnimatedTwoPaneProps) {
  return (
    <div className="relative h-[calc(100vh-250px)] flex gap-6">
      <AnimatePresence mode="wait">
        {/* Left Pane */}
        {paneState !== 'right' && (
          <motion.div
            key="left-pane"
            initial={false}
            animate={{
              width: paneState === 'left' ? '100%' : '48%',
              opacity: 1,
            }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden"
          >
            {leftPane}

            {/* Buttons for Left Pane */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              {paneState === 'both' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLeftExpand}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-200"
                  aria-label="Maximize left pane"
                  title="Maximize left pane"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
              )}
              {paneState === 'left' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShowBoth}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-200"
                  aria-label="Show both panes"
                  title="Show explanation pane"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Right Pane */}
        {paneState !== 'left' && (
          <motion.div
            key="right-pane"
            initial={{ opacity: 0, x: 20 }}
            animate={{
              width: paneState === 'right' ? '100%' : '48%',
              opacity: 1,
              x: 0,
            }}
            exit={{ opacity: 0, x: 20 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="relative flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden"
          >
            {rightPane}

            {/* Buttons for Right Pane */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              {paneState === 'right' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShowBoth}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-200"
                  aria-label="Show both panes"
                  title="Show chat interface"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
              )}
              {paneState === 'both' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRightExpand}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 rounded-full shadow-lg transition-all duration-200"
                  aria-label="Maximize right pane"
                  title="Maximize explanation pane"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
