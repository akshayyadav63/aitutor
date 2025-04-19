'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKnowledgeBase, SUBJECTS } from '../../context/KnowledgeBaseContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeSelector from '../../components/ThemeSelector';
import DocumentList from '../../components/DocumentList';

export default function StudentDashboard() {
  const { knowledgeBase } = useKnowledgeBase();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(knowledgeBase);
  const [activeTab, setActiveTab] = useState<'learning' | 'documents'>('learning');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search algorithm to find matching topics or explanations
    const results = knowledgeBase.filter(item => 
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const navigateToAiTutor = (assistantType: 'tutor' | 'buddy' = 'tutor') => {
    router.push('/student/ai-tutor');
  };

  const filteredTopics = selectedSubject === 'All' 
    ? knowledgeBase 
    : knowledgeBase.filter(item => item.subject === selectedSubject);

  return (
    <div className={`min-h-screen ${colors.background}`}>
      {/* Header */}
      <header className={`${colors.card} shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${colors.text}`}>Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ThemeSelector />
            <Link href="/" className={`${colors.linkText} hover:opacity-80`}>
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('learning')}
              className={`${
                activeTab === 'learning'
                  ? `${colors.linkText} border-b-2 border-blue-500`
                  : `${colors.secondaryText} border-b-2 border-transparent`
              } whitespace-nowrap py-4 px-1 font-medium text-sm`}
            >
              Learning Resources
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`${
                activeTab === 'documents'
                  ? `${colors.linkText} border-b-2 border-blue-500`
                  : `${colors.secondaryText} border-b-2 border-transparent`
              } whitespace-nowrap py-4 px-1 font-medium text-sm`}
            >
              Study Materials
            </button>
          </nav>
        </div>

        {activeTab === 'learning' ? (
          <>
            {/* AI Tutors Section */}
            <div className={`${colors.card} shadow rounded-lg p-6 mb-8`}>
              <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>AI Learning Assistants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`border ${colors.border} rounded-lg p-6 flex flex-col h-full`}>
                  <h3 className={`text-lg font-medium ${colors.text} mb-2`}>Socratic Tutor</h3>
                  <p className={`text-sm ${colors.secondaryText} mb-4 flex-grow`}>
                    Learn through guided questioning. This tutor follows the Socratic method, 
                    helping you discover answers through critical thinking and exploration.
                  </p>
                  <button
                    onClick={() => navigateToAiTutor('tutor')}
                    className={`${colors.primary} ${colors.buttonText} px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-full`}
                  >
                    Start Learning
                  </button>
                </div>
                
                <div className={`border ${colors.border} rounded-lg p-6 flex flex-col h-full`}>
                  <h3 className={`text-lg font-medium ${colors.text} mb-2`}>Buddy Assistant</h3>
                  <p className={`text-sm ${colors.secondaryText} mb-4 flex-grow`}>
                    Get direct answers to your questions. Buddy provides straightforward explanations
                    and solutions without the question-based approach.
                  </p>
                  <button
                    onClick={() => navigateToAiTutor('buddy')}
                    className={`${colors.secondary} ${colors.buttonText} px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-full`}
                  >
                    Ask Buddy
                  </button>
                </div>
              </div>
            </div>

            <div className={`${colors.card} shadow rounded-lg p-6 mb-8`}>
              <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>Knowledge Base Search</h2>
              <form onSubmit={handleSearch} className="flex mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for topics..."
                  className={`flex-1 px-4 py-2 border ${colors.inputBorder} rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${colors.inputBg} ${colors.inputText}`}
                />
                <button
                  type="submit"
                  className={`${colors.primary} ${colors.buttonText} px-6 py-2 rounded-r-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Search
                </button>
              </form>

              {/* Search results */}
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  <h3 className={`text-lg font-medium ${colors.text}`}>Search Results</h3>
                  <ul className="space-y-3">
                    {searchResults.map((result) => (
                      <li key={result.id} className={`border-b ${colors.border} pb-3`}>
                        <Link href={`/student/topic/${result.id}`} className={`block hover:${colors.hover} p-2 rounded`}>
                          <h4 className={`text-md font-medium ${colors.linkText}`}>{result.topic}</h4>
                          <p className={`text-sm ${colors.secondaryText} truncate`}>{result.explanation.substring(0, 150)}...</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : searchQuery ? (
                <p className={colors.secondaryText}>No results found for "{searchQuery}"</p>
              ) : null}
            </div>

            {/* Subject and Topics */}
            <div className={`${colors.card} shadow rounded-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${colors.text}`}>Learning Topics</h2>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className={`px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-blue-500`}
                >
                  <option value="All">All Subjects</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((item) => (
                  <Link href={`/student/topic/${item.id}`} key={item.id} className={`border ${colors.border} rounded-lg overflow-hidden hover:shadow-md transition-shadow`}>
                    <div className={`h-32 ${colors.accent} flex items-center justify-center`}>
                      <span className={colors.secondaryText}>Image placeholder</span>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-medium ${colors.text} truncate`}>{item.topic}</h3>
                        {item.subject && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                            {item.subject}
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm ${colors.secondaryText} line-clamp-2`}>{item.explanation.substring(0, 100)}...</p>
                      {item.facultyName && (
                        <p className={`mt-2 text-xs ${colors.secondaryText}`}>
                          by {item.facultyName}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Document viewer */
          <div className="space-y-8">
            <div className={`${colors.card} shadow rounded-lg p-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>Study Materials</h2>
              <p className={`mb-4 ${colors.secondaryText}`}>
                Download lecture notes, reference materials, and other resources uploaded by your professors.
              </p>
              <DocumentList 
                title="All Study Materials" 
                showSubjectFilter={true} 
                showSearch={true} 
                showDownloadButton={true}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${colors.card} shadow rounded-lg p-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>PDF Documents</h2>
                <DocumentList 
                  filterBySubject={selectedSubject === 'All' ? undefined : selectedSubject}
                  maxItems={5}
                  showSubjectFilter={false}
                  showSearch={false}
                />
              </div>
              
              <div className={`${colors.card} shadow rounded-lg p-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>Spreadsheets & Data</h2>
                <DocumentList 
                  filterBySubject={selectedSubject === 'All' ? undefined : selectedSubject}
                  maxItems={5}
                  showSubjectFilter={false}
                  showSearch={false}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 