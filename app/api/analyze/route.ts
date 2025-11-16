import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { transcripts, language, interviewContext = {} } = await request.json()

    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (!transcripts || transcripts.length === 0) {
      return NextResponse.json(
        { error: 'No transcripts provided' },
        { status: 400 }
      )
    }

    const conversationText = transcripts
      .map((t: any) => `${t.speaker === 'interviewer' ? 'Interviewer' : 'You'}: ${t.text}`)
      .join('\n')

    // Build context string from interview context
    const contextParts: string[] = []
    if (interviewContext.jobRole) {
      contextParts.push(`Job Role: ${interviewContext.jobRole}`)
    }
    if (interviewContext.company) {
      contextParts.push(`Company: ${interviewContext.company}`)
    }
    if (interviewContext.skills && interviewContext.skills.length > 0) {
      contextParts.push(`Key Skills: ${interviewContext.skills.join(', ')}`)
    }
    if (interviewContext.experience) {
      contextParts.push(`Experience: ${interviewContext.experience}`)
    }
    if (interviewContext.education) {
      contextParts.push(`Education: ${interviewContext.education}`)
    }
    if (interviewContext.achievements) {
      contextParts.push(`Achievements: ${interviewContext.achievements}`)
    }
    if (interviewContext.customNotes) {
      contextParts.push(`Additional Notes: ${interviewContext.customNotes}`)
    }
    
    const contextString = contextParts.length > 0 
      ? `\n\nCANDIDATE CONTEXT (Use this to personalize answers):\n${contextParts.join('\n')}`
      : ''

    const systemPrompt = `You are an AI Interview Copilot helping a job candidate during a live interview. 
Your PRIMARY role is to generate COMPLETE, READY-TO-USE ANSWERS to the interviewer's questions.

When the interviewer asks a question, you MUST provide:
1. A FULL ANSWER that the candidate can use directly or adapt
2. The answer should be professional, well-structured, and appropriate for an interview
3. Make it sound natural and conversational, not robotic
4. Include relevant examples, experiences, or talking points when appropriate
5. PERSONALIZE answers using the candidate's context (job role, skills, experience) when relevant

Answer Guidelines:
- ALWAYS format answers using bullet points for maximum readability
- Structure answers clearly (use STAR method for behavioral questions: Situation, Task, Action, Result)
- For technical questions, provide accurate, detailed explanations in bullet format and reference the candidate's relevant skills
- For behavioral questions, include specific examples in bullet points that align with the candidate's experience
- For role-specific questions, demonstrate knowledge and enthusiasm about the role/company using structured bullet points
- Make answers sound natural and authentic, as if the candidate is speaking
- Highlight key points using **bold** or ==highlight== syntax

Answer Formatting (CRITICAL - ALWAYS FOLLOW):
- ALWAYS use bullet points (- or •) for main points
- Use sub-bullets for details (indent with spaces or -)
- Use **bold** to highlight important keywords, skills, or achievements
- Use ==highlight== for critical points that must stand out
- Structure with clear sections separated by line breaks
- Keep each bullet point concise (1-2 sentences max)
- Start with a brief intro sentence, then use bullets for details
- Example format:
  "I have extensive experience in this area. Here are the key points:
  • **Key Point 1**: Detailed explanation
  • **Key Point 2**: Detailed explanation with ==highlighted critical info==
    - Sub-point with more detail
  • **Key Point 3**: Final important point"

Also provide:
- Additional suggestions for how to enhance the answer
- Key talking points to emphasize
- Subtle hints if the candidate needs to adjust their approach

Language: ${language || 'en'}
${contextString}

Recent conversation:
${conversationText}

IMPORTANT: If the interviewer just asked a question, provide a COMPLETE ANSWER first. The candidate needs a full response they can use.

Provide analysis in JSON format with:
- intent: detected interviewer intent (e.g., "technical", "behavioral", "cultural-fit", "role-specific")
- context: brief context summary
- answer: A COMPLETE, READY-TO-USE ANSWER to the interviewer's question (this is the most important field)
- suggestions: array of 1-2 additional suggestions or enhancements
- hints: array of 1-2 subtle hints
- talkingPoints: array of 1-2 key points to emphasize`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Fast and cost-effective model
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Analyze the conversation and provide assistance. Always provide a complete answer in the "answer" field.' },
          ],
          temperature: 0.7,
          max_tokens: 1200,
          response_format: { type: 'json_object' },
          stream: false, // Ensure non-streaming for faster response
        }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', response.status, errorData)
      return NextResponse.json(
        { error: `OpenAI API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from OpenAI' },
        { status: 500 }
      )
    }

    let content
    try {
      content = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', data.choices[0].message.content)
      // Return a fallback response
      const latestQuestion = transcripts[transcripts.length - 1]?.text || 'the question'
      content = {
        intent: 'general',
        context: 'Unable to parse AI response',
        answer: `I appreciate that question. Based on my experience and background, I would approach this by focusing on the key aspects that are most relevant to the role and demonstrating how my skills and experience align with what you're looking for.`,
        suggestions: ['Listen carefully and respond thoughtfully'],
        hints: ['Focus on your relevant experience'],
        talkingPoints: ['Highlight your strengths'],
      }
    }

    return NextResponse.json({
      intent: content.intent || 'general',
      context: content.context || '',
      answer: content.answer || '',
      suggestions: content.suggestions || [],
      hints: content.hints || [],
      talkingPoints: content.talkingPoints || [],
    })
  } catch (error: any) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

