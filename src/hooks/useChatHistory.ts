import { useEffect, useState, useCallback } from 'react'

interface UseChatHistoryProps {
  maxHistory?: number
  onHistoryNavigate?: (value: string) => void
}

export function useChatHistory({ 
  maxHistory = 80,
  onHistoryNavigate 
}: UseChatHistoryProps = {}) {
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [tempInput, setTempInput] = useState<string>('')

  // Add a new message to history
  const addToHistory = useCallback((message: string) => {
    if (!message.trim()) return
    
    setHistory((prev) => {
      const newHistory = [message, ...prev]
      // Keep only the last maxHistory messages
      return newHistory.slice(0, maxHistory)
    })
    // Reset index after adding
    setHistoryIndex(-1)
    setTempInput('')
  }, [maxHistory])

  // Navigate through history
  const navigateHistory = useCallback((direction: 'up' | 'down', currentInput: string) => {
    if (history.length === 0) return null

    let newIndex = historyIndex

    if (direction === 'up') {
      // Moving backward in history (older messages)
      if (historyIndex === -1) {
        // Starting navigation, save current input
        setTempInput(currentInput)
        newIndex = 0
      } else if (historyIndex < history.length - 1) {
        newIndex = historyIndex + 1
      }
    } else {
      // Moving forward in history (newer messages)
      if (historyIndex > 0) {
        newIndex = historyIndex - 1
      } else if (historyIndex === 0) {
        // Return to current input
        newIndex = -1
        setHistoryIndex(-1)
        return tempInput
      }
    }

    setHistoryIndex(newIndex)
    return newIndex === -1 ? tempInput : history[newIndex]
  }, [history, historyIndex, tempInput])

  // Reset navigation state
  const resetNavigation = useCallback(() => {
    setHistoryIndex(-1)
    setTempInput('')
  }, [])

  return {
    history,
    addToHistory,
    navigateHistory,
    resetNavigation,
    historyIndex,
  }
}
