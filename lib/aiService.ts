import { TranscriptEntry, AIResponse } from './store'

interface AnalysisResult {
  intent: string
  context: string
  answer: string
  suggestions: string[]
  hints: string[]
  talkingPoints: string[]
}

export class AIService {
  private conversationHistory: TranscriptEntry[] = []
  private readonly maxHistoryLength = 20

  async analyzeConversation(
    transcripts: TranscriptEntry[],
    language: string = 'en',
    interviewContext?: any
  ): Promise<AIResponse[]> {
    // Update conversation history
    this.conversationHistory = transcripts.slice(-this.maxHistoryLength)

    // Get the latest transcript entry
    const latestEntry = transcripts[transcripts.length - 1]
    if (!latestEntry) {
      return []
    }

    // Only analyze when interviewer speaks (or if we have no speaker info yet)
    if (latestEntry.speaker === 'applicant' && transcripts.length > 1) {
      return []
    }

    try {
      const analysis = await this.getAIAnalysis(transcripts, language, interviewContext)
      const responses: AIResponse[] = []

      // Prioritize full answer - this is what the user wants
      if (analysis.answer && analysis.answer.trim()) {
        responses.push({
          id: `answer-${Date.now()}`,
          type: 'answer',
          content: analysis.answer,
          timestamp: Date.now(),
          confidence: 0.9,
        })
      }

      // Add suggestions as secondary
      if (analysis.suggestions && analysis.suggestions.length > 0) {
        responses.push({
          id: `suggestion-${Date.now()}`,
          type: 'suggestion',
          content: analysis.suggestions[0],
          timestamp: Date.now(),
          confidence: 0.8,
        })
      }

      if (analysis.hints && analysis.hints.length > 0) {
        responses.push({
          id: `hint-${Date.now()}`,
          type: 'hint',
          content: analysis.hints[0],
          timestamp: Date.now(),
          confidence: 0.7,
        })
      }

      if (analysis.talkingPoints && analysis.talkingPoints.length > 0) {
        responses.push({
          id: `talking-point-${Date.now()}`,
          type: 'talking-point',
          content: analysis.talkingPoints[0],
          timestamp: Date.now(),
          confidence: 0.75,
        })
      }

      return responses
    } catch (error) {
      console.error('AI analysis error:', error)
      // Return a fallback answer
      const fallbackAnswer = latestEntry.speaker === 'interviewer' 
        ? "I appreciate that question. Based on my experience and background, I would approach this by focusing on the key aspects that are most relevant to the role and demonstrating how my skills align with what you're looking for."
        : ''
      
      if (fallbackAnswer) {
        return [{
          id: `answer-fallback-${Date.now()}`,
          type: 'answer',
          content: fallbackAnswer,
          timestamp: Date.now(),
          confidence: 0.5,
        }]
      }
      return []
    }
  }

  private async getAIAnalysis(
    transcripts: TranscriptEntry[],
    language: string,
    interviewContext?: any
  ): Promise<AnalysisResult> {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcripts,
          language: language || 'en',
          interviewContext: interviewContext || {},
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(errorData.error || `API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        intent: data.intent || 'general',
        context: data.context || '',
        answer: data.answer || '',
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
        hints: Array.isArray(data.hints) ? data.hints : [],
        talkingPoints: Array.isArray(data.talkingPoints) ? data.talkingPoints : [],
      }
    } catch (error: any) {
      console.error('API call failed:', error)
      
      // Return fallback response with a basic answer
      const latestQuestion = transcripts[transcripts.length - 1]?.text || ''
      const isQuestion = latestQuestion.includes('?') || 
                         ['what', 'why', 'how', 'when', 'where', 'who', 'tell me', 'describe', 'explain']
                           .some(word => latestQuestion.toLowerCase().includes(word))
      
      return {
        intent: 'general',
        context: 'Fallback response due to API error',
        answer: isQuestion 
          ? "I appreciate that question. Based on my experience and background, I would approach this by focusing on the key aspects that are most relevant to the role and demonstrating how my skills and experience align with what you're looking for."
          : '',
        suggestions: ['Ensure your answer is clear and concise'],
        hints: ['Focus on your relevant experience'],
        talkingPoints: ['Highlight your strengths and achievements'],
      }
    }
  }

  detectSpeaker(text: string, previousSpeaker: 'interviewer' | 'applicant'): 'interviewer' | 'applicant' {
    // Simple heuristic: if text contains question words, likely interviewer
    const questionWords = ['what', 'why', 'how', 'when', 'where', 'who', 'tell me', 'describe', 'explain']
    const lowerText = text.toLowerCase()
    
    if (questionWords.some(word => lowerText.includes(word)) && lowerText.includes('?')) {
      return 'interviewer'
    }
    
    // Default to interviewer if previous was applicant, and vice versa
    return previousSpeaker === 'interviewer' ? 'applicant' : 'interviewer'
  }
}

export const aiService = new AIService()

