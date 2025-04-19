'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define available themes
export type ThemeName = 'light' | 'dark' | 'ocean';

export interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    secondaryText: string;
    linkText: string;
    buttonText: string;
    inputBg: string;
    inputText: string;
    inputBorder: string;
    border: string;
    hover: string;
    accent: string;
    userMessage: string;
    userMessageText: string;
    aiMessage: string;
    aiMessageText: string;
  };
}

// Theme definitions
export const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    label: 'Light',
    colors: {
      primary: 'bg-blue-600',
      secondary: 'bg-purple-600',
      background: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      secondaryText: 'text-gray-700',
      linkText: 'text-blue-700',
      buttonText: 'text-white',
      inputBg: 'bg-white',
      inputText: 'text-black',
      inputBorder: 'border-gray-300',
      border: 'border-gray-200',
      hover: 'bg-gray-50',
      accent: 'bg-blue-100',
      userMessage: 'bg-blue-600',
      userMessageText: 'text-white',
      aiMessage: 'bg-gray-200',
      aiMessageText: 'text-black'
    }
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    colors: {
      primary: 'bg-blue-500',
      secondary: 'bg-purple-500',
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-gray-100',
      secondaryText: 'text-gray-300',
      linkText: 'text-blue-300',
      buttonText: 'text-white',
      inputBg: 'bg-gray-700',
      inputText: 'text-gray-100',
      inputBorder: 'border-gray-600',
      border: 'border-gray-700',
      hover: 'bg-gray-700',
      accent: 'bg-blue-900',
      userMessage: 'bg-blue-500',
      userMessageText: 'text-white',
      aiMessage: 'bg-gray-700',
      aiMessageText: 'text-gray-100'
    }
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    colors: {
      primary: 'bg-teal-600',
      secondary: 'bg-indigo-600',
      background: 'bg-cyan-50',
      card: 'bg-cyan-100',
      text: 'text-gray-900',
      secondaryText: 'text-gray-700',
      linkText: 'text-teal-800',
      buttonText: 'text-white',
      inputBg: 'bg-white',
      inputText: 'text-black',
      inputBorder: 'border-cyan-300',
      border: 'border-cyan-200',
      hover: 'bg-cyan-200',
      accent: 'bg-teal-100',
      userMessage: 'bg-teal-600',
      userMessageText: 'text-white',
      aiMessage: 'bg-cyan-200',
      aiMessageText: 'text-black'
    }
  }
};

// Create context type
interface ThemeContextType {
  currentTheme: Theme;
  setThemeName: (name: ThemeName) => void;
  themeNames: ThemeName[];
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType | null>(null);

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with saved theme if available, otherwise use light theme
  const [themeName, setThemeName] = useState<ThemeName>('light');
  
  // Load saved theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeName;
      if (savedTheme && themes[savedTheme]) {
        setThemeName(savedTheme);
      }
    }
  }, []);
  
  // Save theme whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', themeName);
      
      // Also update body class for global theming
      document.body.classList.remove('theme-light', 'theme-dark', 'theme-ocean');
      document.body.classList.add(`theme-${themeName}`);
    }
  }, [themeName]);
  
  const themeNames = Object.keys(themes) as ThemeName[];
  
  return (
    <ThemeContext.Provider value={{ 
      currentTheme: themes[themeName], 
      setThemeName,
      themeNames
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 