"use client";

import React from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeToggle() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title="Toggle Dark/Light Theme"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}
