'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useKnowledgeBase, KnowledgeBaseItem } from '../../../context/KnowledgeBaseContext';

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const { knowledgeBase } = useKnowledgeBase();
  const [topic, setTopic] = useState<KnowledgeBaseItem | null>(null);

  useEffect(() => {
    // Find the topic in the knowledge base
    const foundTopic = knowledgeBase.find(item => item.id === parseInt(id));
    setTopic(foundTopic || null);
  }, [id, knowledgeBase]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Topic not found</h1>
        <Link href="/student/dashboard" className="mt-4 text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Topic header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{topic.topic}</h2>
          </div>

          {/* Topic image (if available) */}
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Image placeholder for {topic.topic}</span>
          </div>

          {/* Topic explanation */}
          <div className="px-6 py-6">
            {topic.explanation.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <Link
              href="/student/ai-tutor"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Get AI Help with this Topic
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Print / Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 