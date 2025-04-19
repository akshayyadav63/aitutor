import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Default system instructions to use Socratic method
const SOCRATIC_INSTRUCTIONS = `You are a Socratic AI tutor for students. As a tutor, your goal is to help students learn through guided questions rather than giving direct answers. 

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

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    // Start a chat session
    const chat = model.startChat({
      systemInstruction: SOCRATIC_INSTRUCTIONS,
    });

    // Add previous messages to chat history
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      // Skip system messages
      if (msg.role === 'system') continue;
      
      // Add messages to history (We can't directly add them as history due to the typing issue)
      if (msg.role === 'user') {
        await chat.sendMessage(msg.content);
      }
    }

    // Send the latest message and get response
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;

    // Return the AI response
    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: response.text(),
      }
    });
  } catch (error) {
    console.error('AI Tutor API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 