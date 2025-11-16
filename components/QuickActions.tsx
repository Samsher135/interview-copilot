'use client'

import { useInterviewStore } from '@/lib/store'
import { Copy, Download, Share2 } from 'lucide-react'
import { useState } from 'react'

export function QuickActions() {
  const { transcripts, aiResponses } = useInterviewStore()
  const [copied, setCopied] = useState(false)

  const handleCopyTranscripts = async () => {
    const text = transcripts
      .map(t => `${t.speaker === 'interviewer' ? 'Interviewer' : 'You'}: ${t.text}`)
      .join('\n\n')
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDownload = () => {
    const data = {
      transcripts: transcripts.map(t => ({
        speaker: t.speaker,
        text: t.text,
        timestamp: new Date(t.timestamp).toISOString(),
      })),
      aiResponses: aiResponses.map(r => ({
        type: r.type,
        content: r.content,
        timestamp: new Date(r.timestamp).toISOString(),
      })),
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interview-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (transcripts.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopyTranscripts}
        className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors touch-manipulation"
        title="Copy transcripts"
      >
        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors touch-manipulation"
        title="Download interview data"
      >
        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
        Download
      </button>
    </div>
  )
}

