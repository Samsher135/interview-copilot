# AI Interview Copilot

A web-based AI Interview Copilot application that listens to live conversations between interviewers and applicants, analyzes the discussion in real-time, and provides intelligent responses and suggestions.

## Features

- 🎤 **Real-time Audio Transcription**: Continuously transcribes spoken dialogue from both parties using Web Speech API
- 🤖 **AI-Powered Analysis**: Detects interviewer intent (evaluation, follow-up questions, role-specific topics)
- 💡 **Intelligent Responses**: Generates contextual and professional suggestions, hints, and talking points
- 🌍 **Multi-language Support**: Supports transcription and response generation in multiple languages
- 🔊 **Auto-Speak**: Optional text-to-speech for AI responses
- 🎨 **Modern UI**: Clean, responsive interface with dark mode support

## Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key (for AI analysis and response generation)
- Modern browser with Web Speech API support (Chrome, Edge, or Safari recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd interview-copilot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_AUTO_SPEAK=false
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Start Listening**: Click the "Start Listening" button to begin transcription
2. **Select Language**: Choose your preferred language from the dropdown
3. **View Transcripts**: See real-time transcriptions of both interviewer and applicant speech
4. **AI Suggestions**: View AI-generated suggestions, hints, and talking points in the right panel
5. **Auto-Speak**: Enable auto-speak to have AI suggestions read aloud automatically
6. **Manual Speak**: Click the speaker icon on any response to hear it spoken

## Supported Languages

- English (US/UK)
- Spanish
- French
- German
- Italian
- Portuguese
- Japanese
- Chinese (Simplified)
- Korean

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Safari
- ⚠️ Firefox (limited support)
- ❌ Other browsers may not support Web Speech API

## Project Structure

```
interview-copilot/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── InterviewCopilot.tsx # Main component
│   ├── AudioTranscriber.tsx # Speech recognition
│   ├── ControlPanel.tsx     # Control buttons
│   ├── TranscriptPanel.tsx  # Transcript display
│   └── ResponsePanel.tsx   # AI responses display
├── lib/
│   ├── store.ts            # Zustand state management
│   └── aiService.ts         # OpenAI integration
└── package.json
```

## Configuration

### Environment Variables

- `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key (required)
- `NEXT_PUBLIC_AUTO_SPEAK`: Enable/disable auto-speak by default (optional, default: false)

### Customization

You can customize the AI behavior by modifying the system prompt in `lib/aiService.ts`. The prompt controls how the AI analyzes conversations and generates responses.

## Security Notes

- Never commit your `.env.local` file or API keys to version control
- The OpenAI API key is exposed to the client-side (NEXT_PUBLIC_ prefix), so consider using a proxy API route for production
- For production, implement rate limiting and API key protection

## Troubleshooting

### Speech Recognition Not Working

- Ensure you're using a supported browser (Chrome/Edge/Safari)
- Check microphone permissions in your browser settings
- Make sure you're using HTTPS (required for microphone access in most browsers)
- Try refreshing the page and allowing microphone access when prompted

### AI Responses Not Appearing

- **Check API Key**: Verify your OpenAI API key is correctly set in `.env.local`
  - The key should start with `sk-`
  - Make sure there are no extra spaces or quotes
  - Restart the dev server after changing `.env.local`
  
- **Check Browser Console**: Open Developer Tools (F12) and check for errors
  - Look for API errors or network failures
  - Check if the `/api/analyze` endpoint is being called
  
- **Verify API Credits**: Ensure you have sufficient OpenAI API credits
  - Check your OpenAI dashboard at https://platform.openai.com
  
- **Check Network**: Ensure you have internet connection
  - The app needs to connect to OpenAI's API

### Common Issues

1. **"OpenAI API key not configured" error**
   - Make sure `.env.local` exists in the root directory
   - Verify the variable name is exactly `NEXT_PUBLIC_OPENAI_API_KEY`
   - Restart the dev server: `npm run dev`

2. **No answers appearing when interviewer speaks**
   - Check if transcripts are appearing (if not, microphone issue)
   - Look for error messages in the error display (top-right)
   - Check browser console for detailed errors

3. **API errors (401, 403, 429)**
   - 401: Invalid API key - check your key
   - 403: API key doesn't have access - check your OpenAI account
   - 429: Rate limit exceeded - wait a moment and try again

4. **"Analyzing..." but no results**
   - Check browser console for errors
   - Verify API key is valid
   - Check network tab to see if API calls are failing

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

