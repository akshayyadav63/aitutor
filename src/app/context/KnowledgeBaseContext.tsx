'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Knowledge base item type
export interface KnowledgeBaseItem {
  id: number;
  topic: string;
  explanation: string;
  imageUrl: string;
  subject?: string;
  facultyName?: string;
  date?: string;
}

// Document file type
export interface DocumentFile {
  id: number;
  fileName: string;
  fileType: 'pdf' | 'excel' | 'word' | 'other';
  fileUrl: string;
  uploadDate: string;
  subject: string;
  facultyName: string;
  description?: string;
  keywords: string[];
  size: string;
}

// Subjects for categorization
export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Literature',
  'Economics',
  'Business',
  'Art',
  'Music',
  'Other'
];

// Initial mock data
const initialKnowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 1,
    topic: 'Introduction to Quantum Physics',
    explanation: 'Quantum physics is a fundamental theory in physics that describes the behavior of matter and energy at the atomic and subatomic scales. It departs from classical physics in that energy, momentum, and other quantities are often restricted to discrete values (quantization), objects have characteristics of both particles and waves, and there are limits to how accurately the value of a physical quantity can be predicted before measurement.\n\nQuantum mechanics gradually arose from theories to explain observations which could not be reconciled with classical physics, such as Max Planck\'s solution in 1900 to the black-body radiation problem, and the correspondence between energy and frequency in Albert Einstein\'s 1905 paper which explained the photoelectric effect.\n\nKey principles of quantum mechanics include the uncertainty principle developed by Werner Heisenberg, which states that the more precisely one property is measured, the less precisely the complementary property can be known; and wave-particle duality, which states that all particles exhibit both wave and particle properties under different experimental conditions.',
    imageUrl: '/quantum.jpg',
    subject: 'Physics',
    facultyName: 'Dr. Richard Feynman',
    date: '2023-11-15'
  },
  {
    id: 2,
    topic: 'The Basics of Machine Learning',
    explanation: 'Machine learning is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns, and make decisions with minimal human intervention. It involves algorithms that can improve automatically through experience and by the use of data. It is widely used in applications like image recognition, speech recognition, email filtering, and recommendation systems.\n\nThere are several types of machine learning:\n\n1. Supervised Learning: The algorithm learns from labeled training data, and makes predictions based on that data.\n\n2. Unsupervised Learning: The algorithm learns from unlabeled data, finding patterns or intrinsic structures in the input data.\n\n3. Reinforcement Learning: The algorithm learns by interacting with an environment, receiving rewards for correct actions and penalties for incorrect ones.\n\nMachine learning algorithms include decision trees, neural networks, support vector machines, k-means clustering, and many others. The choice of algorithm depends on the specific problem and the nature of the available data.',
    imageUrl: '/machine-learning.jpg',
    subject: 'Computer Science',
    facultyName: 'Dr. Andrew Ng',
    date: '2023-12-01'
  },
  {
    id: 3,
    topic: 'Cell Biology Fundamentals',
    explanation: 'Cell biology is the study of cell structure and function, and it revolves around the concept that the cell is the fundamental unit of life. Cells are the smallest unit of life that can replicate independently, and all living things are made up of one or more cells. Cell biology focuses on the structure, organelles, and function of cells, as well as how cells interact with their environment.\n\nThere are two main types of cells:\n\n1. Prokaryotic cells: These are simpler, smaller cells that lack a true nucleus and membrane-bound organelles. Bacteria are examples of prokaryotic cells.\n\n2. Eukaryotic cells: These are more complex cells with a true nucleus and various membrane-bound organelles. Plants, animals, fungi, and protists are made up of eukaryotic cells.\n\nKey organelles in eukaryotic cells include the nucleus (which contains genetic material), mitochondria (which generate energy), endoplasmic reticulum (involved in protein synthesis), Golgi apparatus (involved in protein processing and packaging), lysosomes (involved in digestion and waste removal), and ribosomes (involved in protein synthesis).',
    imageUrl: '/cell-biology.jpg',
    subject: 'Biology',
    facultyName: 'Dr. Jane Goodall',
    date: '2023-10-20'
  }
];

// Initial mock document files
const initialDocuments: DocumentFile[] = [
  {
    id: 1,
    fileName: 'Quantum_Physics_Lecture_Notes.pdf',
    fileType: 'pdf',
    fileUrl: '/files/quantum-physics.pdf',
    uploadDate: '2023-11-16',
    subject: 'Physics',
    facultyName: 'Dr. Richard Feynman',
    description: 'Comprehensive lecture notes on quantum physics fundamentals',
    keywords: ['quantum', 'physics', 'mechanics', 'wave', 'particle'],
    size: '2.4 MB'
  },
  {
    id: 2,
    fileName: 'Machine_Learning_Algorithms.pdf',
    fileType: 'pdf',
    fileUrl: '/files/ml-algorithms.pdf',
    uploadDate: '2023-12-02',
    subject: 'Computer Science',
    facultyName: 'Dr. Andrew Ng',
    description: 'Overview of popular machine learning algorithms and their applications',
    keywords: ['machine learning', 'algorithms', 'AI', 'neural networks'],
    size: '3.1 MB'
  },
  {
    id: 3,
    fileName: 'Cell_Biology_Data.xlsx',
    fileType: 'excel',
    fileUrl: '/files/cell-biology-data.xlsx',
    uploadDate: '2023-10-21',
    subject: 'Biology',
    facultyName: 'Dr. Jane Goodall',
    description: 'Experimental data on cell structures and functions',
    keywords: ['biology', 'cell', 'data', 'experiment', 'organelles'],
    size: '1.8 MB'
  }
];

