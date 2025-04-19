'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useKnowledgeBase, KnowledgeBaseItem, SUBJECTS } from '../../context/KnowledgeBaseContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeSelector from '../../components/ThemeSelector';
import FileUploader from '../../components/FileUploader';
import DocumentList from '../../components/DocumentList';

export default function FacultyDashboard() {
  const { knowledgeBase, addTopic, updateTopic, deleteTopic } = useKnowledgeBase();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<KnowledgeBaseItem>({ 
    id: 0, 
    topic: '', 
    explanation: '', 
    imageUrl: '',
    subject: SUBJECTS[0],
    facultyName: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'topics' | 'documents'>('topics');

  // Filter knowledge base by search query
  const filteredKnowledgeBase = knowledgeBase.filter(item =>
    item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentTopic(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload (mock)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload the file to a server
      // For demo purposes, we'll just use a placeholder
      setCurrentTopic(prev => ({ ...prev, imageUrl: '/placeholder.jpg' }));
    }
  };

  // Handle adding a new topic
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the addTopic function from context
    addTopic({
      topic: currentTopic.topic,
      explanation: currentTopic.explanation,
      imageUrl: currentTopic.imageUrl || '/placeholder.jpg',
      subject: currentTopic.subject,
      facultyName: currentTopic.facultyName
    });
    setShowAddModal(false);
    resetForm();
  };

  // Handle updating an existing topic
  const handleUpdateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the updateTopic function from context
    updateTopic(currentTopic);
    setShowEditModal(false);
    resetForm();
  };

  // Handle deleting a topic
  const handleDeleteTopic = (id: number) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      // Use the deleteTopic function from context
      deleteTopic(id);
    }
  };

  // Open edit modal with topic data
  const openEditModal = (topic: KnowledgeBaseItem) => {
    setCurrentTopic({ ...topic });
    setShowEditModal(true);
  };

  // Reset form fields
  const resetForm = () => {
    setCurrentTopic({ 
      id: 0, 
      topic: '', 
      explanation: '', 
      imageUrl: '',
      subject: SUBJECTS[0],
      facultyName: ''
    });
  };

  return (
    <div className={`min-h-screen ${colors.background}`}>
      {/* Header */}
      <header className={`${colors.card} shadow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${colors.text}`}>Faculty Dashboard</h1>
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
              onClick={() => setActiveTab('topics')}
              className={`${
                activeTab === 'topics'
                  ? `${colors.linkText} border-b-2 border-blue-500`
                  : `${colors.secondaryText} border-b-2 border-transparent`
              } whitespace-nowrap py-4 px-1 font-medium text-sm`}
            >
              Knowledge Base Topics
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`${
                activeTab === 'documents'
                  ? `${colors.linkText} border-b-2 border-blue-500`
                  : `${colors.secondaryText} border-b-2 border-transparent`
              } whitespace-nowrap py-4 px-1 font-medium text-sm`}
            >
              Document Management
            </button>
          </nav>
        </div>

        {activeTab === 'topics' ? (
          /* Knowledge base management */
          <div className={`${colors.card} shadow rounded-lg p-6 mb-8`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${colors.text}`}>Knowledge Base Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className={`${colors.secondary} ${colors.buttonText} px-4 py-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              >
                Add New Topic
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics..."
                  className={`w-full px-4 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Topics list */}
            <div className={`${colors.card} shadow overflow-hidden sm:rounded-md`}>
              {filteredKnowledgeBase.length > 0 ? (
                <ul className={`divide-y ${colors.border}`}>
                  {filteredKnowledgeBase.map((topic) => (
                    <li key={topic.id} className={`px-6 py-4 flex items-center justify-between hover:${colors.hover}`}>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium ${colors.text} truncate`}>{topic.topic}</h3>
                        <p className={`text-sm ${colors.secondaryText} truncate`}>{topic.explanation.substring(0, 100)}...</p>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2`}>
                            {topic.subject || 'Uncategorized'}
                          </span>
                          {topic.facultyName && (
                            <span className={`text-xs ${colors.secondaryText}`}>
                              by {topic.facultyName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => openEditModal(topic)}
                          className={`font-medium ${colors.linkText} hover:opacity-80`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`px-6 py-10 text-center ${colors.secondaryText}`}>
                  {searchQuery ? 'No topics found matching your search.' : 'No topics in the knowledge base yet.'}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Document management */
          <div>
            <FileUploader />
            <div className="mt-8">
              <DocumentList title="Uploaded Documents" showSubjectFilter={true} showSearch={true} />
            </div>
          </div>
        )}
      </main>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${colors.card} rounded-lg shadow-xl w-full max-w-md p-6`}>
            <h3 className={`text-lg font-medium ${colors.text} mb-4`}>Add New Topic</h3>
            <form onSubmit={handleAddTopic}>
              <div className="mb-4">
                <label htmlFor="topic" className={`block text-sm font-medium ${colors.text} mb-1`}>
                  Topic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={currentTopic.topic}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium ${colors.text} mb-1`}>
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={currentTopic.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  >
                    {SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="facultyName" className={`block text-sm font-medium ${colors.text} mb-1`}>
                    Faculty Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="facultyName"
                    name="facultyName"
                    value={currentTopic.facultyName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="explanation" className={`block text-sm font-medium ${colors.text} mb-1`}>
                  Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="explanation"
                  name="explanation"
                  value={currentTopic.explanation}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                ></textarea>
              </div>
              <div className="mb-6">
                <label htmlFor="image" className={`block text-sm font-medium ${colors.text} mb-1`}>
                  Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className={`px-4 py-2 border ${colors.inputBorder} rounded-md text-sm font-medium ${colors.text} hover:${colors.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${colors.buttonText} ${colors.secondary} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${colors.card} rounded-lg shadow-xl w-full max-w-md p-6`}>
            <h3 className={`text-lg font-medium ${colors.text} mb-4`}>Edit Topic</h3>
            <form onSubmit={handleUpdateTopic}>
              <div className="mb-4">
                <label htmlFor="edit-topic" className={`block text-sm font-medium ${colors.text} mb-1`}>
                  Topic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-topic"
                  name="topic"
                  value={currentTopic.topic}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="edit-subject" className={`block text-sm font-medium ${colors.text} mb-1`}>
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-subject"
                    name="subject"
                    value={currentTopic.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  >
                    {SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-facultyName" className={`block text-sm font-medium ${colors.text} mb-1`}>
                    Faculty Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-facultyName"
                    name="facultyName"
                    value={currentTopic.facultyName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-explanation" className={`block text-sm font-medium ${colors.text} mb-1`}>
                  Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-explanation"
                  name="explanation"
                  value={currentTopic.explanation}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                ></textarea>
              </div>
              <div className="mb-6">
                <label htmlFor="edit-image" className={`block text-sm font-medium ${colors.text} mb-1`}>
                  Update Image (Optional)
                </label>
                <input
                  type="file"
                  id="edit-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
                />
                {currentTopic.imageUrl && (
                  <div className="mt-2 flex items-center">
                    <span className={`text-sm ${colors.secondaryText} mr-2`}>Current image:</span>
                    <span className={`text-sm ${colors.text} font-medium`}>{currentTopic.imageUrl.split('/').pop()}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className={`px-4 py-2 border ${colors.inputBorder} rounded-md text-sm font-medium ${colors.text} hover:${colors.hover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${colors.buttonText} ${colors.secondary} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  Update Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 