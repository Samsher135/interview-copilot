'use client'

import { useEffect } from 'react'
import { useInterviewStore } from '@/lib/store'
import { QuickActions } from './QuickActions'
import { Mic, MicOff, Trash2 } from 'lucide-react'

export function ControlPanel() {
  const {
    isListening,
    isAnalyzing,
    setIsListening,
    clearTranscripts,
    clearResponses,
  } = useInterviewStore()

  // Keyboard shortcut: Space to toggle listening
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only if not typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        setIsListening(!isListening)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isListening, setIsListening])

  const handleToggleListening = () => {
    setIsListening(!isListening)
  }

  const handleClear = () => {
    if (confirm('Clear all transcripts and responses?')) {
      clearTranscripts()
      clearResponses()
    }
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleToggleListening}
          className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-white transition-all transform active:scale-95 shadow-lg ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              <span className="hidden sm:inline">Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span className="hidden sm:inline">Start</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-red-700 dark:text-red-400">Live</span>
            </div>
          )}
          {isAnalyzing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">AI Thinking</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <QuickActions />
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

