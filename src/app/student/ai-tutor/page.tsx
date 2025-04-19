'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import ThemeSelector from '../../components/ThemeSelector';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  assistant?: 'tutor' | 'buddy';
}

// Frustration detection function
const detectFrustration = (text: string): boolean => {
  const frustrationPhrases = [
    'you are dumb',
    'answer me fast',
    'just tell me',
    'this is stupid',
    'give me the answer',
    'i give up',
    'this is too hard',
    'stop asking questions',
    'just give me the answer',
    'tell me directly',
    'stop wasting my time',
    'i\'m frustrated',
    'this is annoying',
    'i don\'t get it'
  ];
  
  return frustrationPhrases.some(phrase => 
    text.toLowerCase().includes(phrase.toLowerCase())
  );
};

// Sample Socratic responses for different subjects
const socraticResponses = {
  general: [
    "Can you explain what you already know about this topic?",
    "What part of this problem is giving you the most difficulty?",
    "What approaches have you considered so far?",
    "Can you break this problem down into smaller steps?",
    "How would you explain this concept to someone else?",
    "Can you think of any similar problems you've solved before?",
    "What information would help you solve this problem?",
    "What assumptions are you making here?",
    "What would happen if we approached this from a different angle?"
  ],
  math: [
    "What formulas or principles might be relevant to this problem?",
    "Can you visualize this problem in a different way?",
    "What happens if you try a simpler version of this problem first?",
    "Can you identify any patterns in the given information?",
    "What properties of these numbers/shapes/equations could be useful?"
  ],
  science: [
    "What scientific principles might apply in this situation?",
    "How could we design an experiment to test this?",
    "Can you predict what might happen if we change one variable?",
    "How does this relate to other phenomena we've observed?",
    "What evidence would support or refute this hypothesis?"
  ]
};

export default function AiTutor() {
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your AI tutor. I'm here to help you learn through guided questions rather than giving direct answers. What topic or problem would you like to explore today?",
      assistant: 'tutor'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<'tutor' | 'buddy'>('tutor');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Check for frustration
    const frustrated = detectFrustration(input);
    
    // Start loading
    setIsLoading(true);
    
    // Prepare messages for API
    const apiMessages = messages
      .filter(msg => msg.role !== 'system' && (msg.assistant === activeAssistant || msg.role === 'user'))
      .concat(userMessage);
    
    // Define API endpoints based on assistant type
    const apiEndpoints = activeAssistant === 'tutor' 
      ? [
          '/api/google-ai-tutor',  // Try Google AI first for tutor
          '/api/ai-tutor',         // Then try OpenAI for tutor
          '/api/fallback-ai-tutor' // Finally use our fallback option for tutor
        ]
      : [
          '/api/buddy-ai',         // Try Google AI first for buddy
          '/api/fallback-ai-tutor' // Use fallback for buddy
        ];
    
    // Try each endpoint until one succeeds
    let succeeded = false;
    
    for (const endpoint of apiEndpoints) {
      if (succeeded) break;
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages,
          }),
        });

        if (!response.ok) {
          continue; // Try the next endpoint
        }

        const data = await response.json();
        
        // Add AI response
        if (data.message) {
          setMessages(prev => [...prev, {
            role: data.message.role || 'assistant',
            content: data.message.content,
            assistant: activeAssistant
          }]);
          succeeded = true;
        }
      } catch (error) {
        console.error(`Error with AI assistant endpoint ${endpoint}:`, error);
        // Continue to next endpoint
      }
    }
    
    // If all endpoints failed, add a fallback message
    if (!succeeded) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: activeAssistant === 'tutor'
          ? (frustrated 
              ? "I understand your frustration. To answer your question directly: you should focus on understanding the core principles first, then apply them to your specific problem. Let's break it down step by step in a more straightforward way."
              : "I'll help you work through this. What specific part of the problem are you struggling with? Let's approach it methodically.")
          : "Based on your question, here's what you need to know: The key concepts involved are interrelated and build on fundamental principles. I'd need more specific details to give you a complete answer, but I hope this helps you get started.",
        assistant: activeAssistant
      }]);
    }
    
    // Clear input and stop loading
    setInput('');
    setIsLoading(false);
  };

  const switchAssistant = (assistant: 'tutor' | 'buddy') => {
    if (activeAssistant !== assistant) {
      setActiveAssistant(assistant);
      
      // Add a transition message from the new assistant
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistant === 'tutor' 
          ? "I'm your Socratic Tutor now. I'll guide your learning through questions to help you discover answers for yourself. What would you like to explore?"
          : "Hi there! I'm Buddy, your direct-answer assistant. I'll give you straightforward explanations without the Socratic method. How can I help you today?",
        assistant: assistant
      }]);
    }
  };

  return (
    <div className={`min-h-screen ${colors.background} flex flex-col`}>
      {/* Header */}
      <header className={`${colors.card} shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${colors.text}`}>AI Learning Assistant</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></span>
              <span className={`text-sm ${colors.text}`}>{isLoading ? 'Thinking...' : 'Online'}</span>
            </div>
            <ThemeSelector />
            <Link href="/student/dashboard" className={`text-blue-600 hover:text-blue-800`}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Assistant Switcher */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-2 md:space-x-4">
          <button
            onClick={() => switchAssistant('tutor')}
            className={`flex-1 px-4 py-2 rounded-t-lg font-medium text-sm md:text-base transition-colors ${
              activeAssistant === 'tutor' 
                ? `${colors.primary} ${colors.buttonText}` 
                : `bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300`
            }`}
          >
            Socratic Tutor
          </button>
          <button
            onClick={() => switchAssistant('buddy')}
            className={`flex-1 px-4 py-2 rounded-t-lg font-medium text-sm md:text-base transition-colors ${
              activeAssistant === 'buddy' 
                ? `${colors.secondary} ${colors.buttonText}` 
                : `bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300`
            }`}
          >
            Buddy (Direct Answers)
          </button>
        </div>
      </div>

      {/* Chat interface */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col">
        <div className={`${colors.card} rounded-lg shadow flex-1 flex flex-col overflow-hidden`}>
          {/* Mode indicator */}
          <div className={`px-4 py-2 text-sm ${activeAssistant === 'tutor' ? colors.accent : `bg-${colors.secondary.replace('bg-', '')}/20`} ${colors.text}`}>
            {activeAssistant === 'tutor' 
              ? 'Socratic Tutor: Guiding your learning through questions and exploration' 
              : 'Buddy: Providing direct, straightforward answers to your questions'}
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              // Skip messages from the non-active assistant
              if (message.role === 'assistant' && message.assistant !== activeAssistant) {
                return null;
              }
              
              return (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? `${colors.userMessage} ${colors.userMessageText}` 
                        : `${colors.aiMessage} ${colors.aiMessageText}`
                    }`}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your question..."
                disabled={isLoading}
                className={`flex-1 px-4 py-2 border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${colors.inputBg} ${colors.inputText}`}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 ${activeAssistant === 'tutor' ? colors.primary : colors.secondary} ${colors.buttonText} rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
            <p className={`mt-2 text-xs ${colors.text}`}>
              {activeAssistant === 'tutor'
                ? 'The Socratic Tutor will guide your learning through questions. If you get frustrated, it will detect this and provide more direct answers.'
                : 'Buddy will give you direct, straightforward answers to your questions without the Socratic method.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 