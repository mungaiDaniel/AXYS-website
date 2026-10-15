'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Get initial theme synchronously to prevent flash
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('aib-theme');
    return storedTheme === 'light' ? 'light' : 'dark';
  }
  return 'dark';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Set theme on mount from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('aib-theme');
    const initialTheme = storedTheme === 'dark' ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);
  }, []);

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('aib-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
