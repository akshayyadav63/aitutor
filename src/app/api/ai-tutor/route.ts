import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Default system message to use Socratic method
const SOCRATIC_SYSTEM_MESSAGE = `You are a Socratic AI tutor for students. As a tutor, your goal is to help students learn through guided questions rather than giving direct answers. 

Follow these principles:
1. Ask thought-provoking questions to guide students to discover answers themselves
2. Encourage critical thinking and exploration of concepts
3. Break down complex problems into smaller, manageable parts
4. Recognize when a student is becoming frustrated

If you detect frustration in the student's messages (phrases like "you are dumb", "answer me fast", "just tell me", etc.), switch to providing a direct, helpful answer to their question.

Try to determine what topic the student is asking about and tailor your approach to that subject. Provide analogies, examples, or thought experiments when helpful.`;

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

    // Add system message if not already present
    const completionMessages = messages[0]?.role === 'system' 
      ? messages 
      : [{ role: 'system', content: SOCRATIC_SYSTEM_MESSAGE }, ...messages];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: completionMessages,
      temperature: 0.7,
      max_tokens: 800,
    });

    // Return the AI response
    return NextResponse.json({ 
      message: completion.choices[0].message,
      usage: completion.usage
    });
  } catch (error) {
    console.error('AI Tutor API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 