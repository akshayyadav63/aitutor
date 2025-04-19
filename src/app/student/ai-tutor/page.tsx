// AILearningAssistant.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../../api/gemini';
import Link from 'next/link';

// Define types for our component
type MessageType = {
  role: 'user' | 'assistant';
  content: string;
  assistant?: 'socratic' | 'buddy';
};

// Improved frustration detection function from the second file
const detectFrustration = (text: string, currentLevel: number): number => {
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
  
  // Check if the message contains any frustration patterns
  const containsFrustration = frustrationPhrases.some(phrase => 
    text.toLowerCase().includes(phrase.toLowerCase())
  );
  
  // Increase frustration if patterns detected
  if (containsFrustration) {
    return Math.min(currentLevel + 1, 5);
  }
  
  // Decrease frustration slightly if no frustration detected
  return Math.max(currentLevel - 0.25, 0);
};

export default function AILearningAssistant() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm Buddy, your direct-answer assistant. I'll give you straightforward explanations without the Socratic method. How can I help you today?",
      assistant: 'buddy'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [mode, setMode] = useState<'socratic' | 'buddy'>('buddy');
  const [frustrationLevel, setFrustrationLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: MessageType = { role: 'user', content: input, assistant: mode };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Filter messages to only include ones relevant to current assistant mode
      const relevantMessages = messages
        .filter(msg => msg.role !== 'system' && (msg.assistant === mode || msg.role === 'user'))
        .concat(userMessage);

      // Determine frustration level based on current message (only for Socratic mode)
      const newFrustrationLevel = mode === 'socratic' ? detectFrustration(input, frustrationLevel) : 0;
      if (mode === 'socratic') {
        setFrustrationLevel(newFrustrationLevel);
      }

      // Call Gemini API
      const data = await sendMessageToGemini(relevantMessages, mode, newFrustrationLevel);
      
      // Add AI response to messages
      if (data.message && data.message.content) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message.content,
          assistant: mode
        }]);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Fallback responses based on assistant type and frustration
      const fallbackMessage = mode === 'socratic'
        ? (frustrationLevel >= 3
          ? "I understand this might be frustrating. Let me give you some more direct guidance. What specific part are you struggling with?"
          : "I'm here to help you think through this. What part of the problem would you like to explore first?")
        : "I'm here to help! Let me provide a straightforward answer to your question.";
          
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: fallbackMessage,
        assistant: mode
      }]);
    } finally {
      setIsLoading(false);
      // Focus back on input after response
      inputRef.current?.focus();
    }
  };

  const switchMode = (newMode: 'socratic' | 'buddy') => {
    if (newMode === mode) return;
    
    setMode(newMode);
    setFrustrationLevel(0);
    
    // Add a welcome message for the new mode
    const welcomeMessage = newMode === 'socratic' 
      ? "I'm now in Socratic mode. Instead of giving direct answers, I'll guide you through questions to help you discover the answers yourself. What would you like to explore?"
      : "Hi there! I'm Buddy, your direct-answer assistant. I'll give you straightforward explanations without the Socratic method. How can I help you today?";
      
    setMessages([
      { role: 'assistant', content: welcomeMessage, assistant: newMode }
    ]);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex flex-col h-screen w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-6 py-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-600 text-white'}`}>
        <h1 className="text-xl font-bold">AI Learning Assistant</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className={`h-2.5 w-2.5 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></span>
            <span className="text-sm">{isLoading ? 'Thinking...' : 'Online'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTheme}
              className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-700'}`}
            >
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
          <Link href="/student/dashboard" className="text-blue-400 hover:text-blue-300">
            Dashboard
          </Link>
        </div>
      </header>

      {/* Mode selector */}
      <div className="flex space-x-4 p-4">
        <button
          onClick={() => switchMode('socratic')}
          className={`flex-1 py-2 rounded-md text-center ${
            mode === 'socratic' 
              ? theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500 text-white' 
              : theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border'
          }`}
        >
          Socratic Tutor
        </button>
        <button
          onClick={() => switchMode('buddy')}
          className={`flex-1 py-2 rounded-md text-center ${
            mode === 'buddy' 
              ? theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500 text-white' 
              : theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border'
          }`}
        >
          Buddy (Direct Answers)
        </button>
      </div>

      {/* Mode description */}
      <div className={`px-4 py-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {mode === 'socratic' ? (
          'Socratic: Guiding you to discover answers through thoughtful questions'
        ) : (
          'Buddy: Providing direct, straightforward answers to your questions'
        )}
      </div>

      {/* Chat messages - Modified to better handle rendering of messages */}
      <div className={`flex-1 p-4 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.map((message, index) => {
          // Skip messages from other assistant modes
          if (message.role === 'assistant' && message.assistant && message.assistant !== mode) {
            return null;
          }
          
          return (
            <div 
              key={index} 
              className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block max-w-[80%] px-4 py-3 rounded-lg ${
                  message.role === 'user' 
                    ? theme === 'dark' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-blue-500 text-white rounded-br-none'
                    : theme === 'dark'
                      ? 'bg-gray-800 border border-gray-700 rounded-bl-none'
                      : 'bg-white border rounded-bl-none'
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
      <form onSubmit={handleSubmit} className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border-t'}`}>
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question..."
            className={`flex-1 px-4 py-3 rounded-l-md focus:outline-none ${
              theme === 'dark' 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white border'
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-r-md text-white ${
              isLoading 
                ? 'bg-gray-500' 
                : mode === 'socratic' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
        <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {mode === 'socratic'
            ? 'The Socratic Tutor will guide your learning through questions. If you get frustrated, it will detect this and provide more direct answers.'
            : 'Buddy will give you direct, straightforward answers to your questions without the Socratic method.'}
        </p>
      </form>
    </div>
  );
}