// Create context type
interface KnowledgeBaseContextType {
  knowledgeBase: KnowledgeBaseItem[];
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseItem[]>>;
  documents: DocumentFile[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>>;
  addTopic: (topic: Omit<KnowledgeBaseItem, 'id'>) => void;
  updateTopic: (topic: KnowledgeBaseItem) => void;
  deleteTopic: (id: number) => void;
  addDocument: (document: Omit<DocumentFile, 'id'>) => void;
  updateDocument: (document: DocumentFile) => void;
  deleteDocument: (id: number) => void;
  getTopicsBySubject: (subject: string) => KnowledgeBaseItem[];
  getDocumentsBySubject: (subject: string) => DocumentFile[];
  getDocumentsByFaculty: (facultyName: string) => DocumentFile[];
  searchDocuments: (query: string) => DocumentFile[];
}

// Create context with default values
const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | null>(null);

// Custom hook for using the knowledge base context
export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};

// Knowledge base provider component
export const KnowledgeBaseProvider = ({ children }: { children: ReactNode }) => {
  // Initialize knowledge base from localStorage if available, otherwise use default
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('knowledgeBase');
      return saved ? JSON.parse(saved) : initialKnowledgeBase;
    }
    return initialKnowledgeBase;
  });

  // Initialize documents from localStorage if available, otherwise use default
  const [documents, setDocuments] = useState<DocumentFile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('documents');
      return saved ? JSON.parse(saved) : initialDocuments;
    }
    return initialDocuments;
  });

  // Save knowledge base to localStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase));
    }
  }, [knowledgeBase]);

  // Save documents to localStorage whenever they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('documents', JSON.stringify(documents));
    }
  }, [documents]);

  // Add a new topic
  const addTopic = (topic: Omit<KnowledgeBaseItem, 'id'>) => {
    const newTopic = {
      ...topic,
      id: knowledgeBase.length > 0 ? Math.max(...knowledgeBase.map(item => item.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0]
    };
    setKnowledgeBase(prev => [...prev, newTopic]);
  };

  // Update an existing topic
  const updateTopic = (topic: KnowledgeBaseItem) => {
    setKnowledgeBase(prev => prev.map(item => item.id === topic.id ? topic : item));
  };

  // Delete a topic
  const deleteTopic = (id: number) => {
    setKnowledgeBase(prev => prev.filter(item => item.id !== id));
  };

  // Add a new document
  const addDocument = (document: Omit<DocumentFile, 'id'>) => {
    const newDocument = {
      ...document,
      id: documents.length > 0 ? Math.max(...documents.map(item => item.id)) + 1 : 1
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  // Update an existing document
  const updateDocument = (document: DocumentFile) => {
    setDocuments(prev => prev.map(item => item.id === document.id ? document : item));
  };

  // Delete a document
  const deleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(item => item.id !== id));
  };

  // Get topics by subject
  const getTopicsBySubject = (subject: string) => {
    return knowledgeBase.filter(item => item.subject === subject);
  };

  // Get documents by subject
  const getDocumentsBySubject = (subject: string) => {
    return documents.filter(item => item.subject === subject);
  };

  // Get documents by faculty
  const getDocumentsByFaculty = (facultyName: string) => {
    return documents.filter(item => item.facultyName === facultyName);
  };

  // Search documents by keywords
  const searchDocuments = (query: string) => {
    if (!query.trim()) return documents;
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return documents.filter(doc => 
      // Check if any keyword matches
      doc.keywords.some(keyword => 
        searchTerms.some(term => keyword.toLowerCase().includes(term))
      ) ||
      // Or if filename matches
      searchTerms.some(term => doc.fileName.toLowerCase().includes(term)) ||
      // Or if description matches
      (doc.description && searchTerms.some(term => doc.description!.toLowerCase().includes(term))) ||
      // Or if subject matches
      searchTerms.some(term => doc.subject.toLowerCase().includes(term))
    );
  };

  return (
    <KnowledgeBaseContext.Provider 
      value={{ 
        knowledgeBase, 
        setKnowledgeBase, 
        documents, 
        setDocuments,
        addTopic, 
        updateTopic, 
        deleteTopic,
        addDocument,
        updateDocument,
        deleteDocument,
        getTopicsBySubject,
        getDocumentsBySubject,
        getDocumentsByFaculty,
        searchDocuments
      }}
    >
      {children}
    </KnowledgeBaseContext.Provider>
  );
}; 