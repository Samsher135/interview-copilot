'use client'

import { useState } from 'react'
import { useInterviewStore } from '@/lib/store'
import { aiService } from '@/lib/aiService'
import { MessageSquare, Send, X } from 'lucide-react'

export function ManualTranscriptInput() {
  const { 
    addTranscript, 
    addAIResponse, 
    currentLanguage, 
    interviewContext,
    setIsAnalyzing,
    setError,
  } = useInterviewStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [speaker, setSpeaker] = useState<'interviewer' | 'applicant'>('interviewer')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const entry = {
      id: `manual-${Date.now()}-${Math.random()}`,
      speaker,
      text: text.trim(),
      timestamp: Date.now(),
    }

    addTranscript(entry)

    // Trigger AI analysis
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const currentTranscripts = useInterviewStore.getState().transcripts
      const responses = await aiService.analyzeConversation(
        [...currentTranscripts, entry],
        currentLanguage.split('-')[0],
        interviewContext
      )

      if (responses.length > 0) {
        responses.forEach((response) => {
          addAIResponse(response)
        })
      }
    } catch (error: any) {
      console.error('Analysis error:', error)
      setError(error.message || 'Failed to analyze conversation.')
    } finally {
      setIsAnalyzing(false)
    }

    setText('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 touch-manipulation"
        title="Add manual transcript"
        aria-label="Add manual transcript"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Add Manual Transcript
        </h3>
        <button
          onClick={() => {
            setIsOpen(false)
            setText('')
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSpeaker('interviewer')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              speaker === 'interviewer'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Interviewer
          </button>
          <button
            type="button"
            onClick={() => setSpeaker('applicant')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              speaker === 'applicant'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            You
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste transcript here..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          autoFocus
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors touch-manipulation"
        >
          <Send className="w-4 h-4" />
          Add & Analyze
        </button>
      </form>
    </div>
  )
}

