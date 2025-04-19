'use client';

import { useState } from 'react';
import { useKnowledgeBase, SUBJECTS } from '../context/KnowledgeBaseContext';
import { useTheme } from '../context/ThemeContext';

export default function FileUploader() {
  const { addDocument } = useKnowledgeBase();
  const { currentTheme } = useTheme();
  const colors = currentTheme.colors;
  
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [facultyName, setFacultyName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Auto-detect subject from filename
      for (const subj of SUBJECTS) {
        if (selectedFile.name.toLowerCase().includes(subj.toLowerCase())) {
          setSubject(subj);
          break;
        }
      }
    }
  };
  
  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['xlsx', 'xls', 'csv'].includes(extension || '')) return 'excel';
    if (['doc', 'docx'].includes(extension || '')) return 'word';
    return 'other';
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ text: 'Please select a file to upload', type: 'error' });
      return;
    }
    
    if (!facultyName) {
      setMessage({ text: 'Please enter the faculty name', type: 'error' });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real application, you would upload the file to a server/cloud storage
      // For this demo, we'll just simulate a file upload by adding a document entry
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock URL for the file
      const fileUrl = `/files/${fileName.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Add the document to the knowledge base
      addDocument({
        fileName,
        fileType: getFileType(fileName) as any,
        fileUrl,
        uploadDate: new Date().toISOString().split('T')[0],
        subject,
        facultyName,
        description,
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        size: formatFileSize(file.size)
      });
      
      // Reset form
      setFile(null);
      setFileName('');
      setDescription('');
      setSubject(SUBJECTS[0]);
      setFacultyName('');
      setKeywords('');
      
      setMessage({ text: 'File uploaded successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Error uploading file. Please try again.', type: 'error' });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className={`mt-6 ${colors.card} rounded-lg shadow p-6`}>
      <h2 className={`text-xl font-semibold mb-4 ${colors.text}`}>Upload Learning Materials</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file" className={`block text-sm font-medium ${colors.text} mb-1`}>
            File (PDF, Excel, or Word) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="subject" className={`block text-sm font-medium ${colors.text} mb-1`}>
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              {SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="facultyName" className={`block text-sm font-medium ${colors.text} mb-1`}>
              Faculty Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="facultyName"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              placeholder="Professor Name"
              className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className={`block text-sm font-medium ${colors.text} mb-1`}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the file content"
            rows={3}
            className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="keywords" className={`block text-sm font-medium ${colors.text} mb-1`}>
            Keywords (comma separated)
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="physics, quantum, mechanics"
            className={`w-full px-3 py-2 ${colors.inputBg} ${colors.inputText} border ${colors.inputBorder} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <p className={`mt-1 text-xs ${colors.secondaryText}`}>Add keywords to help students find this file when searching</p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 ${colors.primary} ${colors.buttonText} rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : 'Upload File'}
          </button>
        </div>
      </form>
    </div>
  );
} 