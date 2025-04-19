'use client';

import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useKnowledgeBase, SUBJECTS } from '../context/KnowledgeBaseContext';

// Dummy document data until we have a real document context
const mockDocuments = [
  { 
    id: '1', 
    title: 'Introduction to Mathematics', 
    subject: 'Math', 
    fileType: 'pdf', 
    size: '2.4MB',
    uploadDate: '2023-10-15',
    facultyName: 'Dr. Smith',
    url: '#' 
  },
  { 
    id: '2', 
    title: 'Physics Formula Sheet', 
    subject: 'Physics', 
    fileType: 'pdf', 
    size: '1.2MB',
    uploadDate: '2023-10-12',
    facultyName: 'Dr. Johnson',
    url: '#' 
  },
  { 
    id: '3', 
    title: 'Chemistry Lab Results', 
    subject: 'Chemistry', 
    fileType: 'xlsx', 
    size: '856KB',
    uploadDate: '2023-10-10',
    facultyName: 'Dr. Williams',
    url: '#' 
  },
  { 
    id: '4', 
    title: 'Biology Lecture Notes', 
    subject: 'Biology', 
    fileType: 'pdf', 
    size: '3.1MB',
    uploadDate: '2023-10-05',
    facultyName: 'Dr. Brown',
    url: '#' 
  },
  { 
    id: '5', 
    title: 'Computer Science Project Data', 
    subject: 'Computer Science', 
    fileType: 'xlsx', 
    size: '1.7MB',
    uploadDate: '2023-10-02',
    facultyName: 'Dr. Davis',
    url: '#' 
  },
  { 
    id: '6', 
    title: 'Literature Review Guidelines', 
    subject: 'English', 
    fileType: 'pdf', 
    size: '542KB',
    uploadDate: '2023-09-28',
    facultyName: 'Dr. Wilson',
    url: '#' 
  }
];

interface DocumentListProps {
  title?: string;
  filterBySubject?: string;
  filterByFileType?: 'pdf' | 'xlsx' | string;
  showSubjectFilter?: boolean;
  showSearch?: boolean;
  showDownloadButton?: boolean;
  maxItems?: number;
}

export default function DocumentList({
  title,
  filterBySubject,
  filterByFileType,
  showSubjectFilter = false,
  showSearch = false,
  showDownloadButton = true,
  maxItems
}: DocumentListProps) {
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(filterBySubject || 'All');

  // Filter documents based on props and state
  let filteredDocuments = [...mockDocuments];
  
  if (filterBySubject && filterBySubject !== 'All') {
    filteredDocuments = filteredDocuments.filter(doc => doc.subject === filterBySubject);
  } else if (selectedSubject !== 'All') {
    filteredDocuments = filteredDocuments.filter(doc => doc.subject === selectedSubject);
  }
  
  if (filterByFileType) {
    filteredDocuments = filteredDocuments.filter(doc => doc.fileType === filterByFileType);
  }
  
  if (searchQuery) {
    filteredDocuments = filteredDocuments.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.facultyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Limit number of items if maxItems is specified
  if (maxItems && filteredDocuments.length > maxItems) {
    filteredDocuments = filteredDocuments.slice(0, maxItems);
  }

  // Function to get icon based on file type
  const getFileIcon = (fileType: string) => {
    switch(fileType) {
      case 'pdf':
        return '📄';
      case 'xlsx':
        return '📊';
      default:
        return '📁';
    }
  };

  const handleDownload = (docId: string) => {
    // Implement actual download functionality
    console.log(`Downloading document ${docId}`);
    alert('Document download started'); // Replace with toast notification in production
  };

  return (
    <div>
      {title && <h3 className={`text-lg font-medium ${colors.text} mb-3`}>{title}</h3>}
      
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        {showSearch && (
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className={`w-full px-3 py-2 border ${colors.inputBorder} rounded-md ${colors.inputBg} ${colors.inputText} focus:outline-none focus:ring-blue-500`}
            />
          </div>
        )}
        
        {showSubjectFilter && (
          <div>
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
        )}
      </div>
      
      {filteredDocuments.length > 0 ? (
        <div className={`border ${colors.border} rounded-md overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={colors.card}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>Document</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>Subject</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>Faculty</th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>Date</th>
                  {showDownloadButton && (
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.secondaryText} uppercase tracking-wider`}>Download</th>
                  )}
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${colors.card}`}>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className={`hover:${colors.hover}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          <span className="text-xl">{getFileIcon(doc.fileType)}</span>
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${colors.text}`}>{doc.title}</div>
                          <div className={`text-sm ${colors.secondaryText}`}>{doc.fileType.toUpperCase()} • {doc.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doc.subject}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${colors.text}`}>
                      {doc.facultyName}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${colors.secondaryText}`}>
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    {showDownloadButton && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className={`${colors.primary} text-white px-3 py-1 rounded hover:opacity-90`}
                        >
                          Download
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`p-4 text-center ${colors.secondaryText}`}>
          No documents found {searchQuery ? `for "${searchQuery}"` : ''}
        </div>
      )}
    </div>
  );
} 