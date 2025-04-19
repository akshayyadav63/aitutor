# Educational Platform

An educational platform with separate faculty and student portals for knowledge management and learning.

## Features

### Student Portal
- Offline search engine for finding topics in the knowledge base
- Topic detail views with comprehensive explanations
- AI Tutor with multiple backend options (Google AI, OpenAI, and fallback solution) 
- AI Tutor follows the Socratic method, helping students learn through guided questioning
- Frustration detection: When students get frustrated, the AI switches to direct answers

### Faculty Portal
- Knowledge base management system
- Add, edit, and delete topic entries
- Each topic includes a title, detailed explanation, and optional image
- Synchronized data across faculty and student portals via shared context

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **AI Integration**: 
  - Primary: Google Generative AI (Gemini Pro)
  - Secondary: OpenAI (if available)
  - Fallback: Rule-based AI simulation
- **Data Storage**: Client-side with React Context and localStorage

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (optional - the app will work without API keys):
   - Create a `.env.local` file with your API keys:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Login Paths

- Student Login: `/student/login`
- Faculty Login: `/faculty/login`

## Knowledge Base

The knowledge base is stored in localStorage and shared between the faculty and student portals via React Context. In a production environment, this would be connected to a backend database.

## AI Tutor

The AI Tutor has a robust architecture with multiple fallback options:

1. Tries Google's Generative AI (Gemini Pro) first
2. Falls back to OpenAI if Google AI fails
3. Uses a built-in rule-based AI as the final fallback

Key features:
- Uses the Socratic teaching method to guide students with leading questions
- Frustration detection to switch to direct answers when needed
- Works offline with the rule-based fallback system
- Categorizes questions by subject to provide relevant responses

## License

MIT
