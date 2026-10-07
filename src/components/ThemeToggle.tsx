"use client";

import React from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();

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
