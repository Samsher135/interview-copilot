import { create } from 'zustand'

export interface TranscriptEntry {
  id: string
  speaker: 'interviewer' | 'applicant' | 'system'
  text: string
  timestamp: number
}

export interface AIResponse {
  id: string
  type: 'suggestion' | 'hint' | 'talking-point' | 'answer'
  content: string
  timestamp: number
  confidence?: number
}

export interface InterviewContext {
  jobRole?: string
  company?: string
  skills?: string[]
  experience?: string
  education?: string
  achievements?: string
  customNotes?: string
}

interface InterviewState {
  isListening: boolean
  transcripts: TranscriptEntry[]
  aiResponses: AIResponse[]
  currentLanguage: string
  autoSpeak: boolean
  error: string | null
  isAnalyzing: boolean
  interviewContext: InterviewContext
  showContextModal: boolean
  
  setIsListening: (isListening: boolean) => void
  addTranscript: (entry: TranscriptEntry) => void
  addAIResponse: (response: AIResponse) => void
  setLanguage: (lang: string) => void
  setAutoSpeak: (enabled: boolean) => void
  setError: (error: string | null) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  setInterviewContext: (context: InterviewContext) => void
  setShowContextModal: (show: boolean) => void
  clearTranscripts: () => void
  clearResponses: () => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
  isListening: false,
  transcripts: [],
  aiResponses: [],
  currentLanguage: 'en-US',
  autoSpeak: false,
  error: null,
  isAnalyzing: false,
  interviewContext: {},
  showContextModal: false,
  
  setIsListening: (isListening) => set({ isListening }),
  addTranscript: (entry) => set((state) => ({
    transcripts: [...state.transcripts, entry]
  })),
  addAIResponse: (response) => set((state) => ({
    aiResponses: [...state.aiResponses, response]
  })),
  setLanguage: (lang) => set({ currentLanguage: lang }),
  setAutoSpeak: (enabled) => set({ autoSpeak: enabled }),
  setError: (error) => set({ error }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setInterviewContext: (context) => set({ interviewContext: context }),
  setShowContextModal: (show) => set({ showContextModal: show }),
  clearTranscripts: () => set({ transcripts: [] }),
  clearResponses: () => set({ aiResponses: [] }),
}))

