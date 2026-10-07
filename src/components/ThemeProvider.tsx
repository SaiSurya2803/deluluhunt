"use client";

import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { ThemeToggle } from './ThemeToggle';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // We attach the light-theme class to the document body to make it truly global
    if (!isDarkMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isDarkMode]);

  return (
    <>
      {children}
      <ThemeToggle />
    </>
  );
}
