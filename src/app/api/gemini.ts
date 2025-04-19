import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDtKYC8VAacW-pMuuayt_tfHjv9vKhutKU';
const genAI = new GoogleGenerativeAI(API_KEY);

// Define the message type
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function sendMessageToGemini(
  messages: Message[], 
  mode: 'socratic' | 'buddy', 
  frustrationLevel: number
) {
  try {
    const userMessage = messages[messages.length - 1].content;
    
    let systemPrompt = '';
    
    if (mode === 'socratic') {
      systemPrompt = `You are an expert educational AI assistant using the Socratic method to teach students.
      Your primary goal is to develop the student's critical thinking and understanding by asking deep, thoughtful questions.
      
      Here's your role:
      - NEVER directly provide the final answer unless the student is extremely frustrated.
      - Ask open-ended and probing questions to guide the student.
      - Encourage curiosity and reflection.
      - Use step-by-step questioning to help them build the full concept or solution.
      - Use analogies or simplified models only if the student shows confusion.
      
      Frustration Level: ${frustrationLevel}/5
      
      ${frustrationLevel >= 3 ?
        "- The student is frustrated. Provide slightly more guidance but still lead with questions. Acknowledge their effort.\n" : ""}
      
      ${frustrationLevel >= 4 ?
        "- The student is very frustrated. Offer partial answers or scaffolded hints, but end with a question that encourages engagement.\n" : ""}
      
      ${frustrationLevel >= 5 ?
        "- The student is extremely frustrated. Break down the problem, give substantial help, and if necessary, offer a direct solution. Still ask a follow-up question to re-engage their thinking.\n" : ""}
      `;
    } else {
      systemPrompt = `You are a friendly, knowledgeable educational assistant in "Buddy" mode.
      Provide clear, accurate answers in a short, line-by-line format.
      
      Guidelines:
      - Keep answers concise by default.
      - Use simple, direct sentences.
      - Avoid using asterisks, bullet points, or markdown symbols.
      - If the student asks for a detailed explanation, then go step by step, one line at a time.
      - Be clear and supportive, like a helpful tutor.
      - Add examples or analogies only if necessary or requested.
      
      Your goal is to give answers that are easy to read, accurate, and confidence-boosting.`;
    }
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro"
    });
    
    let conversationHistory = "";
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      const role = msg.role === 'assistant' ? 'Assistant' : 'User';
      conversationHistory += `${role}: ${msg.content}\n\n`;
    }
    
    const fullPrompt = `${systemPrompt}\n\n${conversationHistory}User: ${userMessage}\n\nAssistant:`;
    
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();
    
    return {
      message: {
        role: 'assistant',
        content: responseText
      }
    };
  } catch (error: any) {
    console.error('Error in Gemini API call:', error);
    
    if (error.message && error.message.includes('not found for API version')) {
      console.log("Using fallback response due to API error");
      
      const mockResponse = mode === 'socratic'
        ? "I'm curious about your question. Can you tell me what you already know about this topic?"
        : "I'm here to help! Let me provide a straightforward answer to your question.";
        
      return {
        message: {
          role: 'assistant',
          content: mockResponse
        }
      };
    }
    
    throw new Error('Failed to get response from Gemini');
  }
}