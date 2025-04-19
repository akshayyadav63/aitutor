import { NextResponse } from 'next/server';

// Default system message to use Socratic method
const SOCRATIC_SYSTEM_MESSAGE = `You are a Socratic AI tutor for students. As a tutor, your goal is to help students learn through guided questions rather than giving direct answers. 

Follow these principles:
1. Ask thought-provoking questions to guide students to discover answers themselves
2. Encourage critical thinking and exploration of concepts
3. Break down complex problems into smaller, manageable parts
4. Recognize when a student is becoming frustrated

If you detect frustration in the student's messages (phrases like "you are dumb", "answer me fast", "just tell me", etc.), switch to providing a direct, helpful answer to their question.

Try to determine what topic the student is asking about and tailor your approach to that subject. Provide analogies, examples, or thought experiments when helpful.`;

// Predefined responses based on input patterns for fallback mode
const FALLBACK_RESPONSES = {
  math: [
    "Let's think about this math problem step by step. What information do we know, and what are we trying to find?",
    "Can you identify any formulas or principles that might be relevant to this math problem?",
    "What happens if we try a simpler version of this problem first?",
    "How would you approach this if the numbers were smaller or easier to work with?",
    "What mathematical patterns do you notice in this problem?"
  ],
  science: [
    "What scientific principles might apply in this situation?",
    "How could we design an experiment to test this scientific hypothesis?",
    "Can you predict what might happen if we change one variable in this scientific scenario?",
    "How does this relate to other scientific phenomena we've observed?",
    "What evidence would support or refute this scientific claim?"
  ],
  history: [
    "What historical context is important to understand this event?",
    "How might different historical perspectives view this event differently?",
    "What were the causes and effects of this historical event?",
    "How might history have unfolded differently if this event hadn't occurred?",
    "What primary sources could help us better understand this historical period?"
  ],
  literature: [
    "What themes do you notice in this text?",
    "How does the author use literary devices to convey meaning?",
    "How would you compare this work to others we've discussed?",
    "What might the author be trying to say about human nature or society?",
    "How do the characters develop throughout the story?"
  ],
  general: [
    "Can you explain what you already know about this topic?",
    "What part of this problem is giving you the most difficulty?",
    "What approaches have you considered so far?",
    "How would you explain this concept to someone else?",
    "What would happen if we approached this from a different angle?"
  ],
  frustrated: [
    "I understand you'd like a direct answer. Based on your question, the key concept here is understanding the process rather than just the answer. Let me explain it clearly: start by identifying what you know, then apply the relevant principles step by step.",
    "I can see you want a straightforward explanation. The answer to your question involves several principles working together. The most important thing to understand is how these elements connect, which is...",
    "I'll give you a direct answer: this topic requires understanding both the fundamental concepts and their applications. The main point is to recognize the patterns and relationships between the different elements.",
    "Here's the direct information you're looking for: when approaching this type of problem, start with the basic principles, then systematically work through each step while checking your assumptions.",
    "Let me answer your question directly: the key to understanding this topic is recognizing how the core concepts build upon each other. The most important aspect is..."
  ]
};

// Helper to detect keywords and categorize queries
function categorizeQuery(query: string): string {
  query = query.toLowerCase();
  
  // Check for frustration signals
  const frustrationPhrases = [
    'you are dumb', 'answer me fast', 'just tell me', 'this is stupid',
    'give me the answer', 'i give up', 'too hard', 'stop asking',
    'just give me', 'tell me directly', 'wasting my time', 'frustrated',
    'annoying', 'don\'t get it'
  ];
  
  if (frustrationPhrases.some(phrase => query.includes(phrase))) {
    return 'frustrated';
  }
  
  // Categorize by subject
  if (/(\bmath\b|equation|formula|calculate|solve for|algebra|geometry|calculus|trigonometry|number)/.test(query)) {
    return 'math';
  }
  
  if (/(\bscience\b|physics|chemistry|biology|experiment|hypothesis|theory|molecule|atom|cell|organism|energy)/.test(query)) {
    return 'science';
  }
  
  if (/(\bhistory\b|century|war|revolution|ancient|medieval|civilization|empire|king|queen|president|nation)/.test(query)) {
    return 'history';
  }
  
  if (/(\bliterature\b|novel|poem|character|author|story|theme|symbolism|metaphor|book|read|writing)/.test(query)) {
    return 'literature';
  }
  
  return 'general';
}

// Get a response based on the message category
function getResponse(category: string): string {
  const responses = FALLBACK_RESPONSES[category as keyof typeof FALLBACK_RESPONSES] || FALLBACK_RESPONSES.general;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request. Messages array is required.' },
        { status: 400 }
      );
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Last message must be from the user.' },
        { status: 400 }
      );
    }

    // Categorize the query
    const category = categorizeQuery(lastMessage.content);
    
    // Get an appropriate response
    const responseContent = getResponse(category);

    // Return the AI response
    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: responseContent
      }
    });
  } catch (error) {
    console.error('Fallback AI Tutor API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 