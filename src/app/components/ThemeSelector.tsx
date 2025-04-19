'use client';

import { useState } from 'react';
import { useTheme, ThemeName, themes } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { currentTheme, setThemeName, themeNames } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (themeName: ThemeName) => {
    setThemeName(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${themes[currentTheme.name].colors.primary} ${themes[currentTheme.name].colors.buttonText} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-2">Theme: {currentTheme.label}</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${themes[currentTheme.name].colors.card} ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {themeNames.map((name) => (
              <button
                key={name}
                onClick={() => handleThemeChange(name)}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  currentTheme.name === name
                    ? `${themes[currentTheme.name].colors.primary} ${themes[currentTheme.name].colors.buttonText}`
                    : `${themes[currentTheme.name].colors.text}`
                } hover:bg-gray-100 hover:dark:bg-gray-700`}
                role="menuitem"
              >
                {themes[name].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 